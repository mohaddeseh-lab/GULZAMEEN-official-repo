'use client'
// CHANGED: redesigned admin review page.
// Tabs (Pending / Approved / Removed / Reports / Feedback), file previews, one-tap
// Approve / Remove / Undo buttons, and counts at the top. Same API as before.
import { useMemo, useState } from 'react'

const STATUS_STYLE = {
  pending: 'bg-amber-100 text-amber-900 border-amber-300',
  approved: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  removed: 'bg-rose-100 text-rose-900 border-rose-300',
}

function niceDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function Preview({ file }) {
  const mime = file.mime_type || ''
  const url = file.preview_url
  if (!file.r2_key) {
    return <div className="flex h-40 items-center justify-center rounded-lg bg-stone-100 text-xs text-stone-500">Text only, no file</div>
  }
  if (!url) {
    return <div className="flex h-40 items-center justify-center rounded-lg bg-stone-100 text-xs text-stone-500">Preview not available ({file.filename || 'file'})</div>
  }
  if (mime.startsWith('image/')) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={file.title || 'Upload'} loading="lazy" className="h-48 w-full rounded-lg object-cover" />
  }
  if (mime.startsWith('audio/')) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-lg bg-stone-900 p-4">
        <span className="text-xs font-semibold text-amber-300">Audio</span>
        <audio controls src={url} className="w-full" />
      </div>
    )
  }
  if (mime.startsWith('video/')) {
    return <video controls src={url} className="h-48 w-full rounded-lg bg-black object-contain" />
  }
  return (
    <a href={url} target="_blank" rel="noreferrer" className="flex h-40 items-center justify-center rounded-lg bg-stone-100 text-sm font-semibold text-blue-700 underline">
      Open file ({file.filename || mime || 'file'})
    </a>
  )
}

