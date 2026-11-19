import { supabaseAdmin } from '../../../../lib/supabaseAdmin'

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

  const files = await supabaseAdmin
    .from('files')
    .select('*')
    .order('created_at', { ascending: false })
  const reports = await supabaseAdmin
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false })

  return Response.json({ files: files.data || [], reports: reports.data || [] })
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