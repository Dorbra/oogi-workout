import { DEFAULT_PLAN, buildSteps } from '../lib/steps'
import { getAvailableDurations } from '../lib/plan'

export const initialState = {
  lang: 'he',
  screen: 'home',        // home | preview | active | complete
  selectedCategory: 'upper',
  selectedDuration: 30,
  selectedVariation: 'a',
  skipWarmup: false,
  plan: DEFAULT_PLAN,
  steps: [],
  groupStarts: [],
  stepIndex: 0,
  secondsRemaining: 0,
  stepEndTime: 0,        // Date.now() ms — deadline for the current step
  isPaused: false,
  completedSeconds: 0,
}

function stepDeadline(durationSecs) {
  return Date.now() + durationSecs * 1000
}

function advanceStep(state) {
  const nextIndex = state.stepIndex + 1
  if (nextIndex >= state.steps.length) {
    return { ...state, screen: 'complete' }
  }
  const nextStep = state.steps[nextIndex]
  if (nextStep.type === 'complete') {
    return { ...state, screen: 'complete', stepIndex: nextIndex, completedSeconds: state.completedSeconds + 1 }
  }
  const duration = nextStep.duration || 0
  return {
    ...state,
    stepIndex: nextIndex,
    secondsRemaining: duration,
    stepEndTime: stepDeadline(duration),
    completedSeconds: state.completedSeconds + 1,
  }
}

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.category,
        selectedDuration: getAvailableDurations(state.plan.templates, action.category)[0] ?? 30,
      }

    case 'SET_DURATION':
      return { ...state, selectedDuration: action.duration }

    case 'SET_VARIATION':
      return { ...state, selectedVariation: action.variation }

    case 'TOGGLE_SKIP_WARMUP':
      return { ...state, skipWarmup: !state.skipWarmup }

    case 'SET_LANG':
      return { ...state, lang: action.lang }

    case 'GO_PREVIEW':
      return { ...state, screen: 'preview' }

    case 'GO_HOME':
      return { ...initialState, lang: state.lang, plan: state.plan, selectedCategory: state.selectedCategory }

    case 'START_WORKOUT': {
      const hasVariants = state.plan.templates[`${state.selectedCategory}_${state.selectedDuration}a`] !== undefined
      const templateKey = hasVariants
        ? `${state.selectedCategory}_${state.selectedDuration}${state.selectedVariation}`
        : `${state.selectedCategory}_${state.selectedDuration}`
      const template = state.plan.templates[templateKey]
      const { steps, groupStarts } = buildSteps(template, state.skipWarmup, state.plan)
      const firstStep = steps[0]
      const duration = firstStep?.duration ?? 0
      return {
        ...state,
        screen: 'active',
        steps,
        groupStarts,
        stepIndex: 0,
        secondsRemaining: duration,
        stepEndTime: stepDeadline(duration),
        isPaused: false,
        completedSeconds: 0,
      }
    }

    case 'TICK': {
      if (state.isPaused) return state
      const secondsRemaining = Math.max(0, Math.ceil((state.stepEndTime - Date.now()) / 1000))
      if (secondsRemaining > 0) {
        return { ...state, secondsRemaining, completedSeconds: state.completedSeconds + 1 }
      }
      return advanceStep(state)
    }

    case 'SKIP_FORWARD': {
      const currentGroup = state.steps[state.stepIndex]?.groupIndex ?? 0
      const nextGroupIdx = currentGroup + 1
      if (nextGroupIdx >= state.groupStarts.length) {
        return { ...state, screen: 'complete' }
      }
      const nextStart = state.groupStarts[nextGroupIdx]
      const nextStep = state.steps[nextStart]
      const duration = nextStep?.duration ?? 0
      return {
        ...state,
        stepIndex: nextStart,
        secondsRemaining: duration,
        stepEndTime: stepDeadline(duration),
      }
    }

    case 'SKIP_BACKWARD': {
      const currentGroup = state.steps[state.stepIndex]?.groupIndex ?? 0
      const currentGroupStart = state.groupStarts[currentGroup] ?? 0
      const isNearStart = state.stepIndex <= currentGroupStart + 1
      const targetGroup = isNearStart ? Math.max(0, currentGroup - 1) : currentGroup
      const targetStart = state.groupStarts[targetGroup] ?? 0
      const targetStep = state.steps[targetStart]
      const duration = targetStep?.duration ?? 0
      return {
        ...state,
        stepIndex: targetStart,
        secondsRemaining: duration,
        stepEndTime: stepDeadline(duration),
      }
    }

    case 'EXTEND_REST': {
      const updatedSteps = state.steps.map((s, i) =>
        i === state.stepIndex ? { ...s, duration: s.duration + 15 } : s
      )
      return {
        ...state,
        steps: updatedSteps,
        secondsRemaining: state.secondsRemaining + 15,
        stepEndTime: state.stepEndTime + 15_000,
      }
    }

    case 'PAUSE_RESUME':
      if (state.isPaused) {
        // Resuming: recalculate deadline from current secondsRemaining so
        // time paused doesn't count against the step.
        return { ...state, isPaused: false, stepEndTime: stepDeadline(state.secondsRemaining) }
      }
      return { ...state, isPaused: true }

    default:
      return state
  }
}
