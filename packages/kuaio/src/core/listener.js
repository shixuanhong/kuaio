import {
  getGlyphModifierKeyState,
  getCombinationModifierKeyMatched,
  keyEqualTo
} from '../utils/index'
import { getDefaultConfig } from './config/index'
import { getCachedLayout } from './layout/index'

const assertSequenceValid = (sequence) => {
  if (sequence.length === 0) {
    throw new Error('Sequence cannot be empty.')
  }

  sequence.forEach((sequenceItem, index) => {
    if (!sequenceItem?.key) {
      throw new Error(
        `The sequenceItem at position ${index} in the sequence does not specify the property: [key].`
      )
    }
  })
}

export function createNativeEventListener(
  callback,
  sequence,
  config = {}
) {
  assertSequenceValid(sequence)

  /** Record the index of the current sequence. */
  let sequenceIndex = 0
  /** Store sequence timer. */
  let timer = null
  /** Used to reset the sequenceIndex when the sequence is ended or breaked. */
  const resetSequenceIndex = () => {
    sequenceIndex = 0
  }
  const resetSequenceTimer = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }
  const resetSequenceState = () => {
    resetSequenceTimer()
    resetSequenceIndex()
  }
  /**
   * Press keys in the next element in the sequence before the specified timeout
   * otherwise the current sequence is breaked.
   */
  const createSequenceTimer = (timeout) => {
    timer = setTimeout(resetSequenceState, timeout)
  }

  return async (event) => {
    const defaultConfig = getDefaultConfig()
    const {
      preventDefault,
      stopPropagation,
      stopImmediatePropagation,
      sequenceTimeout,
      disableGlyphHandler
    } = { ...defaultConfig, ...config }

    const sequenceItem = sequence[sequenceIndex]
    let triggerKey = event.key
    /** Skip if the current key is one of the modifiers of the current sequenceItem. */
    if (sequenceItem.modifiers.indexOf(triggerKey) > -1) return

    const modifiersMatched = getCombinationModifierKeyMatched(
      sequenceItem.modifiers,
      event
    )

    const layout = await getCachedLayout()
    if (!disableGlyphHandler) {
      const { glyphHandler } = layout.handlers
      triggerKey = glyphHandler(event.key, getGlyphModifierKeyState(event))
    }

    if (keyEqualTo(triggerKey, sequenceItem.key) && modifiersMatched) {
      /**
       * After the conditions of the current sequence element are met, prevent the browser's default behavior,
       * prevent event propagation, and prevent other event listeners on the current event target listening to the same event from being called.
       */
      if (sequenceItem.preventDefault ?? preventDefault) {
        event.preventDefault()
      }
      if (sequenceItem.stopPropagation ?? stopPropagation) {
        event.stopPropagation()
      }
      if (sequenceItem.stopImmediatePropagation ?? stopImmediatePropagation) {
        event.stopImmediatePropagation()
      }
      if (sequenceIndex === sequence.length - 1) {
        callback(event)
        resetSequenceState()
      } else {
        resetSequenceTimer()
        sequenceIndex++
        createSequenceTimer(sequenceItem.timeout ?? sequenceTimeout)
      }
    } else {
      /** sequence break. */
      resetSequenceState()
    }
  }
}

export function createNativeEventListeners(options, callback) {
  const { target, config, eventType, sequenceList } = options
  const listeners = sequenceList.map((sequence) => {
    const listener = createNativeEventListener(
      callback,
      sequence,
      config
    )
    target.addEventListener(eventType, listener)
    return listener
  })

  return listeners
}