export default function Admin() {
  const [password, setPassword] = useState('')
  const [files, setFiles] = useState([])
  const [reports, setReports] = useState([])
  const [feedback, setFeedback] = useState([])
  const [loggedIn, setLoggedIn] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState(null)
  const [backupMessage, setBackupMessage] = useState('')
  const [tab, setTab] = useState('pending')
  const [search, setSearch] = useState('')

  async function load(pw) {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/files', { headers: { 'x-admin-password': pw } })
      if (!res.ok) {
        setLoggedIn(false)
        setMessage(res.status === 401 ? 'Wrong password' : 'Something went wrong')
        return
      }
      const data = await res.json()
      setFiles(data.files || [])
      setReports(data.reports || [])
      setFeedback(data.feedback || [])
      setLoggedIn(true)
      setMessage('')
    } catch {
      setMessage('Could not reach the server')
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id, status) {
    if (status === 'removed' && !window.confirm('Remove this item from the site?')) return
    setBusyId(id)
    try {
      const res = await fetch('/api/admin/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) setMessage('Could not update, try again')
      else setMessage('')
      await load(password)
    } finally {
      setBusyId(null)
    }
  }

  async function runBackup() {
    setBackupMessage('Backing up...')
    const res = await fetch('/api/backup', { method: 'POST', headers: { 'x-admin-password': password } })
    const data = await res.json().catch(() => ({}))
    setBackupMessage(
      res.ok
        ? `Done: ${data.backedUp} new, ${data.alreadyBackedUp} already backed up${data.more ? ' (more files waiting, click again)' : ''}`
        : data.error || 'Backup failed'
    )
  }

  const reportCount = useMemo(() => {
    const map = {}
    for (const r of reports) if (r.file_id) map[r.file_id] = (map[r.file_id] || 0) + 1
    return map
  }, [reports])

  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, removed: 0 }
    for (const f of files) c[f.status] = (c[f.status] || 0) + 1
    return c
  }, [files])

  const visibleFiles = useMemo(() => {
    const q = search.trim().toLowerCase()
    return files
      .filter((f) => f.status === tab)
      .filter(
        (f) =>
          !q ||
          [f.title, f.description, f.contributor_name, f.filename]
            .filter(Boolean)
            .some((t) => t.toLowerCase().includes(q))
      )
  }, [files, tab, search])

  /* ---------- Login ---------- */
  if (!loggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5E6D3] p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            load(password)
          }}
          className="w-full max-w-sm space-y-4 rounded-2xl border border-[#2D1E18]/20 bg-white p-6 shadow-lg"
        >
          <h1 className="text-2xl font-bold text-[#2D1E18]">Gulzameen Admin</h1>
          <p className="text-sm text-stone-600">Enter the admin password to review contributions.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full rounded-lg border border-stone-300 p-3 text-sm focus:border-[#A8452C] focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-lg bg-[#2D1E18] p-3 text-sm font-bold text-[#D4AF37] disabled:opacity-60"
          >
            {loading ? 'Checking...' : 'Log in'}
          </button>
          {message && <p role="alert" className="text-sm font-semibold text-rose-700">{message}</p>}
        </form>
      </main>
    )
  }

  /* ---------- Dashboard ---------- */
  const tabs = [
    { id: 'pending', label: 'Pending', count: counts.pending },
    { id: 'approved', label: 'Approved', count: counts.approved },
    { id: 'removed', label: 'Removed', count: counts.removed },
    { id: 'reports', label: 'Reports', count: reports.length },
    { id: 'feedback', label: 'Feedback', count: feedback.length },
  ]

  return (
    <main className="min-h-screen bg-[#F5E6D3] pb-16">
      <header className="sticky top-0 z-10 border-b border-[#2D1E18]/20 bg-[#2D1E18] px-4 py-3 text-[#F5E6D3]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg font-bold text-[#D4AF37]">Gulzameen Admin</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button onClick={() => load(password)} className="rounded-md border border-[#D4AF37]/50 px-3 py-1.5 font-semibold hover:bg-white/10">
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button onClick={runBackup} className="rounded-md border border-[#D4AF37]/50 px-3 py-1.5 font-semibold hover:bg-white/10">
              Run backup
            </button>
            <button onClick={() => { setLoggedIn(false); setPassword('') }} className="rounded-md bg-[#D4AF37] px-3 py-1.5 font-bold text-[#2D1E18]">
              Log out
            </button>
          </div>
        </div>
        {backupMessage && <p className="mx-auto mt-2 max-w-6xl text-xs text-amber-200">{backupMessage}</p>}
      </header>

      <div className="mx-auto max-w-6xl space-y-5 px-4 pt-5">
        {message && <p role="alert" className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm font-semibold text-rose-800">{message}</p>}

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {['pending', 'approved', 'removed'].map((s) => (
            <button
              key={s}
              onClick={() => setTab(s)}
              className={`rounded-xl border p-3 text-left ${STATUS_STYLE[s]} ${tab === s ? 'ring-2 ring-[#2D1E18]' : ''}`}
            >
              <div className="text-2xl font-bold">{counts[s]}</div>
              <div className="text-xs font-semibold capitalize">{s}</div>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <nav className="flex gap-1 overflow-x-auto border-b border-[#2D1E18]/20" aria-label="Sections">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 border-b-2 px-4 py-2 text-sm font-bold ${
                tab === t.id ? 'border-[#A8452C] text-[#A8452C]' : 'border-transparent text-stone-600'
              }`}
            >
              {t.label} <span className="ml-1 rounded-full bg-[#2D1E18]/10 px-2 py-0.5 text-xs">{t.count}</span>
            </button>
          ))}
        </nav>

        {/* Files */}
        {['pending', 'approved', 'removed'].includes(tab) && (
          <section className="space-y-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, name or description..."
              className="w-full rounded-lg border border-stone-300 bg-white p-2.5 text-sm focus:border-[#A8452C] focus:outline-none sm:max-w-sm"
            />
            {visibleFiles.length === 0 ? (
              <p className="rounded-xl bg-white p-8 text-center text-sm text-stone-500">
                {tab === 'pending' ? 'Nothing waiting for review. 🎉' : `No ${tab} items.`}
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleFiles.map((f) => {
                  const rc = reportCount[f.id] || 0
                  const busy = busyId === f.id
                  return (
                    <article key={f.id} className="flex flex-col gap-3 rounded-2xl border border-[#2D1E18]/15 bg-white p-4 shadow-sm">
                      <Preview file={f} />
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold leading-snug text-[#2D1E18]">{f.title || f.filename || 'Untitled'}</h3>
                          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-bold capitalize ${STATUS_STYLE[f.status] || ''}`}>{f.status}</span>
                        </div>
                        <p className="text-xs text-stone-600">
                          {f.contributor_name || 'Anonymous'} · {f.region || 'all'} · {(f.category || '').replace('_', ' ')}
                        </p>
                        <p className="text-xs text-stone-500">{niceDate(f.created_at)}</p>
                        {rc > 0 && <p className="text-xs font-bold text-rose-700">⚠ {rc} report{rc > 1 ? 's' : ''}</p>}
                        {f.description && <p className="line-clamp-4 text-sm text-stone-700">{f.description}</p>}
                      </div>
                      <div className="mt-auto flex gap-2">
                        {f.status !== 'approved' && (
                          <button disabled={busy} onClick={() => updateStatus(f.id, 'approved')} className="flex-1 rounded-lg bg-emerald-700 py-2.5 text-sm font-bold text-white disabled:opacity-60">
                            {busy ? '...' : 'Approve'}
                          </button>
                        )}
                        {f.status !== 'removed' && (
                          <button disabled={busy} onClick={() => updateStatus(f.id, 'removed')} className="flex-1 rounded-lg bg-rose-700 py-2.5 text-sm font-bold text-white disabled:opacity-60">
                            Remove
                          </button>
                        )}
                        {f.status !== 'pending' && (
                          <button disabled={busy} onClick={() => updateStatus(f.id, 'pending')} className="rounded-lg border border-stone-300 px-3 py-2.5 text-xs font-bold text-stone-700 disabled:opacity-60">
                            Undo
                          </button>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* Reports */}
        {tab === 'reports' && (
          <section className="space-y-3">
            {reports.length === 0 && <p className="rounded-xl bg-white p-8 text-center text-sm text-stone-500">No reports yet.</p>}
            {reports.map((r) => (
              <article key={r.id} className="rounded-xl border border-rose-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-[#2D1E18]">{r.item_title || r.item_id || r.file_id}</h3>
                  <span className="text-xs text-stone-500">{niceDate(r.created_at)}</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-rose-700">{r.reason}</p>
                {r.details && <p className="mt-1 text-sm text-stone-700">{r.details}</p>}
                {r.file_id && files.some((f) => f.id === r.file_id) && (
                  <button onClick={() => { setSearch(''); setTab(files.find((f) => f.id === r.file_id).status) }} className="mt-2 text-xs font-bold text-[#A8452C] underline">
                    Show this file
                  </button>
                )}
              </article>
            ))}
          </section>
        )}

        {/* Feedback */}
        {tab === 'feedback' && (
          <section className="space-y-3">
            {feedback.length === 0 && <p className="rounded-xl bg-white p-8 text-center text-sm text-stone-500">No feedback yet.</p>}
            {feedback.map((fb) => (
              <article key={fb.id} className="rounded-xl border border-[#2D1E18]/15 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-[#2D1E18]">
                    {fb.name || 'Anonymous'} <span className="font-normal text-stone-500">{fb.email ? `· ${fb.email}` : ''}</span>
                  </h3>
                  <span className="text-sm font-bold text-amber-600" aria-label={`${fb.rating} out of 5`}>
                    {'★'.repeat(fb.rating || 0)}{'☆'.repeat(5 - (fb.rating || 0))}
                  </span>
                </div>
                {fb.suggestions && <p className="mt-2 text-sm text-stone-700">{fb.suggestions}</p>}
                <p className="mt-2 text-xs text-stone-500">{niceDate(fb.created_at)}</p>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  )
}
