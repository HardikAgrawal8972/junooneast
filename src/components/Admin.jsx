import { useEffect, useState } from 'react'

const EMPTY = {
  photo: { image: '', title: '', caption: '', handle: '' },
  photographer: { name: '', avatar: '', role: '', handle: '', notes: [] },
}

/**
 * Hidden admin panel (reachable at /#admin) for updating the Spotlight
 * section. Writes require the admin password; regular visitors never see this.
 */
export default function Admin() {
  const [data, setData] = useState(EMPTY)
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null) // { kind: 'ok' | 'err', msg }
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/spotlight')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.photo) setData({ photo: { ...EMPTY.photo, ...d.photo }, photographer: { ...EMPTY.photographer, ...d.photographer } })
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  const setPhoto = (key) => (e) => setData((d) => ({ ...d, photo: { ...d.photo, [key]: e.target.value } }))
  const setPhotog = (key) => (e) => setData((d) => ({ ...d, photographer: { ...d.photographer, [key]: e.target.value } }))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setStatus(null)
    try {
      const res = await fetch('/api/spotlight', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
        body: JSON.stringify(data),
      })
      if (res.status === 401) {
        setStatus({ kind: 'err', msg: 'Wrong password — nothing was saved.' })
      } else if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setStatus({ kind: 'err', msg: body.error || `Save failed (${res.status}).` })
      } else {
        setStatus({ kind: 'ok', msg: 'Saved! The site now shows the new spotlight.' })
      }
    } catch {
      setStatus({ kind: 'err', msg: 'Could not reach the API — is the server running?' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-inner">
        <a className="admin-back" href="#home">
          ← back to site
        </a>
        <div className="eyebrow">admins only</div>
        <h1>Spotlight Editor</h1>
        <p className="admin-sub">
          Update the photo of the month and photographer of the month. Changes go live for every
          visitor the moment you save.
        </p>

        {!loaded ? (
          <p className="admin-sub">loading current spotlight…</p>
        ) : (
          <form onSubmit={save}>
            <fieldset className="admin-card">
              <legend>Photo of the Month</legend>
              <label>
                Image URL
                <input type="url" required value={data.photo.image} onChange={setPhoto('image')} placeholder="https://…" />
              </label>
              <label>
                Title
                <input type="text" required value={data.photo.title} onChange={setPhoto('title')} placeholder='"Steps, 5:47pm"' />
              </label>
              <label>
                Caption
                <input type="text" value={data.photo.caption} onChange={setPhoto('caption')} placeholder="shot on the library staircase…" />
              </label>
              <label>
                Credit handle
                <input type="text" value={data.photo.handle} onChange={setPhoto('handle')} placeholder="ritika.frames" />
              </label>
            </fieldset>

            <fieldset className="admin-card">
              <legend>Photographer of the Month</legend>
              <label>
                Name
                <input type="text" required value={data.photographer.name} onChange={setPhotog('name')} placeholder="Ritika Sengar" />
              </label>
              <label>
                Avatar URL
                <input type="url" value={data.photographer.avatar} onChange={setPhotog('avatar')} placeholder="https://…" />
              </label>
              <label>
                One-line bio
                <input type="text" value={data.photographer.role} onChange={setPhotog('role')} placeholder="shoots streets, always in manual." />
              </label>
              <label>
                Handle
                <input type="text" value={data.photographer.handle} onChange={setPhotog('handle')} placeholder="ritika.frames" />
              </label>
              <label>
                Field notes (one per line, up to 5)
                <textarea
                  rows={4}
                  value={data.photographer.notes.join('\n')}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      photographer: { ...d.photographer, notes: e.target.value.split('\n') },
                    }))
                  }
                  placeholder={'carries: canon AE-1…\nthis month: 14 frames published'}
                />
              </label>
            </fieldset>

            <fieldset className="admin-card">
              <legend>Authorisation</legend>
              <label>
                Admin password
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </label>
            </fieldset>

            {status && <p className={`admin-status ${status.kind}`}>{status.msg}</p>}

            <button className="btn" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save & Publish'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
