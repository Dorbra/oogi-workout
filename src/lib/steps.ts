import exercisesData from '../data/exercises.json'
import planData from '../data/workout-plan.json'

export const HYPER_INTENSE_REST_REDUCTION = 15

// ── Domain types ─────────────────────────────────────────────────────────────

export interface Exercise {
  id: string
  nameHe: string
  nameEn: string
  svg: string
  instrHe: string
  instrEn: string
}

export interface TimedExercise extends Exercise {
  duration: number
}

export interface WorkoutExercise {
  exerciseId: string
  sets: number
  reps: number
  rest: number
  setDuration: number
  weight: string
  supersetWith?: string
}

export interface Template {
  duration: number
  warmupSecs: number
  cooldownSecs: number
  exercises: WorkoutExercise[]
}

export interface Plan {
  exercises: Record<string, Exercise>
  warmup: TimedExercise[]
  cooldown: TimedExercise[]
  templates: Record<string, Template>
}

// ── Step discriminated union ──────────────────────────────────────────────────

export type WarmupStep = {
  type: 'warmup'
  exercise: TimedExercise
  duration: number
  groupIndex: number
}

export type TransitionStep = {
  type: 'transition'
  duration: number
  previewExercise: Exercise | null
  workoutEx: WorkoutExercise
  previewExB?: Exercise
  workoutExB?: WorkoutExercise
  isSuperset?: boolean
  groupIndex: number
}

export type ExerciseStep = {
  type: 'exercise'
  exercise: Exercise
  workoutEx: WorkoutExercise
  set: number
  totalSets: number
  duration: number
  supersetPart?: 'A' | 'B'
  groupIndex: number
}

export type RestStep = {
  type: 'rest'
  duration: number
  previewExercise: Exercise | null
  set?: number
  totalSets?: number
  isInterExercise?: boolean
  isSuperset?: boolean
  previewExB?: Exercise
  groupIndex: number
}

export type CooldownStep = {
  type: 'cooldown'
  exercise: TimedExercise
  duration: number
  groupIndex: number
}

export type CompleteStep = {
  type: 'complete'
  duration: 0
  groupIndex: number
}

export type Step =
  | WarmupStep
  | TransitionStep
  | ExerciseStep
  | RestStep
  | CooldownStep
  | CompleteStep

export interface BuildStepsOptions {
  reduceRestSecs?: number
}

export interface BuildStepsResult {
  steps: Step[]
  groupStarts: number[]
}

// ── Plan resolution ───────────────────────────────────────────────────────────

export function resolvePlan(plan: Plan): Plan {
  return {
    ...plan,
    exercises: { ...exercisesData.exercises, ...(plan.exercises ?? {}) },
  }
}

export const DEFAULT_PLAN: Plan = resolvePlan(planData as unknown as Plan)

// ── buildSteps ────────────────────────────────────────────────────────────────

export function buildSteps(
  template: Template,
  skipWarmup: boolean,
  plan: Plan,
  options: BuildStepsOptions = {}
): BuildStepsResult {
  const { reduceRestSecs = 0 } = options
  const effectiveRest = (secs: number) => Math.max(0, secs - reduceRestSecs)
  const { exercises, warmup, cooldown } = plan
  const steps: Step[] = []
  let groupIndex = 0
  const groupStarts: number[] = []

  if (!skipWarmup) {
    groupStarts.push(0)
    for (const wu of warmup) {
      steps.push({ type: 'warmup', exercise: wu, duration: wu.duration, groupIndex })
    }
    groupIndex++
  }

  const exList = template.exercises
  let i = 0
  while (i < exList.length) {
    const ex = exList[i]
    const exData = exercises[ex.exerciseId]

    if (ex.supersetWith) {
      const exB = exList[i + 1]
      const exDataB = exercises[exB.exerciseId]
      const nextItem = exList[i + 2]
      const nextExData: Exercise | null = nextItem ? exercises[nextItem.exerciseId] : null

      groupStarts.push(steps.length)
      steps.push({ type: 'transition', duration: 10, previewExercise: exData, workoutEx: ex, previewExB: exDataB, workoutExB: exB, isSuperset: true, groupIndex })

      for (let set = 1; set <= ex.sets; set++) {
        steps.push({ type: 'exercise', exercise: exData, workoutEx: ex, set, totalSets: ex.sets, supersetPart: 'A', duration: ex.setDuration, groupIndex })
        steps.push({ type: 'exercise', exercise: exDataB, workoutEx: exB, set, totalSets: exB.sets, supersetPart: 'B', duration: exB.setDuration, groupIndex })
        if (set < ex.sets) {
          steps.push({ type: 'rest', duration: effectiveRest(ex.rest), previewExercise: exData, previewExB: exDataB, isSuperset: true, set, totalSets: ex.sets, groupIndex })
        } else {
          steps.push({ type: 'rest', duration: effectiveRest(ex.rest), previewExercise: nextExData, isInterExercise: true, groupIndex })
        }
      }
      groupIndex++
      i += 2
    } else {
      const nextItem = exList[i + 1]
      const nextExData: Exercise | null = nextItem ? exercises[nextItem.exerciseId] : null

      groupStarts.push(steps.length)
      steps.push({ type: 'transition', duration: 10, previewExercise: exData, workoutEx: ex, groupIndex })

      for (let set = 1; set <= ex.sets; set++) {
        steps.push({ type: 'exercise', exercise: exData, workoutEx: ex, set, totalSets: ex.sets, duration: ex.setDuration, groupIndex })
        if (set < ex.sets) {
          steps.push({ type: 'rest', duration: effectiveRest(ex.rest), previewExercise: exData, set, totalSets: ex.sets, groupIndex })
        } else {
          steps.push({ type: 'rest', duration: effectiveRest(ex.rest), previewExercise: nextExData, isInterExercise: true, groupIndex })
        }
      }
      groupIndex++
      i++
    }
  }

  groupStarts.push(steps.length)
  for (const cd of cooldown) {
    steps.push({ type: 'cooldown', exercise: cd, duration: cd.duration, groupIndex })
  }
  groupIndex++

  steps.push({ type: 'complete', duration: 0, groupIndex })

  return { steps, groupStarts }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function totalRemainingSeconds(steps: Step[], stepIndex: number, secondsRemaining: number): number {
  let total = secondsRemaining
  for (let i = stepIndex + 1; i < steps.length; i++) {
    total += steps[i].duration || 0
  }
  return total
}

export function formatTime(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
