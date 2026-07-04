import dotenv from 'dotenv'
import express from 'express'
import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })
const DATA_FILE = path.join(__dirname, 'data', 'spotlight.json')
const DIST_DIR = path.join(__dirname, '..', 'dist')
const PORT = process.env.API_PORT || 3001
const TOKEN = process.env.ADMIN_TOKEN

if (!TOKEN) {
  console.warn('⚠ ADMIN_TOKEN is not set — admin writes are disabled. Create server/.env with ADMIN_TOKEN=<password>.')
}

const app = express()
app.use(express.json({ limit: '1mb' }))

const requireAdmin = (req, res, next) => {
  const header = req.headers.authorization || ''
  if (!TOKEN || header !== `Bearer ${TOKEN}`) {
    return res.status(401).json({ error: 'unauthorized' })
  }
  next()
}

const str = (v, max = 400) => (typeof v === 'string' ? v.slice(0, max).trim() : '')

/** Keep only the fields the site knows about — nothing else gets persisted. */
function sanitize(body) {
  const photo = body?.photo ?? {}
  const photographer = body?.photographer ?? {}
  return {
    photo: {
      image: str(photo.image, 600),
      title: str(photo.title, 120),
      caption: str(photo.caption, 300),
      handle: str(photo.handle, 60),
    },
    photographer: {
      name: str(photographer.name, 80),
      avatar: str(photographer.avatar, 600),
      role: str(photographer.role, 200),
      handle: str(photographer.handle, 60),
      notes: Array.isArray(photographer.notes)
        ? photographer.notes.map((n) => str(n, 160)).filter(Boolean).slice(0, 5)
        : [],
    },
    updatedAt: new Date().toISOString(),
  }
}

app.get('/api/spotlight', async (_req, res) => {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    res.json(JSON.parse(raw))
  } catch {
    res.status(404).json({ error: 'no spotlight data' })
  }
})

app.post('/api/verify', requireAdmin, (_req, res) => res.json({ ok: true }))

app.put('/api/spotlight', requireAdmin, async (req, res) => {
  const data = sanitize(req.body)
  if (!data.photo.title || !data.photographer.name) {
    return res.status(400).json({ error: 'photo title and photographer name are required' })
  }
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  const tmp = `${DATA_FILE}.tmp`
  await fs.writeFile(tmp, JSON.stringify(data, null, 2))
  await fs.rename(tmp, DATA_FILE)
  res.json(data)
})

// in production, also serve the built site so one process runs everything
if (existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR))
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(DIST_DIR, 'index.html'))
    }
    next()
  })
}

app.listen(PORT, () => {
  console.log(`junoon-east api listening on http://localhost:${PORT}`)
})
