import { db, dbRef, onValue, dbOff, dbSet } from './firebase'

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
  const watchers = []
  const keys = Object.values(STORAGE_KEYS)
  keys.forEach((key) => {
    const r = dbRef(db, `site_content/${key}`)
    onValue(r, (snap) => {
      handler(key, snap.exists() ? snap.val() : undefined)
    })
    
    watchers.push({ r })
  })
  return () => {
    watchers.forEach(({ r }) => dbOff(r))
  }
}

export async function saveContent(key, value) {
  try {
    await dbSet(dbRef(db, `site_content/${key}`), value ?? null)
    try { window.dispatchEvent(new CustomEvent('content:update', { detail: { key, value } })) } catch { /* ignore */ }
    return true
  } catch { return false }
}


