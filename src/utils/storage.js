import { db, dbRef, dbGet, dbSet, onValue, dbOff } from './firebase'

export async function loadContent(key, fallback) {
  try {
    const snap = await dbGet(dbRef(db, `site_content/${key}`))
    if (snap.exists()) return snap.val()
  } catch { /* no-op: fall back below */ }
  return fallback
}

export async function saveContent(key, value) {
  try {
    await dbSet(dbRef(db, `site_content/${key}`), value ?? null)
    try {
      window.dispatchEvent(new CustomEvent('content:update', { detail: { key, value } }))
    } catch { /* ignore dispatch failures */ }
    return true
  } catch { return false }
}

export const STORAGE_KEYS = {
  HOME: 'izzy_content_home',
  HOME_STATS: 'izzy_content_home_stats',
  HOME_FEATURES: 'izzy_content_home_features',
  HOME_TESTIMONIALS: 'izzy_content_home_testimonials',
  HOME_CTA: 'izzy_content_home_cta',
  ABOUT: 'izzy_content_about',
  ABOUT_TEAM: 'izzy_content_about_team',
  ABOUT_HIGHLIGHTS: 'izzy_content_about_highlights',
  SERVICES: 'izzy_content_services',
  PROJECTS: 'izzy_content_projects',
  PRODUCTS: 'izzy_content_products',
  TRAININGS: 'izzy_content_trainings',
  TRAININGS_META: 'izzy_content_trainings_meta',
  TRAININGS_FORM: 'izzy_content_trainings_form',
  TRAININGS_SUBMITS: 'izzy_content_trainings_submits',
  CONTACT_MESSAGES: 'izzy_contact_messages',
}

export function addContentListener(handler) {
  const onCustom = (e) => {
    try { handler(e.detail && e.detail.key, e.detail && e.detail.value) } catch { /* ignore handler errors */ }
  }
  window.addEventListener('content:update', onCustom)

  const watchers = []
  const keys = Object.values(STORAGE_KEYS)
  keys.forEach((key) => {
    const r = dbRef(db, `site_content/${key}`)
    const unsub = onValue(r, (snap) => {
      handler(key, snap.exists() ? snap.val() : undefined)
    })
    watchers.push({ r, unsub })
  })
  return () => {
    window.removeEventListener('content:update', onCustom)
    watchers.forEach(({ r }) => dbOff(r))
  }
}


