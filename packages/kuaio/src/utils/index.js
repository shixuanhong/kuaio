import {
  CombinationModifierKeys,
  ModifierKeys,
  PlatformBrand
} from '../constants/index'

export function keyEqualTo(key1, key2) {
  return key1 === key2
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
  } else {
    return e.getModifierState(modifier)
  }
}

/**
 * Returns true if the key in modifiers is pressed and the other combination modifier keys are not pressed.
 * @param {string[]} modifiers
 * @param {KeyboardEvent} e
 * @returns {boolean}
 */
export function getCombinationModifierKeyMatched(modifiers, e) {
  if (modifiers.length === 0) {
    return true
  }
  return Object.values(CombinationModifierKeys).every(
    (key) => getModifierKeyPressed(key, e) === modifiers.indexOf(key) > -1
  )
}

/**
 * @param {string} key
 * @returns {boolean}
 */
export function isCombinationModifierKey(key) {
  return Boolean(CombinationModifierKeys[key])
}

/**
 * @param {KeyboardEvent} e
 */
export function getGlyohModifierKeyState(e) {
  return {
    [ModifierKeys.Shift]: e.shiftKey,
    [ModifierKeys.CapsLock]: e.getModifierState(ModifierKeys.CapsLock),
    [ModifierKeys.AltGraph]: e.getModifierState(ModifierKeys.AltGraph)
  }
}

/**
 * Get the operating system of the current user agent
 * @returns {string}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData/platform
 */
export function getPlatform() {
  if (navigator.userAgentData) {
    return navigator.userAgentData.platform
  } else {
    // The judgment here is still not completely accurate.
    if (navigator.userAgent.indexOf('Windows') > -1) {
      return PlatformBrand.Windows
    } else if (navigator.userAgent.indexOf('iPhone OS') > -1) {
      return PlatformBrand.IOS
    } else if (navigator.userAgent.indexOf('iPad') > -1) {
      return PlatformBrand.IPadOS
    } else if (navigator.userAgent.indexOf('Mac OS X') > -1) {
      // On iOS or iPad OS, the userAgent string also contains "Mac OS X", so the judgment is placed here.
      return PlatformBrand.MacOS
    } else if (navigator.userAgent.indexOf('Android') > -1) {
      return PlatformBrand.Android
    } else if (navigator.userAgent.indexOf('Linux') > -1) {
      // On Android, the userAgent string also contains "Linux", so the judgment is placed here.
      return PlatformBrand.Linux
    } else {
      return PlatformBrand.Unknown
    }
  }
}
