// NEW: translates any language into Balochi using Google Cloud Translation.
// Needs one secret: GOOGLE_TRANSLATE_API_KEY (the key stays on the server, never in the browser).
const MAX_CHARS = 1000

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
    req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown'
  if (tooMany(ip)) {
    return Response.json({ error: 'Too many requests, please wait a minute' }, { status: 429 })
  }

  const key = process.env.GOOGLE_TRANSLATE_API_KEY
  if (!key) return Response.json({ error: 'Translator is not set up yet' }, { status: 503 })

  let body
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }

  const text = typeof body.text === 'string' ? body.text.trim() : ''
  if (!text) return Response.json({ error: 'Please type something to translate' }, { status: 400 })
  if (text.length > MAX_CHARS) {
    return Response.json({ error: `Please keep it under ${MAX_CHARS} characters` }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(key)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // No "source": Google detects the input language automatically
        body: JSON.stringify({ q: text, target: 'bal', format: 'text' }),
        signal: AbortSignal.timeout(8000),
      }
    )
    if (!res.ok) return Response.json({ error: 'Translation failed, try again' }, { status: 502 })
    const data = await res.json()
    const t = data?.data?.translations?.[0]
    if (!t) return Response.json({ error: 'No translation returned' }, { status: 502 })
    return Response.json({
      translation: t.translatedText,
      detectedLanguage: t.detectedSourceLanguage || null,
    })
  } catch {
    return Response.json({ error: 'Translation failed, try again' }, { status: 502 })
  }
}
