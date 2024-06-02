declare interface KuaioConfig {
  sequenceTimeout?: number
  preventDefault?: boolean
  stopPropagation?: boolean
  stopImmediatePropagation?: boolean
  disableGlyphHandler?: boolean
}

declare interface KuaioLayoutHandlers {
  validator: (layoutMap: Map<string, string>, langTag: string) => boolean
  glyphHandler: (
    key: string,
    glyphModifierState: Record<string, boolean>
  ) => string
}

declare type KuaioCallback = (e: KeyboardEvent) => void

declare class Kuaio {
  readonly target: EventTarget
  readonly config: KuaioConfig
  private _eventType
  private _curSequenceItem?
  private _curSequence?
  private _sequenceList
  private _listeners?
  constructor(target: EventTarget, config: KuaioConfig)
  static create(): Kuaio
  static create(target: EventTarget): Kuaio
  static create(config: KuaioConfig): Kuaio
  static create(target: EventTarget, config: KuaioConfig): Kuaio
  static bindFromKeyString(
    keyStr: string | string[],
    callback: KuaioCallback
  ): EventListener[]
  static setGlobalConfig(config: KuaioConfig): void
  static registryLayout(name: string, handlers: KuaioLayoutHandlers): void
  static unregistryLayout(name: string): void
  private _pushSequenceItem
  private _getCurSequenceItem
  private _pushCurSequenceItem
  private _pushSequence
  private _getCurSequence
  private _pushCurSequence
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
  /**
   * Add a key to the modifier list.
   */
  modifier(key: string): this
  /**
   * Add `Alt` key to modifier list, which is the `Option` or `⌥` key on Mac keyboards.
   */
  Alt(): this
  /**
   * Alias for method `Alt`.
   */
  Option(): this
  /**
   * Add `Ctrl` key to modifier list, which is the `Control` or `⌃` key on Mac keyboards.
   */
  Control(): this
  /**
   * Alias for method `Control`.
   */
  Ctrl(): this
  /**
   * Add `Meta` key to modifier list, which is the `Windows` or `⊞` key on Windows keyboards, or the `Command` or `⌘` key on Mac keyboards.
   */
  Meta(): this
  /**
   * Alias for method `Meta`.
   */
  Command(): this
  /**
   * Alias for method `Meta`.
   */
  Windows(): this
  /**
   * This is a virtual key, inspired by Mousetrap. \
   * It will be mapped to the `Command` key on Mac, and the `Ctrl` key on other operating systems.
   */
  Mod(): this
  /**
   * Add `Shift` key to modifier list.
   */
  Shift(): this
  /**
   * Set a key as trigger key.
   */
  key(key: string): this
  /**
   * Set `F1` as trigger key.
   */
  F1(): this
  /**
   * Set `F2` as trigger key.
   */
  F2(): this
  /**
   * Set `F3` as trigger key.
   */
  F3(): this
  /**
   * Set `F4` as trigger key.
   */
  F4(): this
  /**
   * Set `F5` as trigger key.
   */
  F5(): this
  /**
   * Set `F6` as trigger key.
   */
  F6(): this
  /**
   * Set `F7` as trigger key.
   */
  F7(): this
  /**
   * Set `F8` as trigger key.
   */
  F8(): this
  /**
   * Set `F9` as trigger key.
   */
  F9(): this
  /**
   * Set `F10` as trigger key.
   */
  F10(): this
  /**
   * Set `F11` as trigger key.
   */
  F11(): this
  /**
   * Set `F12` as trigger key.
   */
  F12(): this
  /**
   * Set `F13` as trigger key.
   */
  F13(): this
  /**
   * Set `F14` as trigger key.
   */
  F14(): this
  /**
   * Set `F15` as trigger key.
   */
  F15(): this
  /**
   * Set `F16` as trigger key.
   */
  F16(): this
  /**
   * Set `F17` as trigger key.
   */
  F17(): this
  /**
   * Set `F18` as trigger key.
   */
  F18(): this
  /**
   * Set `F19` as trigger key.
   */
  F19(): this
  /**
   * Set `F20` as trigger key.
   */
  F20(): this
  /**
   * Set `Enter` as trigger key.
   */
  Enter(): this
  /**
   * Alias for method `Enter`.
   */
  Return(): this
  /**
   * Set `Tab` as trigger key.
   */
  Tab(): this
  /**
   * Set `Space` as trigger key.
   */
  Space(): this
  /**
   * Set `ArrowDown` as trigger key.
   */
  ArrowDown(): this
  /**
   * Set `ArrowLeft` as trigger key.
   */
  ArrowLeft(): this
  /**
   * Set `ArrowRight` as trigger key.
   */
  ArrowRight(): this
  /**
   * Set `ArrowUp` as trigger key.
   */
  ArrowUp(): this
  /**
   * Set `End` as trigger key.
   */
  End(): this
  /**
   * Set `Home` as trigger key.
   */
  Home(): this
  /**
   * Set `PageDown` as trigger key.
   */
  PageDown(): this
  /**
   * Set `PageUp` as trigger key.
   */
  PageUp(): this
  /**
   * Set `Backspace` as trigger key, which is the `Delete` key on Mac keyboards.
   */
  Backspace(): this
  /**
   * Alias for method `Backspace`.
   */
  MacDelete(): this
  /**
   * Set `Delete` as trigger key. The Mac generates the "Delete" value when `Fn` key is pressed in tandem with `Delete` key.
   */
  Delete(): this
  /**
   * Set `Insert` as trigger key.
   */
  Insert(): this
  /**
   * Set `ContextMenu` as trigger key.
   */
  ContextMenu(): this
  /**
   * Set `Escape` as trigger key.
   */
  Escape(): this
  /**
   * Alias for method `Escape`.
   */
  Esc(): this
  /**
   * Set `Pause` as trigger key.
   */
  Pause(): this
  /**
   * Set `a` as trigger key.
   * @param {boolean} [upperCase=false] `A`
   */
  A(upperCase?: boolean): this
  /**
   * Set `b` as trigger key.
   * @param {boolean} [upperCase=false] `B`
   */
  B(upperCase?: boolean): this
  /**
   * Set `c` as trigger key.
   * @param {boolean} [upperCase=false] `C`
   */
  C(upperCase?: boolean): this
  /**
   * Set `d` as trigger key.
   * @param {boolean} [upperCase=false] `D`
   */
  D(upperCase?: boolean): this
  /**
   * Set `e` as trigger key.
   * @param {boolean} [upperCase=false] `E`
   */
  E(upperCase?: boolean): this
  /**
   * Set `f` as trigger key.
   * @param {boolean} [upperCase=false] `F`
   */
  F(upperCase?: boolean): this
  /**
   * Set `g` as trigger key.
   * @param {boolean} [upperCase=false] `G`
   */
  G(upperCase?: boolean): this
  /**
   * Set `h` as trigger key.
   * @param {boolean} [upperCase=false] `H`
   */
  H(upperCase?: boolean): this
  /**
   * Set `i` as trigger key.
   * @param {boolean} [upperCase=false] `I`
   */
  I(upperCase?: boolean): this
  /**
   * Set `j` as trigger key.
   * @param {boolean} [upperCase=false] `J`
   */
  J(upperCase?: boolean): this
  /**
   * Set `k` as trigger key.
   * @param {boolean} [upperCase=false] `K`
   */
  K(upperCase?: boolean): this
  /**
   * Set `l` as trigger key.
   * @param {boolean} [upperCase=false] `L`
   */
  L(upperCase?: boolean): this
  /**
   * Set `m` as trigger key.
   * @param {boolean} [upperCase=false] `M`
   */
  M(upperCase?: boolean): this
  /**
   * Set `n` as trigger key.
   * @param {boolean} [upperCase=false] `N`
   */
  N(upperCase?: boolean): this
  /**
   * Set `o` as trigger key.
   * @param {boolean} [upperCase=false] `O`
   */
  O(upperCase?: boolean): this
  /**
   * Set `p` as trigger key.
   * @param {boolean} [upperCase=false] `P`
   */
  P(upperCase?: boolean): this
  /**
   * Set `q` as trigger key.
   * @param {boolean} [upperCase=false] `Q`
   */
  Q(upperCase?: boolean): this
  /**
   * Set `r` as trigger key.
   * @param {boolean} [upperCase=false] `R`
   */
  R(upperCase?: boolean): this
  /**
   * Set `s` as trigger key.
   * @param {boolean} [upperCase=false] `S`
   */
  S(upperCase?: boolean): this
  /**
   * Set `t` as trigger key.
   * @param {boolean} [upperCase=false] `T`
   */
  T(upperCase?: boolean): this
  /**
   * Set `u` as trigger key.
   * @param {boolean} [upperCase=false] `U`
   */
  U(upperCase?: boolean): this
  /**
   * Set `v` as trigger key.
   * @param {boolean} [upperCase=false] `V`
   */
  V(upperCase?: boolean): this
  /**
   * Set `w` as trigger key.
   * @param {boolean} [upperCase=false] `W`
   */
  W(upperCase?: boolean): this
  /**
   * Set `x` as trigger key.
   * @param {boolean} [upperCase=false] `X`
   */
  X(upperCase?: boolean): this
  /**
   * Set `y` as trigger key.
   * @param {boolean} [upperCase=false] `Y`
   */
  Y(upperCase?: boolean): this
  /**
   * Set `z` as trigger key.
   * @param {boolean} [upperCase=false] `Z`
   */
  Z(upperCase?: boolean): this
  /**
   * Set `0` as trigger key.
   */
  Digit0(): this
  /**
   * Set `1` as trigger key.
   */
  Digit1(): this
  /**
   * Set `2` as trigger key.
   */
  Digit2(): this
  /**
   * Set `3` as trigger key.
   */
  Digit3(): this
  /**
   * Set `4` as trigger key.
   */
  Digit4(): this
  /**
   * Set `5` as trigger key.
   */
  Digit5(): this
  /**
   * Set `6` as trigger key.
   */
  Digit6(): this
  /**
   * Set `7` as trigger key.
   */
  Digit7(): this
  /**
   * Set `8` as trigger key.
   */
  Digit8(): this
  /**
   * Set `9` as trigger key.
   */
  Digit9(): this
  /**
   * Set `!` as trigger key.
   */
  ExclamationMark(): this
  /**
   * Set `@` as trigger key.
   */
  At(): this
  /**
   * Set `#` as trigger key.
   */
  Number(): this
  /**
   * Set `$` as trigger key.
   */
  Dollar(): this
  /**
   * Set `%` as trigger key.
   */
  Percent(): this
  /**
   * Set `^` as trigger key.
   */
  Caret(): this
  /**
   * Set `&` as trigger key.
   */
  Ampersand(): this
  /**
   * Set `*` as trigger key.
   */
  Asterisk(): this
  /**
   * Set `(` as trigger key.
   */
  ParenthesisLeft(): this
  /**
   * Set `)` as trigger key.
   */
  ParenthesisRight(): this
  /**
   * Set `-` as trigger key.
   */
  Minus(): this
  /**
   * Set `_` as trigger key.
   */
  Underscore(): this
  /**
   * Set `=` as trigger key.
   */
  Equal(): this
  /**
   * Set `+` as trigger key.
   */
  Plus(): this
  /**
   * Set `` ` `` as trigger key.
   */
  Backquote(): this
  /**
   * Set `~` as trigger key.
   */
  Tilde(): this
  /**
   * Set `[` as trigger key.
   */
  BracketLeft(): this
  /**
   * Set `]` as trigger key.
   */
  BracketRight(): this
  /**
   * Set `{` as trigger key.
   */
  CurlyBracketLeft(): this
  /**
   * Set `}` as trigger key.
   */
  CurlyBracketRight(): this
  /**
   * Set `\` as trigger key.
   */
  Backslash(): this
  /**
   * Set `|` as trigger key.
   */
  VerticalLine(): this
  /**
   * Set `;` as trigger key.
   */
  Semicolon(): this
  /**
   * Set `:` as trigger key.
   */
  Colon(): this
  /**
   * Set `'` as trigger key.
   */
  Quote(): this
  /**
   * Set `"` as trigger key.
   */
  DoubleQuotes(): this
  /**
   * Set `,` as trigger key.
   */
  Comma(): this
  /**
   * Set `<` as trigger key.
   */
  LessThan(): this
  /**
   * Set `.` as trigger key.
   */
  Period(): this
  /**
   * Set `>` as trigger key.
   */
  GreaterThan(): this
  /**
   * Set `/` as trigger key.
   */
  Slash(): this
  /**
   * Set `?` as trigger key.
   */
  QuestionMark(): this
  /**
   * Prevent the browser's default behavior when the sequence executes to the current combination.
   */
  prventDefault(): this
  /**
   * Prevent the event from propagating further when the sequence executes to the current combination.
   */
  stopPropagation(): this
  /**
   * Prevent other event listeners on the event target listening to the same event from being called when the sequence executes to the current composition.
   */
  stopImmediatePropagation(): this
  /**
   * Create the next combination in the sequence.
   * Example:
   *  ``` javascript
   * Kuaio.create({ preventDefault: true}).Control().K()
   * .after()
   * .Control().C()
   * .bind(e => {})
   * ```
   * After pressing the combination `Ctrl+K`, press `Ctrl+C` again within the specified time to execute the callback.
   * @param timeout  The timeout of the current combination in the sequence, which is the time to wait for the next combination in the sequence to be pressed.
   */
  after(timeout?: number): this
  /**
   * Create a new sequence, usually used to bind multiple sequences to the same callback.
   * Example:
   * ``` javascript
   * Kuaio.create({ preventDefault: true}).Control().A()
   * .or()
   * .Control().B()
   * .bind(e => {})
   * ```
   * Pressing `Ctrl+A` or `Ctrl+B` will execute the callback.\
   * Use with method `after`.
   * Example:
   * ``` javascript
   * Kuaio.create({ preventDefault: true}).Control().K()
   * .after()
   * .Control().C()
   * .or()
   * .Control().A()
   * .after()
   * .Control().B()
   * .bind(e => {})
   * ```
   * Pressing `Ctrl+K, Ctrl+C` or `Ctrl+A, Ctrl+B` will execute the callback.
   */
  or(): this
  /**
   * Bind the callback to sequences.
   * @param callback
   */
  bind(callback: KuaioCallback): EventListener[]
  /**
   * Unbind the callback and unbind all native event handlers.
   */
  unbind(): void
}

