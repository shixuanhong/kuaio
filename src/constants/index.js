export * from './keys'

/**
 * @enum {string}
 */
export const KeyboardEventType = {
  KeyDown: 'keydown',
  KeyUp: 'keyup'
}

/**
 * @enum {string}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData/platform
 */
export const PlatformBrand = {
  Windows: 'Windows',
  MacOS: 'macOS',
  IOS: 'iOS',
  IPadOS: 'iPadOS',
  Linux: 'Linux',
  Android: 'Android',
  Unknown: 'Unknown'
}
