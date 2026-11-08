import { S3Client, HeadBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

async function step(name, command) {
  try {
    await s3.send(command)
    console.log(name, 'OK')
  } catch (e) {
    console.log(name, 'FAILED:', e.name, '-', String(e.message).split('\n')[0])
  }
}

await step('HeadBucket', new HeadBucketCommand({ Bucket: process.env.AWS_BACKUP_BUCKET }))
await step(
  'PutObject',
  new PutObjectCommand({
    Bucket: process.env.AWS_BACKUP_BUCKET,
    Key: 'test.txt',
    Body: 'hello',
  })
)