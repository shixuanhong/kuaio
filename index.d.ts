declare class Kuaio {
  readonly target: EventTarget
  private _eventType
  private _sequence
  private _sequenceTimeout
  private _curSequenceItem
  private _prventDefault
  private _stopPropagation
  private _stopImmediatePropagation
  private _listener?
  constructor(target: EventTarget)
  static create(target: EventTarget): Kuaio
  static global(): Kuaio
  private _pushSequenceItem
  private _getCurSequenceItem
  private _pushCurSequenceItem
  /**
   * Use the `keydown` event.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
   */
  keydown(): this
  /**
   * Use the `keyup` event.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
   */
  keyup(): this
  defaultSequenceTimeout(timeout: number): this
  defaultPrventDefault(value: boolean): this
  defaultStopPropagation(value: boolean): this
  defaultStopImmediatePropagation(value: boolean): this
  /**
   * Add a key to the modifier list
   */
  modifier(key: string): this
  /**
   * Add `Alt` key to modifier list, which is the `Option` or `⌥` key on Mac keyboards.
   */
  Alt(): this
  /**
   * Add `Ctrl` key to modifier list, which is the `Control` or `⌃` key on Mac keyboards.
   */
  Ctrl(): this
  /**
   * Add `Meta` key to modifier list, which is the `Windows` or `⊞` key on Windows keyboards, or the `Command` or `⌘` key on Mac keyboards.
   */
  Meta(): this
  /**
   * Add `Shift` key to modifier list
   */
  Shift(): this
  /**
   * Set a key as trigger key
   */
  key(key: string): this
  /**
   * Set `F1` as trigger key
   */
  F1(): this
  /**
   * Set `F2` as trigger key
   */
  F2(): this
  /**
   * Set `F3` as trigger key
   */
  F3(): this
  /**
   * Set `F4` as trigger key
   */
  F4(): this
  /**
   * Set `F5` as trigger key
   */
  F5(): this
  /**
   * Set `F6` as trigger key
   */
  F6(): this
  /**
   * Set `F7` as trigger key
   */
  F7(): this
  /**
   * Set `F8` as trigger key
   */
  F8(): this
  /**
   * Set `F9` as trigger key
   */
  F9(): this
  /**
   * Set `F10` as trigger key
   */
  F10(): this
  /**
   * Set `F11` as trigger key
   */
  F11(): this
  /**
   * Set `F12` as trigger key
   */
  F12(): this
  /**
   * Set `F13` as trigger key
   */
  F13(): this
  /**
   * Set `F14` as trigger key
   */
  F14(): this
  /**
   * Set `F15` as trigger key
   */
  F15(): this
  /**
   * Set `F16` as trigger key
   */
  F16(): this
  /**
   * Set `F17` as trigger key
   */
  F17(): this
  /**
   * Set `F18` as trigger key
   */
  F18(): this
  /**
   * Set `F19` as trigger key
   */
  F19(): this
  /**
   * Set `F20` as trigger key
   */
  F20(): this
  /**
   * Set `Enter` as trigger key
   */
  Enter(): this
  /**
   * Set `Tab` as trigger key
   */
  Tab(): this
  /**
   * Set `Space` as trigger key
   */
  Space(): this
  /**
   * Set `ArrowDown` as trigger key
   */
  ArrowDown(): this
  /**
   * Set `ArrowLeft` as trigger key
   */
  ArrowLeft(): this
  /**
   * Set `ArrowRight` as trigger key
   */
  ArrowRight(): this
  /**
   * Set `ArrowUp` as trigger key
   */
  ArrowUp(): this
  /**
   * Set `End` as trigger key
   */
  End(): this
  /**
   * Set `Home` as trigger key
   */
  Home(): this
  /**
   * Set `PageDown` as trigger key
   */
  PageDown(): this
  /**
   * Set `PageUp` as trigger key
   */
  PageUp(): this
  /**
   * Set `Backspace` as trigger key
   */
  Backspace(): this
  /**
   * Set `Delete` as trigger key
   */
  Delete(): this
  /**
   * Set `Insert` as trigger key
   */
  Insert(): this
  /**
   * Set `A` as trigger key
   */
  A(): this
  /**
   * Set `B` as trigger key
   */
  B(): this
  /**
   * Set `C` as trigger key
   */
  C(): this
  /**
   * Set `D` as trigger key
   */
  D(): this
  /**
   * Set `E` as trigger key
   */
  E(): this
  /**
   * Set `F` as trigger key
   */
  F(): this
  /**
   * Set `G` as trigger key
   */
  G(): this
  /**
   * Set `H` as trigger key
   */
  H(): this
  /**
   * Set `I` as trigger key
   */
  I(): this
  /**
   * Set `J` as trigger key
   */
  J(): this
  /**
   * Set `K` as trigger key
   */
  K(): this
  /**
   * Set `L` as trigger key
   */
  L(): this
  /**
   * Set `M` as trigger key
   */
  M(): this
  /**
   * Set `N` as trigger key
   */
  N(): this
  /**
   * Set `O` as trigger key
   */
  O(): this
  /**
   * Set `P` as trigger key
   */
  P(): this
  /**
   * Set `Q` as trigger key
   */
  Q(): this
  /**
   * Set `R` as trigger key
   */
  R(): this
  /**
   * Set `S` as trigger key
   */
  S(): this
  /**
   * Set `T` as trigger key
   */
  T(): this
  /**
   * Set `U` as trigger key
   */
  U(): this
  /**
   * Set `V` as trigger key
   */
  V(): this
  /**
   * Set `W` as trigger key
   */
  W(): this
  /**
   * Set `X` as trigger key
   */
  X(): this
  /**
   * Set `Y` as trigger key
   */
  Y(): this
  /**
   * Set `Z` as trigger key
   */
  Z(): this
  /**
   * Set `0` as trigger key
   */
  Digit0(): this
  /**
   * Set `1` as trigger key
   */
  Digit1(): this
  /**
   * Set `2` as trigger key
   */
  Digit2(): this
  /**
   * Set `3` as trigger key
   */
  Digit3(): this
  /**
   * Set `4` as trigger key
   */
  Digit4(): this
  /**
   * Set `5` as trigger key
   */
  Digit5(): this
  /**
   * Set `6` as trigger key
   */
  Digit6(): this
  /**
   * Set `7` as trigger key
   */
  Digit7(): this
  /**
   * Set `8` as trigger key
   */
  Digit8(): this
  /**
   * Set `9` as trigger key
   */
  Digit9(): this
  /**
   * Set `!` as trigger key
   */
  ExclamationMark(): this
  /**
   * Set `@` as trigger key
   */
  AtSign(): this
  /**
   * Set `#` as trigger key
   */
  NumberSign(): this
  /**
   * Set `$` as trigger key
   */
  DollarSign(): this
  /**
   * Set `%` as trigger key
   */
  PercentSign(): this
  /**
   * Set `^` as trigger key
   */
  Caret(): this
  /**
   * Set `&` as trigger key
   */
  Ampersand(): this
  /**
   * Set `*` as trigger key
   */
  Asterisk(): this
  /**
   * Set `(` as trigger key
   */
  LeftParenthesis(): this
  /**
   * Set `)` as trigger key
   */
  RightParenthesis(): this
  /**
   * Set `-` as trigger key
   */
  MinusSign(): this
  /**
   * Set `_` as trigger key
   */
  Underscore(): this
  /**
   * Set `=` as trigger key
   */
  EqualSign(): this
  /**
   * Set `+` as trigger key
   */
  PlusSign(): this
  /**
   * Set `` ` `` as trigger key
   */
  Backquote(): this
  /**
   * Set `~` as trigger key
   */
  Tilde(): this
  /**
   * Set `[` as trigger key
   */
  LeftSquareBracket(): this
  /**
   * Set `]` as trigger key
   */
  RightSquareBracket(): this
  /**
   * Set `{` as trigger key
   */
  LeftCurlyBracket(): this
  /**
   * Set `}` as trigger key
   */
  RightCurlyBracket(): this
  /**
   * Set `\` as trigger key
   */
  Backslash(): this
  /**
   * Set `|` as trigger key
   */
  VerticalLine(): this
  /**
   * Set `;` as trigger key
   */
  Semicolon(): this
  /**
   * Set `:` as trigger key
   */
  Colon(): this
  /**
   * Set `'` as trigger key
   */
  SingleQuote(): this
  /**
   * Set `"` as trigger key
   */
  DoubleQuote(): this
  /**
   * Set `,` as trigger key
   */
  Comma(): this
  /**
   * Set `<` as trigger key
   */
  LessThanSign(): this
  /**
   * Set `.` as trigger key
   */
  Dot(): this
  /**
   * Set `>` as trigger key
   */
  GreaterThanSign(): this
  /**
   * Set `/` as trigger key
   */
  Slash(): this
  /**
   * Set `?` as trigger key
   */
  QuestionMark(): this
  prventDefault(value: boolean): this
  stopPropagation(value: boolean): this
  stopImmediatePropagation(value: boolean): this
  after(timeout?: number): this
  bind(callback: Function): EventListener
  unbind(): void
}

