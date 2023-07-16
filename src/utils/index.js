import { ModifierKeys } from '../constants/index'
import { defaultConfig } from '../core/config/index'

export function keyEqualTo(key1, key2) {
  return key1.toLowerCase() === key2.toLowerCase()
}

export function getModifierKeyPressed(modifier, e) {
  if (keyEqualTo(modifier, ModifierKeys.Alt)) {
    return e.altKey
  } else if (keyEqualTo(modifier, ModifierKeys.Control)) {
    return e.ctrlKey
  } else if (keyEqualTo(modifier, ModifierKeys.Meta)) {
    return e.metaKey
  } else if (keyEqualTo(modifier, ModifierKeys.Shift)) {
    return e.shiftKey
  } else if (keyEqualTo(modifier, ModifierKeys.CapsLock)) {
    return e.getModifierState(ModifierKeys.CapsLock)
  } else {
    return e.getModifierState(modifier)
  }
}
