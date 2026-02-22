import { CombinationModifierKeys, ModifierKeys } from '../constants/index'

/**
 * @param {string[]} modifiers
 * @returns {Object}
 */
const getModifierState = (modifiers) => {
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

/**
 * @param {EventTarget} target
 * @param {string} type
 * @param {string} key
 * @param {Object} modifierState
 */
const dispatchEvent = (target, type, key, modifierState) => {
  const event = new KeyboardEvent(type, {
    key,
    bubbles: true,
    cancelable: true,
    view: window,
    ...modifierState
  })
  target.dispatchEvent(event)
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function dispatchSequence({
  target,
  sequence,
  baseTimeout = 200
}) {
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