declare function keyEqualTo(key1: string, key2: string): boolean

/**
 * Modifiers are special keys which are used to generate special characters or cause special actions when used in combination with other keys.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#whitespace_keys
 */
declare enum ModifierKeys {
  /** This is the `Alt` key, which is the `Option` or `⌥` key on Mac keyboards. */
  Alt = 'Alt',
  CapsLock = 'CapsLock',
  /** This is the `Ctrl` key, which is the `Control` or `⌃` key on Mac keyboards. */
  Control = 'Control',
  /** This is the `Windows` or `⊞` key, which is the `Command` or `⌘` key on Mac keyboards. */
  Meta = 'Meta',
  NumLock = 'NumLock',
  ScrollLock = 'ScrollLock',
  Shift = 'Shift'
}
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#whitespace_keys
 */
declare enum WhitespaceKeys {
  Enter = 'Enter',
  Tab = 'Tab',
  Space = ' '
}
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#navigation_keys
 */
declare enum NavigationKeys {
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
declare enum EditingKeys {
  /** This is the `Backspace` key, which is the `Delete` key on Mac keyboards. */
  Backspace = 'Backspace',
  /** The Mac generates the "Delete" value when Fn is pressed in tandem with Delete. */
  Delete = 'Delete',
  Insert = 'Insert'
}
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#function_keys
 */
declare enum FunctionKeys {
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

declare enum GeneralKeys {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  H = 'H',
  I = 'I',
  J = 'J',
  K = 'K',
  L = 'L',
  M = 'M',
  N = 'N',
  O = 'O',
  P = 'P',
  Q = 'Q',
  R = 'R',
  S = 'S',
  T = 'T',
  U = 'U',
  V = 'V',
  W = 'W',
  X = 'X',
  Y = 'Y',
  Z = 'Z',
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
  AtSign = '@',
  /** `#` */
  NumberSign = '#',
  /** `$` */
  DollarSign = '$',
  /** `%` */
  PercentSign = '%',
  /** `^` */
  Caret = '^',
  /** `&` */
  Ampersand = '&',
  /** `*` */
  Asterisk = '*',
  /** `(` */
  LeftParenthesis = '(',
  /** `)` */
  RightParenthesis = ')',
  /** `-` */
  MinusSign = '-',
  /** `_` */
  Underscore = '_',
  /** `=` */
  EqualSign = '=',
  /** `+` */
  PlusSign = '+',
  /** `` ` `` */
  Backquote = '`',
  /** `~` */
  Tilde = '~',
  /** `[` */
  LeftSquareBracket = '[',
  /** `]` */
  RightSquareBracket = ']',
  /** { */
  LeftCurlyBracket = '{',
  /** } */
  RightCurlyBracket = '}',
  /** `\`*/
  Backslash = '\\',
  /** `|`*/
  VerticalLine = '|',
  /** `;`*/
  Semicolon = ';',
  /** `=`*/
  Colon = '=',
  /** `'`*/
  SingleQuote = "'",
  /** `""`*/
  DoubleQuote = '"',
  /** `,`*/
  Comma = ',',
  /** `<`*/
  LessThanSign = '<',
  /** `.`*/
  Dot = '.',
  /** `>`*/
  GreaterThanSign = '>',
  /** `/`*/
  Slash = '/',
  /** `?`*/
  QuestionMark = '?'
}

declare enum KeyboardEventType {
  KeyDown = 'keydown',
  KeyUp = 'keyup'
}

export {
  EditingKeys,
  FunctionKeys,
  KeyboardEventType,
  Kuaio,
  ModifierKeys,
  NavigationKeys,
  WhitespaceKeys,
  GeneralKeys,
  keyEqualTo
}
