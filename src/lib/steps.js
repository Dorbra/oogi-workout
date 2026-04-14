import exercisesData from '../data/exercises.json'
import planData from '../data/workout-plan.json'

export function resolvePlan(plan) {
  return {
    ...plan,
    exercises: { ...exercisesData.exercises, ...(plan.exercises ?? {}) },
  }
}

export const DEFAULT_PLAN = resolvePlan(planData)

export function buildSteps(template, skipWarmup, plan) {
  const { exercises, warmup, cooldown } = plan
  const steps = []
  let groupIndex = 0
  const groupStarts = []

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
      const nextExData = nextItem ? exercises[nextItem.exerciseId] : null

      groupStarts.push(steps.length)
      steps.push({ type: 'transition', duration: 10, previewExercise: exData, workoutEx: ex, previewExB: exDataB, workoutExB: exB, isSuperset: true, groupIndex })

      for (let set = 1; set <= ex.sets; set++) {
        steps.push({ type: 'exercise', exercise: exData, workoutEx: ex, set, totalSets: ex.sets, supersetPart: 'A', duration: ex.setDuration, groupIndex })
        steps.push({ type: 'exercise', exercise: exDataB, workoutEx: exB, set, totalSets: exB.sets, supersetPart: 'B', duration: exB.setDuration, groupIndex })
        if (set < ex.sets) {
          steps.push({ type: 'rest', duration: ex.rest, previewExercise: exData, previewExB: exDataB, isSuperset: true, groupIndex })
        } else {
          steps.push({ type: 'rest', duration: ex.rest, previewExercise: nextExData, isInterExercise: true, groupIndex })
        }
      }
      groupIndex++
      i += 2
    } else {
      const nextItem = exList[i + 1]
      const nextExData = nextItem ? exercises[nextItem.exerciseId] : null

      groupStarts.push(steps.length)
      steps.push({ type: 'transition', duration: 10, previewExercise: exData, workoutEx: ex, groupIndex })

      for (let set = 1; set <= ex.sets; set++) {
        steps.push({ type: 'exercise', exercise: exData, workoutEx: ex, set, totalSets: ex.sets, duration: ex.setDuration, groupIndex })
        if (set < ex.sets) {
          steps.push({ type: 'rest', duration: ex.rest, previewExercise: exData, groupIndex })
        } else {
          steps.push({ type: 'rest', duration: ex.rest, previewExercise: nextExData, isInterExercise: true, groupIndex })
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

export function totalRemainingSeconds(steps, stepIndex, secondsRemaining) {
  let total = secondsRemaining
  for (let i = stepIndex + 1; i < steps.length; i++) {
    total += steps[i].duration || 0
  }
  return total
}

export function formatTime(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