declare enum CombinationModifierKeys {
  /** This is the `Alt` key, which is the `Option` or `⌥` key on Mac keyboards. */
  Alt = 'Alt',
  /** This is the `Ctrl` key, which is the `Control` or `⌃` key on Mac keyboards. */
  Control = 'Control',
  /** This is the `Windows` or `⊞` key, which is the `Command` or `⌘` key on Mac keyboards. */
  Meta = 'Meta',
  Shift = 'Shift'
}

/**
 * Modifiers are special keys which are used to generate special characters or cause special actions when used in combination with other keys.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#whitespace_keys
 */
declare enum ModifierKeys {
  /** This is the `Alt` key, which is the `Option` or `⌥` key on Mac keyboards. */
  Alt = 'Alt',
  AltGraph = 'AltGraph',
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
  /** This is the `Enter` key, which is the `Return` key on Mac keyboards. */
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
  /** The Mac generates the "Delete" value when `Fn` key is pressed in tandem with `Delete` key. */
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
  /** `=`*/
  Colon = '=',
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

declare const VirtualKeys: {
  Mod: CombinationModifierKeys.Meta | CombinationModifierKeys.Control
}

declare enum KeyboardEventType {
  KeyDown = 'keydown',
  KeyUp = 'keyup'
}

export {
  KuaioConfig,
  KuaioLayoutHandlers,
  EditingKeys,
  FunctionKeys,
  KeyboardEventType,
  CombinationModifierKeys,
  ModifierKeys,
  NavigationKeys,
  WhitespaceKeys,
  GeneralKeys,
  VirtualKeys
}

export default Kuaio
