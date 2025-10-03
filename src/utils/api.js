export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
// Firebase-backed content storage
import { db, dbRef, dbGet, dbSet } from './firebase'

async function handleResponse(res) {
  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try { const data = await res.json(); message = data.error || message } catch { /* keep default message */ }
    throw new Error(message)
  }
  try { return await res.json() } catch { return null }
}

export async function getJson(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    // Prevent HTTP-level caching
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-store' },
  })
  return handleResponse(res)
}

export async function postJson(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body || {}),
  })
  return handleResponse(res)
}

export async function getContent(key, fallback) {
  try {
    const snap = await dbGet(dbRef(db, `site_content/${key}`))
    if (snap.exists()) return snap.val()
  } catch { /* no-op: fall back below */ }
  return fallback
}

export async function setContent(key, value) {
  await dbSet(dbRef(db, `site_content/${key}`), value ?? null)
  return { ok: true }
}


