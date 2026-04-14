import { describe, it, expect } from 'vitest'
import { buildSteps, formatTime, totalRemainingSeconds } from './steps'
import { DEFAULT_PLAN } from './steps'

// ─── Minimal fixtures ────────────────────────────────────────────────────────

const exercise = (id, sets = 2, rest = 60, setDuration = 30) => ({
  exerciseId: id,
  sets,
  reps: 10,
  weight: '10kg',
  rest,
  setDuration,
})

const plan = {
  exercises: {
    A: { id: 'A', nameEn: 'Push Up', nameHe: 'שכיבות', svg: 'push_up', instrEn: '', instrHe: '' },
    B: { id: 'B', nameEn: 'Row',     nameHe: 'חתירה',  svg: 'row',     instrEn: '', instrHe: '' },
    C: { id: 'C', nameEn: 'Squat',   nameHe: 'סקוואט', svg: 'squat',   instrEn: '', instrHe: '' },
    W: { id: 'W', nameEn: 'Warmup',  nameHe: 'חימום',  svg: 'warmup',  instrEn: '', instrHe: '' },
    CD:{ id: 'CD',nameEn: 'Cooldown',nameHe: 'שחרור',  svg: 'cooldown',instrEn: '', instrHe: '' },
  },
  warmup:   [{ id: 'W1',  nameEn: 'Warmup Move', nameHe: '', svg: 'w', instrEn: '', instrHe: '', duration: 30 }],
  cooldown: [{ id: 'CD1', nameEn: 'Stretch',     nameHe: '', svg: 'c', instrEn: '', instrHe: '', duration: 40 }],
}

// ─── formatTime ──────────────────────────────────────────────────────────────

describe('formatTime', () => {
  it('formats zero', () => expect(formatTime(0)).toBe('0:00'))
  it('formats seconds only', () => expect(formatTime(45)).toBe('0:45'))
  it('formats whole minutes', () => expect(formatTime(120)).toBe('2:00'))
  it('formats minutes and seconds', () => expect(formatTime(90)).toBe('1:30'))
  it('pads single-digit seconds', () => expect(formatTime(61)).toBe('1:01'))
})

// ─── totalRemainingSeconds ────────────────────────────────────────────────────

describe('totalRemainingSeconds', () => {
  it('sums remaining steps plus current countdown', () => {
    const steps = [
      { type: 'exercise', duration: 30 },
      { type: 'rest',     duration: 60 },
      { type: 'exercise', duration: 30 },
    ]
    // at stepIndex=0 with 20s on clock: 20 + 60 + 30 = 110
    expect(totalRemainingSeconds(steps, 0, 20)).toBe(110)
  })

  it('returns just secondsRemaining on last step', () => {
    const steps = [{ type: 'exercise', duration: 30 }]
    expect(totalRemainingSeconds(steps, 0, 15)).toBe(15)
  })

  it('handles steps with no duration (complete step)', () => {
    const steps = [
      { type: 'exercise', duration: 30 },
      { type: 'complete', duration: 0 },
    ]
    expect(totalRemainingSeconds(steps, 0, 10)).toBe(10)
  })
})

// ─── buildSteps — warmup & cooldown ──────────────────────────────────────────

describe('buildSteps — warmup and cooldown', () => {
  const template = { exercises: [exercise('A', 1)] }

  it('includes warmup steps when skipWarmup is false', () => {
    const { steps } = buildSteps(template, false, plan)
    expect(steps[0].type).toBe('warmup')
    expect(steps[0].exercise.id).toBe('W1')
  })

  it('omits warmup steps when skipWarmup is true', () => {
    const { steps } = buildSteps(template, true, plan)
    expect(steps[0].type).toBe('transition')
  })

  it('always ends with cooldown then complete', () => {
    const { steps } = buildSteps(template, true, plan)
    const last = steps[steps.length - 1]
    const secondLast = steps[steps.length - 2]
    expect(last.type).toBe('complete')
    expect(secondLast.type).toBe('cooldown')
  })
})

// ─── buildSteps — single exercise ────────────────────────────────────────────

