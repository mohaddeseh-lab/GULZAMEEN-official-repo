import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { supabaseAdmin } from '../../../../lib/supabaseAdmin'

// NEW: signs a 1-hour link for each uploaded file, so the admin page can show a preview
// (images, audio, video) even while a file is still pending.
async function withPreviews(files) {
  if (!process.env.R2_ACCOUNT_ID || !process.env.R2_BUCKET_NAME) return files
  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  })
  return Promise.all(
    files.map(async (f) => {
      if (!f.r2_key) return f
      try {
        const preview_url = await getSignedUrl(
          s3,
          new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: f.r2_key }),
          { expiresIn: 3600 }
        )
        return { ...f, preview_url }
      } catch {
        return f
      }
    })
  )
}

const attempts = new Map()
function blocked(ip) {
  const now = Date.now()
  const recent = (attempts.get(ip) || []).filter((t) => now - t < 60000)
  recent.push(now)
  attempts.set(ip, recent)
  return recent.length > 20
}

function check(req) {
  const ip =
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for') ||
    'unknown'
  if (blocked(ip)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 })
  }
  const pw = process.env.ADMIN_PASSWORD
  if (!pw || req.headers.get('x-admin-password') !== pw) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

export async function GET(req) {
  const denied = check(req)
  if (denied) return denied

  // CHANGED: after the password check, any failure is reported with its real reason
  // (only someone who knows the admin password can see this message).
  try {
    const db = supabaseAdmin
    const files = await db.from('files').select('*').order('created_at', { ascending: false })
    if (files.error) throw new Error(`files table: ${files.error.message}`)
    const reports = await db.from('reports').select('*').order('created_at', { ascending: false })
    const feedback = await db.from('feedback').select('*').order('created_at', { ascending: false })

    return Response.json({
      files: await withPreviews(files.data || []),
      reports: reports.data || [],
      feedback: feedback.data || [],
    })
  } catch (e) {
    console.error('Admin GET failed', e)
    return Response.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 })
  }
}

export async function POST(req) {
  const denied = check(req)
  if (denied) return denied

  const { id, status } = await req.json()
  if (!['approved', 'removed', 'pending'].includes(status)) {
    return Response.json({ error: 'Bad status' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('files').update({ status }).eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}