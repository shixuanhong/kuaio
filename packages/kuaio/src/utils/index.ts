import { VirtualKeys } from '../constants/index'
import {
  CombinationModifierKeys,
  CombinationModifierKeyAlias,
  ModifierKeys,
  PlatformBrand
} from '../enums'

export function keyEqualTo(key1: string, key2: string): boolean {
  return key1 === key2
}

/**
 * Check if a modifier key is pressed from a keyboard event
 */
export function getModifierKeyPressed(
  modifier: string,
  e: KeyboardEvent
): boolean {
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
 */
export function getCombinationModifierKeyMatched(
  modifiers: string[],
  e: KeyboardEvent
): boolean {
  return Object.values(CombinationModifierKeys).every(
    (key) => getModifierKeyPressed(key, e) === modifiers.indexOf(key) > -1
  )
}

export function isCombinationModifierKey(key: string): boolean {
  return (Object.values(CombinationModifierKeys) as string[]).includes(key)
}

/**
 * Get the state of the modifier keys that can be used to generate the glyph.
 */
export function getGlyphModifierKeyState(
  e: KeyboardEvent
): Record<string, boolean> {
  return {
    [ModifierKeys.Shift]: e.shiftKey,
    [ModifierKeys.CapsLock]: e.getModifierState(ModifierKeys.CapsLock),
    [ModifierKeys.AltGraph]: e.getModifierState(ModifierKeys.AltGraph),
    [ModifierKeys.NumLock]: e.getModifierState(ModifierKeys.NumLock),
    // In macOS, the Option key also changes the glyph
    [CombinationModifierKeyAlias.Option]: e.getModifierState(
      CombinationModifierKeyAlias.Option
    )
  }
}

/**
 * Get the operating system of the current user agent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData/platform
 */
export function getPlatform(): string {
  if ((navigator as any).userAgentData) {
    return (navigator as any).userAgentData.platform
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

export function getRealKey(key: string): string {
  if (key in CombinationModifierKeyAlias) {
    return CombinationModifierKeyAlias[key as keyof typeof CombinationModifierKeyAlias]
  } else if (key in VirtualKeys) {
    return VirtualKeys[key as keyof typeof VirtualKeys]
  } else {
    return key
  }
}
