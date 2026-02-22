/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#modifier_keys
 */
export enum CombinationModifierKeys {
  /** This is the `Alt` key, which is the `Option` or `⌥` key on Mac keyboards. */
  Alt = 'Alt',
  /** This is the `Ctrl` key, which is the `Control` or `⌃` key on Mac keyboards. */
  Control = 'Control',
  /** This is the `Windows` or `⊞` key, which is the `Command` or `⌘` key on Mac keyboards. */
  Meta = 'Meta',
  Shift = 'Shift'
}

export enum CombinationModifierKeyAlias {
  Ctrl = CombinationModifierKeys.Control,
  Option = CombinationModifierKeys.Alt,
  Command = CombinationModifierKeys.Meta,
  Windows = CombinationModifierKeys.Meta
}

/**
 * Modifiers are special keys which are used to generate special characters or cause special actions when used in combination with other keys.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#whitespace_keys
 */
export enum ModifierKeys {
  AltGraph = 'AltGraph',
  CapsLock = 'CapsLock',
  NumLock = 'NumLock',
  ScrollLock = 'ScrollLock',
  Alt = 'Alt',
  Control = 'Control',
  Meta = 'Meta',
  Shift = 'Shift'
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#whitespace_keys
 */
export enum WhitespaceKeys {
  /** This is the `Enter` key, which is the `Return` key on Mac keyboards. */
  Enter = 'Enter',
  Tab = 'Tab',
  Space = ' '
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#navigation_keys
 */
export enum NavigationKeys {
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  ArrowUp = 'ArrowUp',
  End = 'End',
  Home = 'Home',
  PageDown = 'PageDown',
  PageUp = 'PageUp'
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#editing_keys
 */
export enum EditingKeys {
  /** This is the `Backspace` key, which is the `Delete` key on Mac keyboards. */
  Backspace = 'Backspace',
  /** The Mac generates the "Delete" value when `Fn` key is pressed in tandem with `Delete` key. */
  Delete = 'Delete',
  Insert = 'Insert'
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#ui_keys
 */
export enum UIKeys {
  ContextMenu = 'ContextMenu',
  Escape = 'Escape',
  Pause = 'Pause'
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#function_keys
 */
export enum FunctionKeys {
  F1 = 'F1',
  F2 = 'F2',
  F3 = 'F3',
  F4 = 'F4',
  F5 = 'F5',
  F6 = 'F6',
  F7 = 'F7',
  F8 = 'F8',
  F9 = 'F9',
  F10 = 'F10',
  F12 = 'F12',
  F13 = 'F13',
  F14 = 'F14',
  F15 = 'F15',
  F16 = 'F16',
  F17 = 'F17',
  F18 = 'F18',
  F19 = 'F19',
  F20 = 'F20'
}

export enum GeneralKeys {
  A = 'a',
  B = 'b',
  C = 'c',
  D = 'd',
  E = 'e',
  F = 'f',
  G = 'g',
  H = 'h',
  I = 'i',
  J = 'j',
  K = 'k',
  L = 'l',
  M = 'm',
  N = 'n',
  O = 'o',
  P = 'p',
  Q = 'q',
  R = 'r',
  S = 's',
  T = 't',
  U = 'u',
  V = 'v',
  W = 'w',
  X = 'x',
  Y = 'y',
  Z = 'z',
  Digit0 = '0',
  Digit1 = '1',
  Digit2 = '2',
  Digit3 = '3',
  Digit4 = '4',
  Digit5 = '5',
  Digit6 = '6',
  Digit7 = '7',
  Digit8 = '8',
  Digit9 = '9',
  /** `!` */
  ExclamationMark = '!',
  /** `@` */
  At = '@',
  /** `#` */
  Number = '#',
  /** `$` */
  Dollar = '$',
  /** `%` */
  Percent = '%',
  /** `^` */
  Caret = '^',
  /** `&` */
  Ampersand = '&',
  /** `*` */
  Asterisk = '*',
  /** `(` */
  ParenthesisLeft = '(',
  /** `)` */
  ParenthesisRight = ')',
  /** `-` */
  Minus = '-',
  /** `_` */
  Underscore = '_',
  /** `=` */
  Equal = '=',
  /** `+` */
  Plus = '+',
  /** `` ` `` */
  Backquote = '`',
  /** `~` */
  Tilde = '~',
  /** `[` */
  BracketLeft = '[',
  /** `]` */
  BracketRight = ']',
  /** { */
  CurlyBracketLeft = '{',
  /** } */
  CurlyBracketRight = '}',
  /** `\`*/
  Backslash = '\\',
  /** `|`*/
  VerticalLine = '|',
  /** `;`*/
  Semicolon = ';',
  /** `:`*/
  Colon = ':',
  /** `'`*/
  Quote = "'",
  /** `""`*/
  DoubleQuotes = '"',
  /** `,`*/
  Comma = ',',
  /** `<`*/
  LessThan = '<',
  /** `.`*/
  Period = '.',
  /** `>`*/
  GreaterThan = '>',
  /** `/`*/
  Slash = '/',
  /** `?`*/
  QuestionMark = '?'
}
