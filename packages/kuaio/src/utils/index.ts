import { VirtualKeys } from '../constants/index'
import {
  CombinationModifierKeys,
  CombinationModifierKeyAlias,
  PlatformBrand,
  ModifierKeys,
  GeneralKeys
} from '../enums'
import { KuaioKey, KuaioKeyInit } from '../core/key'
import { KuaioLayout } from '../core/layout/index'

/**
 * Normalize a flexible input into a `KuaioKey` instance.
 * - `KuaioKey`: returned as-is
 * - `string`: resolved to physical code via layout's `keyToCodeHandler`
 * - `KuaioKeyInit`: used to construct a new `KuaioKey`
 */
export function normalizeToKuaioKey(
  input: string | KuaioKeyInit | KuaioKey,
  layout: KuaioLayout
): KuaioKey {
  if (input instanceof KuaioKey) {
    return input
  } else if (typeof input === 'string') {
    const realKey = getRealKey(input)
    if (isCombinationModifierKey(realKey)) {
      return new KuaioKey({ key: realKey, matchMode: 'key' })
    }
    const code = layout.keyToCodeHandler(realKey)
    return new KuaioKey({ code, matchMode: 'code' })
  } else {
    return new KuaioKey(input)
  }
}

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

export function getCombinationModifierKeyMatched(
  modifiers: KuaioKey[],
  e: KeyboardEvent
) {
  return Object.values(CombinationModifierKeys).every(
    (key) =>
      getModifierKeyPressed(key, e) ===
      modifiers.findIndex((item) => item.key === key) > -1
  )
}

export function isCombinationModifierKey(key: string): boolean {
  return (Object.values(CombinationModifierKeys) as string[]).includes(key)
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

let upperCaseKeyMap: Map<string, string> | null = null

export function getUpperCaseKeyMap() {
  if (!upperCaseKeyMap) {
    const upperCasekeyEntries = [
      ...Object.entries(GeneralKeys).map((entry) => [entry[1], entry[0]]),
      ...Object.entries(GeneralKeys).map((entry) => [entry[0], entry[0]]),
      ...Object.entries(CombinationModifierKeyAlias),
      ...Object.entries(VirtualKeys)
    ].map((entry) => [entry[0].toUpperCase(), entry[1]] as [string, string])
    upperCaseKeyMap = new Map(upperCasekeyEntries)
  }
  return upperCaseKeyMap
}

export function getRealKey(key: string): string {
  const _upperCaseKeyMap = getUpperCaseKeyMap()
  const upperCaseKey = key.toLocaleUpperCase()
  if (_upperCaseKeyMap.has(upperCaseKey)) {
    return _upperCaseKeyMap.get(upperCaseKey) as string
  } else {
    return key
  }
}

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))
