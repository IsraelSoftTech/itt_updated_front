export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

async function handleResponse(res) {
  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try { const data = await res.json(); message = data.error || message } catch { /* keep default message */ }
    throw new Error(message)
  }
  try { return await res.json() } catch { return null }
}

export async function getJson(path) {
  const res = await fetch(`${API_BASE}${path}`)
  return handleResponse(res)
}

export async function postJson(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  })
  return handleResponse(res)
}

export async function getContent(key, fallback) {
  try {
    const data = await getJson(`/api/content/${encodeURIComponent(key)}`)
    return data ?? fallback
  } catch {
    return fallback
  }
}

export async function setContent(key, value) {
  const res = await fetch(`${API_BASE}/api/content/${encodeURIComponent(key)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(value ?? null),
  })
  return handleResponse(res)
}


