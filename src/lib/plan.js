import { CATEGORY_META } from '../constants/categories'

export function getAvailableCategories(templates) {
  const cats = new Set()
  Object.keys(templates).forEach(k => {
    const m = k.match(/^(.+)_\d/)
    if (m) cats.add(m[1])
  })
  return Array.from(cats)
}

export function getAvailableDurations(templates, category) {
  const prefix = category + '_'
  const seen = new Set()
  return Object.keys(templates)
    .filter(k => k.startsWith(prefix))
    .map(k => parseInt(k.slice(prefix.length), 10))
    .filter(d => !isNaN(d) && !seen.has(d) && seen.add(d))
    .sort((a, b) => a - b)
}

export function getDurationLabel(selectedDuration, selectedVariation, templates, category, t) {
  const hasVariants = templates[`${category}_${selectedDuration}a`] !== undefined
  if (hasVariants) return selectedVariation === 'a' ? t.dayA : t.dayB
  return `${selectedDuration} ${t.min}`
}

export function categoryLabel(cat, t) {
  const meta = CATEGORY_META[cat]
  return meta ? t[meta.labelKey] : cat
}

export function categoryDesc(cat, t) {
  const meta = CATEGORY_META[cat]
  return meta ? t[meta.descKey] : ''
}

export function categoryIcon(cat) {
  return CATEGORY_META[cat]?.icon ?? '🏋️'
}
