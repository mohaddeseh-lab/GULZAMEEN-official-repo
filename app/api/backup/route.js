import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3'

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

const aws = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

const MAX_PER_RUN = 10

export async function POST(req) {
  const pw = process.env.ADMIN_PASSWORD
  if (!pw || req.headers.get('x-admin-password') !== pw) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let step = 'starting'
  try {
    // 1. Everything already in the AWS backup (one listing, not one request per file)
    step = 'listing the AWS backup bucket'
    const have = new Set()
    let awsToken
    do {
      const l = await aws.send(
        new ListObjectsV2Command({
          Bucket: process.env.AWS_BACKUP_BUCKET,
          ContinuationToken: awsToken,
        })
      )
      for (const o of l.Contents || []) have.add(o.Key)
      awsToken = l.IsTruncated ? l.NextContinuationToken : undefined
    } while (awsToken)

    // 2. Copy what is missing, at most MAX_PER_RUN files per click
    let copied = 0
    let skipped = 0
    let token

    do {
      step = 'listing the R2 bucket'
      const list = await r2.send(
        new ListObjectsV2Command({
          Bucket: process.env.R2_BUCKET_NAME,
          ContinuationToken: token,
        })
      )

      for (const obj of list.Contents || []) {
        if (have.has(obj.Key)) {
          skipped = skipped + 1
          continue
        }
        if (copied >= MAX_PER_RUN) {
          return Response.json({ backedUp: copied, alreadyBackedUp: skipped, more: true })
        }

        step = `reading ${obj.Key} from R2`
        const file = await r2.send(
          new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: obj.Key })
        )
        const bytes = await file.Body.transformToByteArray()

        step = `writing ${obj.Key} to AWS`
        await aws.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BACKUP_BUCKET,
            Key: obj.Key,
            Body: bytes,
            ContentType: file.ContentType,
          })
        )
        copied = copied + 1
      }

      token = list.IsTruncated ? list.NextContinuationToken : undefined
    } while (token)

    return Response.json({ backedUp: copied, alreadyBackedUp: skipped, more: false })
  } catch (e) {
    console.error('Backup failed while', step, e)
    return Response.json(
      { error: `Failed while ${step}: ${e.name} - ${String(e.message).split('\n')[0]}` },
      { status: 500 }
    )
  }
}