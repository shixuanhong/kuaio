import { ModifierKeys } from '../constants/index'

export function keyEqualTo(key1, key2) {
  return key1.toLowerCase() === key2.toLowerCase()
}

export function getKeyMethodName(key) {
  const temp = Array.from(key)
  temp[0] = temp[0].toLowerCase()
  return temp.join('')
}

export function getModifierKeyPressed(modifier, e) {
  if (keyEqualTo(modifier, ModifierKeys.ALT)) {
    return e.altKey
  } else if (keyEqualTo(modifier, ModifierKeys.CONTROL)) {
    return e.ctrlKey
  } else if (keyEqualTo(modifier, ModifierKeys.META)) {
    return e.metaKey
  } else if (keyEqualTo(modifier, ModifierKeys.SHIFT)) {
    return e.shiftKey
  } else if (keyEqualTo(modifier, ModifierKeys.CAPS_LOCK)) {
    return e.getModifierState(ModifierKeys.CAPS_LOCK)
  } else {
    return e.getModifierState(modifier)
  }
}
