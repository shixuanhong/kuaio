/**
 * Modifiers are special keys which are used to generate special characters or cause special actions when used in combination with other keys.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#whitespace_keys
 */
export const ModifierKeys = {
  /** This is the `Alt` key, which is the `Option` or `⌥` key on Mac keyboards. */
  Alt: 'Alt',
  CapsLock: 'CapsLock',
  /** This is the `Ctrl` key, which is the `Control` or `⌃` key on Mac keyboards. */
  Control: 'Control',
  /** This is the `Windows` or `⊞` key, which is the `Command` or `⌘` key on Mac keyboards. */
  Meta: 'Meta',
  NumLock: 'NumLock',
  ScrollLock: 'ScrollLock',
  Shift: 'Shift'
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#whitespace_keys
 */
export const WhitespaceKeys = {
  Enter: 'Enter',
  Tab: 'Tab',
  SPACE: ' '
}

/**
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
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#editing_keys
 */
export const EditingKeys = {
  /** This is the `Backspace` key, which is the `Delete` key on Mac keyboards. */
  Backspace: 'Backspace',
  /** The Mac generates the "Delete" value when Fn is pressed in tandem with Delete. */
  Delete: 'Delete',
  Insert: 'Insert'
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#ui_keys
 */
export const UIKeys = {
  ContextMenu: 'ContextMenu',
  Escape: 'Escape',
  Pause: 'Pause'
}

/**
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

export const GeneralKeys = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F',
  G: 'G',
  H: 'H',
  I: 'I',
  J: 'J',
  K: 'K',
  L: 'L',
  M: 'M',
  N: 'N',
  O: 'O',
  P: 'P',
  Q: 'Q',
  R: 'R',
  S: 'S',
  T: 'T',
  U: 'U',
  V: 'V',
  W: 'W',
  X: 'X',
  Y: 'Y',
  Z: 'Z',
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
  ExclamationMark: '!',
  AtSign: '@',
  DollarSign: '$',
  PercentSign: '%',
  Caret: '^',
  Ampersand: '&',
  Asterisk: '*',
  LeftParenthesis: '(',
  RightParenthesis: ')',
  MinusSign: '-',
  Underscore: '_',
  EqualSign: '=',
  PlusSign: '+',
  Backquote: '`',
  Tilde: '~',
  LeftSquareBracket: '[',
  RightSquareBracket: ']',
  LeftCurlyBracket: '{',
  RightCurlyBracket: '}',
  Backslash: '\\',
  VerticalLine: '|',
  Semicolon: ';',
  Colon: ':',
  SingleQuote: "'",
  DoubleQuote: '"',
  Comma: ',',
  Dot: '.',
  Slash: '/',
  QuestionMark: '?'
}
