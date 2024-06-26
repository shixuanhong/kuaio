import { getPlatform } from '../utils/index'
import { PlatformBrand } from './index'

/**
 * @enum {string}
 */
export const CombinationModifierKeys = {
  /** This is the `Alt` key, which is the `Option` or `⌥` key on Mac keyboards. */
  Alt: 'Alt',
  /** This is the `Ctrl` key, which is the `Control` or `⌃` key on Mac keyboards. */
  Control: 'Control',
  /** This is the `Windows` or `⊞` key, which is the `Command` or `⌘` key on Mac keyboards. */
  Meta: 'Meta',
  Shift: 'Shift'
}

/**
 * @enum {string}
 */
export const CombinationModifierKeyAlias = {
  Ctrl: CombinationModifierKeys.Control,
  Option: CombinationModifierKeys.Alt,
  Command: CombinationModifierKeys.Meta,
  Windows: CombinationModifierKeys.Meta
}

export const VirtualKeys = {
  /**
   * This is a virtual key, inspired by Mousetrap. \
   * It will be mapped to the `Command` key on MacOS, and the `Ctrl` key on other operating systems.
   */
  get Mod() {
    return getPlatform() === PlatformBrand.MacOS
      ? CombinationModifierKeys.Meta
      : CombinationModifierKeys.Control
  }
}

/**
 * Modifiers are special keys which are used to generate special characters or cause special actions when used in combination with other keys.
 * @enum {string}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#whitespace_keys
 */
export const ModifierKeys = {
  AltGraph: 'AltGraph',
  CapsLock: 'CapsLock',
  NumLock: 'NumLock',
  ScrollLock: 'ScrollLock',
  ...CombinationModifierKeys
}

/**
 * @enum {string}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#whitespace_keys
 */
export const WhitespaceKeys = {
  /** This is the `Enter` key, which is the `Return` key on Mac keyboards. */
  Enter: 'Enter',
  Tab: 'Tab',
  Space: ' '
}

/**
 * @enum {string}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#navigation_keys
 */
export const NavigationKeys = {
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  End: 'End',
  Home: 'Home',
  PageDown: 'PageDown',
  PageUp: 'PageUp'
}

/**
 * @enum {string}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#editing_keys
 */
export const EditingKeys = {
  /** This is the `Backspace` key, which is the `Delete` key on Mac keyboards. */
  Backspace: 'Backspace',
  /** The Mac generates the "Delete" value when `Fn` key is pressed in tandem with `Delete` key. */
  Delete: 'Delete',
  Insert: 'Insert'
}

/**
 * @enum {string}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#ui_keys
 */
export const UIKeys = {
  ContextMenu: 'ContextMenu',
  Escape: 'Escape',
  Pause: 'Pause'
}

/**
 * @enum {string}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#function_keys
 */
export const FunctionKeys = {
  F1: 'F1',
  F2: 'F2',
  F3: 'F3',
  F4: 'F4',
  F5: 'F5',
  F6: 'F6',
  F7: 'F7',
  F8: 'F8',
  F9: 'F9',
  F10: 'F10',
  F12: 'F12',
  F13: 'F13',
  F14: 'F14',
  F15: 'F15',
  F16: 'F16',
  F17: 'F17',
  F18: 'F18',
  F19: 'F19',
  F20: 'F20'
}

/**
 * @enum {string}
 */
export const GeneralKeys = {
  A: 'a',
  B: 'b',
  C: 'c',
  D: 'd',
  E: 'e',
  F: 'f',
  G: 'g',
  H: 'h',
  I: 'i',
  J: 'j',
  K: 'k',
  L: 'l',
  M: 'm',
  N: 'n',
  O: 'o',
  P: 'p',
  Q: 'q',
  R: 'r',
  S: 's',
  T: 't',
  U: 'u',
  V: 'v',
  W: 'w',
  X: 'x',
  Y: 'y',
  Z: 'z',
  Digit0: '0',
  Digit1: '1',
  Digit2: '2',
  Digit3: '3',
  Digit4: '4',
  Digit5: '5',
  Digit6: '6',
  Digit7: '7',
  Digit8: '8',
  Digit9: '9',
  /** `!` */
  ExclamationMark: '!',
  /** `@` */
  At: '@',
  /** `#` */
  Number: '#',
  /** `$` */
  Dollar: '$',
  /** `%` */
  Percent: '%',
  /** `^` */
  Caret: '^',
  /** `&` */
  Ampersand: '&',
  /** `*` */
  Asterisk: '*',
  /** `(` */
  ParenthesisLeft: '(',
  /** `)` */
  ParenthesisRight: ')',
  /** `-` */
  Minus: '-',
  /** `_` */
  Underscore: '_',
  /** `=` */
  Equal: '=',
  /** `+` */
  Plus: '+',
  /** `` ` `` */
  Backquote: '`',
  /** `~` */
  Tilde: '~',
  /** `[` */
  BracketLeft: '[',
  /** `]` */
  BracketRight: ']',
  /** { */
  CurlyBracketLeft: '{',
  /** } */
  CurlyBracketRight: '}',
  /** `\`*/
  Backslash: '\\',
  /** `|`*/
  VerticalLine: '|',
  /** `;`*/
  Semicolon: ';',
  /** `:`*/
  Colon: ':',
  /** `'`*/
  Quote: "'",
  /** `""`*/
  DoubleQuotes: '"',
  /** `,`*/
  Comma: ',',
  /** `<`*/
  LessThan: '<',
  /** `.`*/
  Period: '.',
  /** `>`*/
  GreaterThan: '>',
  /** `/`*/
  Slash: '/',
  /** `?`*/
  QuestionMark: '?'
}
