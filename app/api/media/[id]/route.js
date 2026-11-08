import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { supabase } from '../../../../lib/supabase'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

export async function GET(req, { params }) {
  const { id } = await params

  // The public key can only see approved files, so anything else returns nothing
  const { data } = await supabase
    .from('files')
    .select('r2_key, mime_type')
    .eq('id', id)
    .eq('status', 'approved')
    .maybeSingle()

  if (!data || !data.r2_key) {
    return new Response('Not found', { status: 404 })
  }

  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: data.r2_key,
    }),
    { expiresIn: 300 }
  )
  return Response.redirect(url, 302)
}