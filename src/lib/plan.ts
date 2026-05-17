import { CATEGORY_META as _CATEGORY_META } from '../constants/categories'
import type { Plan, Template } from './steps'

const CATEGORY_META = _CATEGORY_META as Record<string, { icon: string; labelKey: string; descKey: string } | undefined>

export function getAvailableCategories(templates: Plan['templates']): string[] {
  const cats = new Set<string>()
  Object.keys(templates).forEach(k => {
    const m = k.match(/^(.+)_\d/)
    if (m) cats.add(m[1])
  })
  return Array.from(cats)
}

export function getAvailableDurations(templates: Plan['templates'], category: string): number[] {
  const prefix = category + '_'
  const seen = new Set<number>()
  return Object.keys(templates)
    .filter(k => k.startsWith(prefix))
    .map(k => parseInt(k.slice(prefix.length), 10))
    .filter(d => !isNaN(d) && !seen.has(d) && seen.add(d))
    .sort((a, b) => a - b)
}

export function getDurationLabel(
  selectedDuration: number,
  selectedVariation: string,
  templates: Record<string, Template>,
  category: string,
  t: Record<string, string>
): string {
  const hasVariants = templates[`${category}_${selectedDuration}a`] !== undefined
  if (hasVariants) return selectedVariation === 'a' ? t.dayA : t.dayB
  return `${selectedDuration} ${t.min}`
}

export function categoryLabel(cat: string, t: Record<string, string>): string {
  const meta = CATEGORY_META[cat]
  return meta ? t[meta.labelKey] : cat
}

export function categoryDesc(cat: string, t: Record<string, string>): string {
  const meta = CATEGORY_META[cat]
  return meta ? t[meta.descKey] : ''
}

export function categoryIcon(cat: string): string {
  return CATEGORY_META[cat]?.icon ?? '🏋️'
}
