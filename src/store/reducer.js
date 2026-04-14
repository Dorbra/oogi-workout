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
  isPaused: false,
  completedSeconds: 0,
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
  return {
    ...state,
    stepIndex: nextIndex,
    secondsRemaining: nextStep.duration || 0,
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
      return {
        ...state,
        screen: 'active',
        steps,
        groupStarts,
        stepIndex: 0,
        secondsRemaining: firstStep?.duration ?? 0,
        isPaused: false,
        completedSeconds: 0,
      }
    }

    case 'TICK': {
      if (state.isPaused) return state
      if (state.secondsRemaining > 1) {
        return { ...state, secondsRemaining: state.secondsRemaining - 1, completedSeconds: state.completedSeconds + 1 }
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
      return {
        ...state,
        stepIndex: nextStart,
        secondsRemaining: nextStep?.duration ?? 0,
      }
    }

    case 'SKIP_BACKWARD': {
      const currentGroup = state.steps[state.stepIndex]?.groupIndex ?? 0
      const currentGroupStart = state.groupStarts[currentGroup] ?? 0
      const isNearStart = state.stepIndex <= currentGroupStart + 1
      let targetGroup = isNearStart ? Math.max(0, currentGroup - 1) : currentGroup
      const targetStart = state.groupStarts[targetGroup] ?? 0
      const targetStep = state.steps[targetStart]
      return {
        ...state,
        stepIndex: targetStart,
        secondsRemaining: targetStep?.duration ?? 0,
      }
    }

    case 'PAUSE_RESUME':
      return { ...state, isPaused: !state.isPaused }

    default:
      return state
  }
}
