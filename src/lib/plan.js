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

export function getDurationLabel(selectedDuration, selectedVariation, t) {
  if (selectedDuration === 30 && selectedVariation === 'a') return t.dayA
  if (selectedDuration === 30 && selectedVariation === 'b') return t.dayB
  return `${selectedDuration} ${t.min}`
}

export function categoryLabel(cat, t) {
  if (cat === 'upper') return t.upperBody
  if (cat === 'abs_legs') return t.absLegs
  return cat
}

export function categoryIcon(cat) {
  if (cat === 'upper') return '💪'
  if (cat === 'abs_legs') return '🦵'
  return '🏋️'
}
