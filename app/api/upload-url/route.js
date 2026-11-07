import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

const MAX_SIZE = 50 * 1024 * 1024
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp',
  'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/webm',
  'video/mp4', 'video/webm',
]

// Basic per-visitor limit: 10 requests per minute
const hits = new Map()
function tooMany(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 10
}

export async function POST(req) {
  const ip =
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for') ||
    'unknown'
  if (tooMany(ip)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }

  const { filename, contentType, size } = body
  if (typeof filename !== 'string' || !ALLOWED_TYPES.includes(contentType)) {
    return Response.json({ error: 'File type not allowed' }, { status: 400 })
  }
  if (!Number.isInteger(size) || size <= 0 || size > MAX_SIZE) {
    return Response.json({ error: 'File too large (max 50MB)' }, { status: 400 })
  }

  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-100)
  const key = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeName}`

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    ContentLength: size,
  })

  const url = await getSignedUrl(s3, command, { expiresIn: 300 })
  return Response.json({ url, key })
}