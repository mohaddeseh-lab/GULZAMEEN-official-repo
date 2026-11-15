// NEW: lets a visitor see the real status (pending / approved / removed) of THEIR OWN submissions.
// The browser sends the ids it got back when submitting; ids are random UUIDs, and only
// id + status are returned, so nothing else about the files is exposed.
import { getSupabaseAdmin } from '../../../lib/supabaseAdmin'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const hits = new Map()
function tooMany(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 30
}

export async function POST(req) {
  const supabaseAdmin = getSupabaseAdmin()

  const ip =
    req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown'
  if (tooMany(ip)) return Response.json({ error: 'Too many requests' }, { status: 429 })

  let body
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }

  const ids = Array.isArray(body.ids)
    ? body.ids.filter((id) => typeof id === 'string' && UUID_PATTERN.test(id)).slice(0, 100)
    : []
  if (ids.length === 0) return Response.json({ statuses: {} })

  const { data, error } = await supabaseAdmin.from('files').select('id, status').in('id', ids)
  if (error) return Response.json({ error: 'Could not load' }, { status: 500 })

  const statuses = {}
  for (const row of data || []) statuses[row.id] = row.status
  return Response.json({ statuses })
}