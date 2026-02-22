import { CombinationModifierKeys, ModifierKeys } from '../constants/index'
import { KuaioSequence } from './sequence'

interface ModifierState {
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
  metaKey: boolean
  modifierCapsLock: boolean
  modifierAltGraph: boolean
  modifierNumLock: boolean
  modifierScrollLock: boolean
}

const getModifierState = (modifiers: string[]): ModifierState => {
  return {
    ctrlKey: modifiers.includes(CombinationModifierKeys.Control),
    shiftKey: modifiers.includes(CombinationModifierKeys.Shift),
    altKey: modifiers.includes(CombinationModifierKeys.Alt),
    metaKey: modifiers.includes(CombinationModifierKeys.Meta),
    modifierCapsLock: modifiers.includes(ModifierKeys.CapsLock),
    modifierAltGraph: modifiers.includes(ModifierKeys.AltGraph),
    modifierNumLock: modifiers.includes(ModifierKeys.NumLock),
    modifierScrollLock: modifiers.includes(ModifierKeys.ScrollLock)
  }
}

const dispatchEvent = (target: EventTarget, type: string, key: string, modifierState: ModifierState): void => {
  const event = new KeyboardEvent(type, {
    key,
    bubbles: true,
    cancelable: true,
    view: window,
    ...modifierState
  })
  target.dispatchEvent(event)
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export interface DispatchSequenceOptions {
  target: EventTarget
  sequence: KuaioSequence
  baseTimeout?: number
}

export async function dispatchSequence({
  target,
  sequence,
  baseTimeout = 200
}: DispatchSequenceOptions): Promise<void> {
  if (!target || typeof target.dispatchEvent !== 'function') {
    throw new Error(
      'Parameter [target] must be an EventTarget (e.g. DOM Element).'
    )
  }

  for (const item of sequence) {
    const { key, modifiers, timeout } = item
    const modifierState = getModifierState(modifiers)

    // KeyDown for main key
    if (key) {
      dispatchEvent(target, 'keydown', key, modifierState)
    }
    // KeyUp for main key
    if (key) {
      dispatchEvent(target, 'keyup', key, modifierState)
    }

    // Wait
    await sleep(timeout ?? baseTimeout)
  }
}
