export function loadContent(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveContent(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    // Notify this tab immediately
    try {
      window.dispatchEvent(new CustomEvent('content:update', { detail: { key, value } }))
    } catch (err) {
      console.warn('content:update dispatch failed', err)
    }
    return true
  } catch {
    return false
  }
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
    try {
      handler(e.detail && e.detail.key, e.detail && e.detail.value)
    } catch (err) {
      console.warn('content:update handler error', err)
    }
  }
  const onStorage = (e) => {
    try {
      if (!e || !e.key) return
      const parsed = e.newValue ? JSON.parse(e.newValue) : undefined
      handler(e.key, parsed)
    } catch (err) {
      console.warn('storage event handler error', err)
    }
  }
  window.addEventListener('content:update', onCustom)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener('content:update', onCustom)
    window.removeEventListener('storage', onStorage)
  }
}


