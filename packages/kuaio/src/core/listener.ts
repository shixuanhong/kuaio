import {
  getGlyphModifierKeyState,
  getCombinationModifierKeyMatched,
  keyEqualTo
} from '../utils/index'
import { KuaioConfig, getDefaultConfig } from './config/index'
import { getCachedLayout } from './layout/index'
import { KuaioSequence } from './sequence'

const assertSequenceValid = (sequence: KuaioSequence): void => {
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

export type KuaioCallback = (e: KeyboardEvent) => void

export function createNativeEventListener(
  callback: KuaioCallback,
  sequence: KuaioSequence,
  config: Partial<KuaioConfig> = {}
): EventListener {
  assertSequenceValid(sequence)

  /** Record the index of the current sequence. */
  let sequenceIndex = 0
  /** Store sequence timer. */
  let timer: ReturnType<typeof setTimeout> | null = null
  /** Used to reset the sequenceIndex when the sequence is ended or breaked. */
  const resetSequenceIndex = (): void => {
    sequenceIndex = 0
  }
  const resetSequenceTimer = (): void => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }
  const resetSequenceState = (): void => {
    resetSequenceTimer()
    resetSequenceIndex()
  }
  /**
   * Press keys in the next element in the sequence before the specified timeout
   * otherwise the current sequence is breaked.
   */
  const createSequenceTimer = (timeout: number): void => {
    timer = setTimeout(resetSequenceState, timeout)
  }

  return (async (event: Event) => {
    const keyboardEvent = event as KeyboardEvent
    const defaultConfig = getDefaultConfig()
    const {
      preventDefault,
      stopPropagation,
      stopImmediatePropagation,
      sequenceTimeout,
      disableGlyphHandler
    } = { ...defaultConfig, ...config }

    const sequenceItem = sequence[sequenceIndex]
    let triggerKey = keyboardEvent.key
    /** Skip if the current key is one of the modifiers of the current sequenceItem. */
    if (sequenceItem.modifiers.indexOf(triggerKey) > -1) return

    const modifiersMatched = getCombinationModifierKeyMatched(
      sequenceItem.modifiers,
      keyboardEvent
    )

    const layout = await getCachedLayout()
    if (!disableGlyphHandler) {
      const { glyphHandler } = layout
      triggerKey = glyphHandler(keyboardEvent.key, getGlyphModifierKeyState(keyboardEvent))
    }

    if (keyEqualTo(triggerKey, sequenceItem.key!) && modifiersMatched) {
      /**
       * After the conditions of the current sequence element are met, prevent the browser's default behavior,
       * prevent event propagation, and prevent other event listeners on the current event target listening to the same event from being called.
       */
      if (sequenceItem.preventDefault ?? preventDefault) {
        keyboardEvent.preventDefault()
      }
      if (sequenceItem.stopPropagation ?? stopPropagation) {
        keyboardEvent.stopPropagation()
      }
      if (sequenceItem.stopImmediatePropagation ?? stopImmediatePropagation) {
        keyboardEvent.stopImmediatePropagation()
      }
      if (sequenceIndex === sequence.length - 1) {
        callback(keyboardEvent)
        resetSequenceState()
      } else {
        resetSequenceTimer()
        sequenceIndex++
        createSequenceTimer(sequenceItem.timeout ?? sequenceTimeout!)
      }
    } else {
      /** sequence break. */
      resetSequenceState()
    }
  }) as EventListener
}

export interface CreateNativeEventListenersOptions {
  target: EventTarget
  config: Partial<KuaioConfig>
  eventType: string
  sequenceList: KuaioSequence[]
}

export function createNativeEventListeners(
  options: CreateNativeEventListenersOptions,
  callback: KuaioCallback
): EventListener[] {
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
