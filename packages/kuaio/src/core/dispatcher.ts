import { CombinationModifierKeys, ModifierKeys } from '../enums'
import { sleep } from '../utils'
import { KuaioKey } from './key'
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

// Normalize the modifier list on each combination into the KeyboardEvent shape.
// This ensures `KeyboardEvent` receives the canonical ctrl/alt/meta/shift flags
// while also exposing less common modifier toggles via `getModifierState`.
const getModifierState = (modifiers: string[]): ModifierState => ({
  ctrlKey: modifiers.includes(CombinationModifierKeys.Control),
  shiftKey: modifiers.includes(CombinationModifierKeys.Shift),
  altKey: modifiers.includes(CombinationModifierKeys.Alt),
  metaKey: modifiers.includes(CombinationModifierKeys.Meta),
  modifierCapsLock: modifiers.includes(ModifierKeys.CapsLock),
  modifierAltGraph: modifiers.includes(ModifierKeys.AltGraph),
  modifierNumLock: modifiers.includes(ModifierKeys.NumLock),
  modifierScrollLock: modifiers.includes(ModifierKeys.ScrollLock)
})

// Dispatch a single synthetic keyboard event with the provided key metadata.
const dispatchEvent = (
  target: EventTarget,
  type: string,
  kuaioKey: KuaioKey,
  modifierState: ModifierState
): void => {
  const event = new KeyboardEvent(type, {
    key: kuaioKey.key,
    code: kuaioKey.code,
    bubbles: true,
    cancelable: true,
    ...modifierState
  })
  target.dispatchEvent(event)
}

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

  // Dispatch every combination sequentially, emitting a keydown/keyup pair
  // (if a trigger key exists) and then honoring either the per-combo timeout
  // or the provided base timeout before moving to the next item.
  for (const item of sequence) {
    const { key, modifiers, timeout } = item
    const modifierKeys = modifiers
      .map((modifier) => modifier.key)
      .filter((key): key is string => typeof key === 'string')
    const modifierState = getModifierState(modifierKeys)

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
