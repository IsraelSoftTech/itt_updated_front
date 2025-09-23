export function loadContent(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch (_) {
    return fallback
  }
}

export function saveContent(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (_) {
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
  TRAININGS: 'izzy_content_trainings',
  TRAININGS_META: 'izzy_content_trainings_meta',
  TRAININGS_FORM: 'izzy_content_trainings_form',
  TRAININGS_SUBMITS: 'izzy_content_trainings_submits',
  CONTACT_MESSAGES: 'izzy_contact_messages',
}


