export * from './keys'
export * from './codes'

export enum KeyboardEventType {
  KeyDown = 'keydown',
  KeyUp = 'keyup'
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData/platform
 */
export enum PlatformBrand {
  Windows = 'Windows',
  MacOS = 'macOS',
  IOS = 'iOS',
  IPadOS = 'iPadOS',
  Linux = 'Linux',
  Android = 'Android',
  Unknown = 'Unknown'
}

export enum KeyboardLayout {
  QWERTY = 'QWERTY',
  AZERTY = 'AZERTY',
  QWERTZ = 'QWERTZ',
  DVORAK = 'Dvorak'
}
