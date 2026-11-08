import { supabaseAdmin } from '../../../lib/supabaseAdmin'

const REGIONS = ['eastern', 'western', 'southern', 'all']
const CATEGORIES = ['kissa', 'saoth', 'recipes', 'baloch_duch', 'bathal']
const MEDIA_TYPES = [
  'image/jpeg', 'image/png', 'image/webp',
  'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/webm',
  'video/mp4', 'video/webm',
]
const KEY_PATTERN = /^\d+-[a-f0-9]{8}-[A-Za-z0-9._-]+$/
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const MAX_SIZE = 50 * 1024 * 1024

const hits = new Map()
function tooMany(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 5
}

function clean(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function fail(message, status = 400) {
  return Response.json({ error: message }, { status })
}

export async function POST(req) {
  const ip =
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for') ||
    'unknown'
  if (tooMany(ip)) return fail('Too many requests, please wait a minute', 429)

  let body
  try {
    body = await req.json()
  } catch {
    return fail('Bad request')
  }

  if (body.type === 'contribution') {
    const title = clean(body.title, 150)
    const description = clean(body.description, 3000)
    if (!title || !description) return fail('Title and description are required')
    if (!REGIONS.includes(body.region)) return fail('Invalid region')
    if (!CATEGORIES.includes(body.category)) return fail('Invalid category')

    const row = {
      title,
      description,
      contributor_name: clean(body.contributorName, 100) || 'Anonymous',
      region: body.region,
      category: body.category,
      status: 'pending',
    }

    if (body.r2Key) {
      if (!KEY_PATTERN.test(body.r2Key)) return fail('Invalid media key')
      if (!MEDIA_TYPES.includes(body.mimeType)) return fail('Media type not allowed')
      if (!Number.isInteger(body.size) || body.size <= 0 || body.size > MAX_SIZE) {
        return fail('Invalid media size')
      }
      row.r2_key = body.r2Key
      row.mime_type = body.mimeType
      row.size_bytes = body.size
      row.filename = clean(body.filename, 100)
    }

    const { data, error } = await supabaseAdmin
      .from('files')
      .insert(row)
      .select('id')
      .single()
    if (error) return fail('Could not save', 500)
    return Response.json({ ok: true, id: data.id })
  }

  if (body.type === 'report') {
    const reason = clean(body.reason, 200)
    if (!reason) return fail('Reason is required')

    const row = {
      reason,
      details: clean(body.details, 1000),
      item_id: clean(body.itemId, 100),
      item_title: clean(body.itemTitle, 150),
    }
    if (UUID_PATTERN.test(row.item_id)) row.file_id = row.item_id

    const { error } = await supabaseAdmin.from('reports').insert(row)
    if (error) return fail('Could not save', 500)
    return Response.json({ ok: true })
  }

  if (body.type === 'feedback') {
    const rating = Number.isInteger(body.rating) ? body.rating : 0
    if (rating < 1 || rating > 5) return fail('Rating must be 1 to 5')

    const { error } = await supabaseAdmin.from('feedback').insert({
      name: clean(body.name, 100),
      email: clean(body.email, 200),
      rating,
      suggestions: clean(body.suggestions, 2000),
    })
    if (error) return fail('Could not save', 500)
    return Response.json({ ok: true })
  }

  return fail('Unknown type')
}