describe('buildSteps — single exercise, 2 sets', () => {
  const template = { exercises: [exercise('A', 2, 60, 30)] }

  it('generates: transition → [exercise → rest] × sets', () => {
    const { steps } = buildSteps(template, true, plan)
    // skip cooldown + complete at tail
    const core = steps.slice(0, -2)
    expect(core[0].type).toBe('transition')
    expect(core[1].type).toBe('exercise')
    expect(core[1].set).toBe(1)
    expect(core[2].type).toBe('rest')
    expect(core[3].type).toBe('exercise')
    expect(core[3].set).toBe(2)
    expect(core[4].type).toBe('rest')
  })

  it('every rest has the correct duration', () => {
    const { steps } = buildSteps(template, true, plan)
    steps.filter(s => s.type === 'rest').forEach(s => {
      expect(s.duration).toBe(60)
    })
  })

  it('rest after last set is isInterExercise with null previewExercise', () => {
    const { steps } = buildSteps(template, true, plan)
    const rests = steps.filter(s => s.type === 'rest')
    const lastRest = rests[rests.length - 1]
    expect(lastRest.isInterExercise).toBe(true)
    expect(lastRest.previewExercise).toBeNull()
  })

  it('inter-exercise rest previews the next exercise', () => {
    const template2 = { exercises: [exercise('A', 1), exercise('B', 1)] }
    const { steps } = buildSteps(template2, true, plan)
    const interRest = steps.find(s => s.type === 'rest' && s.isInterExercise)
    expect(interRest.previewExercise.id).toBe('B')
  })

  it('intra-set rest is NOT isInterExercise', () => {
    const template3 = { exercises: [exercise('A', 3)] }
    const { steps } = buildSteps(template3, true, plan)
    const rests = steps.filter(s => s.type === 'rest')
    // first two rests are intra-set
    expect(rests[0].isInterExercise).toBeFalsy()
    expect(rests[1].isInterExercise).toBeFalsy()
  })
})

// ─── buildSteps — superset ───────────────────────────────────────────────────

describe('buildSteps — superset', () => {
  const template = {
    exercises: [
      { ...exercise('A', 2, 60, 30), supersetWith: 'B' },
      exercise('B', 2, 60, 30),
    ],
  }

  it('generates A+B exercise pairs per set', () => {
    const { steps } = buildSteps(template, true, plan)
    const exSteps = steps.filter(s => s.type === 'exercise')
    // 2 sets × 2 exercises = 4 exercise steps
    expect(exSteps).toHaveLength(4)
    expect(exSteps[0].supersetPart).toBe('A')
    expect(exSteps[1].supersetPart).toBe('B')
    expect(exSteps[2].supersetPart).toBe('A')
    expect(exSteps[3].supersetPart).toBe('B')
  })

  it('intra-set rest has isSuperset flag and previews both exercises', () => {
    const { steps } = buildSteps(template, true, plan)
    const intraRest = steps.find(s => s.type === 'rest' && !s.isInterExercise)
    expect(intraRest.isSuperset).toBe(true)
    expect(intraRest.previewExercise.id).toBe('A')
    expect(intraRest.previewExB.id).toBe('B')
  })

  it('inter-exercise rest after final superset set has no previewExB', () => {
    const { steps } = buildSteps(template, true, plan)
    const interRest = steps.find(s => s.type === 'rest' && s.isInterExercise)
    expect(interRest.previewExB).toBeUndefined()
  })
})

// ─── buildSteps — groupStarts ─────────────────────────────────────────────────

describe('buildSteps — groupStarts', () => {
  it('first groupStart is 0 when warmup is included', () => {
    const template = { exercises: [exercise('A', 1)] }
    const { groupStarts } = buildSteps(template, false, plan)
    expect(groupStarts[0]).toBe(0)
  })

  it('number of groups = 1 warmup + exercises + 1 cooldown', () => {
    const template = { exercises: [exercise('A', 1), exercise('B', 1)] }
    const { groupStarts } = buildSteps(template, false, plan)
    // warmup group + 2 exercise groups + cooldown group = 4
    expect(groupStarts.length).toBe(4)
  })

  it('skipping warmup removes its group', () => {
    const template = { exercises: [exercise('A', 1)] }
    const { groupStarts: withWarmup }    = buildSteps(template, false, plan)
    const { groupStarts: withoutWarmup } = buildSteps(template, true,  plan)
    expect(withoutWarmup.length).toBe(withWarmup.length - 1)
  })
})

// ─── buildSteps — uses real plan data ────────────────────────────────────────

describe('buildSteps — real plan data smoke test', () => {
  const templates = DEFAULT_PLAN.templates
  const key = Object.keys(templates)[0]

  it('produces steps for first real template', () => {
    const { steps } = buildSteps(templates[key], false, DEFAULT_PLAN)
    expect(steps.length).toBeGreaterThan(10)
    expect(steps[0].type).toBe('warmup')
    expect(steps[steps.length - 1].type).toBe('complete')
  })

  it('every step has a numeric duration', () => {
    const { steps } = buildSteps(templates[key], false, DEFAULT_PLAN)
    steps.forEach(s => expect(typeof s.duration).toBe('number'))
  })

  it('every exercise step references a real exercise object', () => {
    const { steps } = buildSteps(templates[key], false, DEFAULT_PLAN)
    steps.filter(s => s.type === 'exercise').forEach(s => {
      expect(s.exercise).toBeDefined()
      expect(typeof s.exercise.nameEn).toBe('string')
    })
  })
})
