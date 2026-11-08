'use client'
import { useState } from 'react'

export default function Admin() {
  const [password, setPassword] = useState('')
  const [files, setFiles] = useState([])
  const [reports, setReports] = useState([])
  const [loggedIn, setLoggedIn] = useState(false)
  const [message, setMessage] = useState('')
  const [backupMessage, setBackupMessage] = useState('')

  async function load(pw) {
    const res = await fetch('/api/admin/files', {
      headers: { 'x-admin-password': pw },
    })
    if (!res.ok) {
      setLoggedIn(false)
      setMessage(res.status === 401 ? 'Wrong password' : 'Something went wrong')
      return
    }
    const data = await res.json()
    setFiles(data.files)
    setReports(data.reports)
    setLoggedIn(true)
    setMessage('')
  }

  async function updateStatus(id, status) {
    await fetch('/api/admin/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id, status }),
    })
    load(password)
  }

  async function runBackup() {
    setBackupMessage('Backing up...')
    const res = await fetch('/api/backup', {
      method: 'POST',
      headers: { 'x-admin-password': password },
    })
    const data = await res.json().catch(() => ({}))
    setBackupMessage(
      res.ok
               ? `Done: ${data.backedUp} new, ${data.alreadyBackedUp} already backed up${data.more ? ' - more files waiting, click again' : ''}`
        : data.error || 'Backup failed'
    )
  }

  if (!loggedIn) {
    return (
      <div>
        <h1>Admin Login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => load(password)}>Log in</button>
        <p>{message}</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Admin Review</h1>

      <button onClick={runBackup}>Run backup</button>
      <p>{backupMessage}</p>

      <h2>Files</h2>
      {files.map((f) => (
        <div key={f.id}>
          <p>
            {f.title || f.filename} - {f.status} - reports:{' '}
            {reports.filter((r) => r.file_id === f.id).length}
          </p>
          <button onClick={() => updateStatus(f.id, 'approved')}>Approve</button>
          <button onClick={() => updateStatus(f.id, 'removed')}>Remove</button>
        </div>
      ))}

      <h2>Reports</h2>
      {reports.length === 0 && <p>No reports yet.</p>}
      {reports.map((r) => (
        <div key={r.id}>
          <p>
            {r.item_title || r.item_id || r.file_id} - {r.reason}
            {r.details ? ` - ${r.details}` : ''} (
            {new Date(r.created_at).toLocaleDateString()})
          </p>
        </div>
      ))}
    </div>
  )
}