import { VirtualKeys } from '../constants/index'
import {
  WhitespaceKeys,
  EditingKeys,
  FunctionKeys,
  NavigationKeys,
  KeyboardEventType,
  CombinationModifierKeys,
  CombinationModifierKeyAlias,
  UIKeys,
  GeneralKeys
} from '../enums'
import { KuaioCombination, KuaioSequence } from './sequence'
import { createNativeEventListeners, KuaioCallback } from './listener'
import {
  registryLayout,
  unregistryLayout,
  KuaioLayout
} from './layout/index'
import { isCombinationModifierKey } from '../utils/index'
import { stringDefinitionParser } from './parser/index'
import { KuaioConfig, setDefaultConfig } from './config/index'
import { dispatchSequence } from './dispatcher'

class Kuaio {
  target: EventTarget
  config: Partial<KuaioConfig>
  _eventType: string
  _curSequence: KuaioSequence | null
  _sequenceList: KuaioSequence[]
  _curSequenceItem: KuaioCombination | null
  _listeners: EventListener[] | undefined

  constructor(target: EventTarget, config: Partial<KuaioConfig>) {
    if (!target || !(target instanceof EventTarget)) {
      throw new Error(
        'Parameter [target] cannot be empty or not an instance of EventTarget.'
      )
    }
    this.target = target
    if (
      typeof config !== 'object' ||
      config === null ||
      Array.isArray(config)
    ) {
      throw new Error(
        'Parameter [config] cannot be empty and must be a plain object'
      )
    }
    this.config = config
    this._eventType = KeyboardEventType.KeyDown
    this._curSequence = null
    this._sequenceList = []
    this._curSequenceItem = null
  }
  static create(
    ...args:
      | []
      | [EventTarget]
      | [Partial<KuaioConfig>]
      | [EventTarget, Partial<KuaioConfig>]
  ): Kuaio {
    const global = document || window
    if (args.length === 0) {
      return new Kuaio(global, {})
    } else if (args.length === 1) {
      if (args[0] instanceof EventTarget) {
        return new Kuaio(args[0], {})
      } else {
        return new Kuaio(global, args[0] as Partial<KuaioConfig>)
      }
    } else {
      return new Kuaio(args[0] as EventTarget, args[1] as Partial<KuaioConfig>)
    }
  }
  static on(
    str: string | string[],
    callback: KuaioCallback,
    config: Partial<KuaioConfig> = {}
  ): EventListener[] {
    let strArr = str
    if (!Array.isArray(str)) {
      strArr = [str]
    }
    const result = Kuaio.create(config)
    ;(strArr as string[]).forEach((item) => {
      result._sequenceList.push(stringDefinitionParser(item))
    })
    return result.on(callback)
  }
  static setGlobalConfig = setDefaultConfig
  static registryLayout = registryLayout
  static unregistryLayout = unregistryLayout
  _pushSequenceItem(sequenceItem: KuaioCombination): void {
    this._getCurSequence().push(sequenceItem)
  }
  _getCurSequenceItem(): KuaioCombination {
    if (!this._curSequenceItem) {
      this._curSequenceItem = new KuaioCombination()
    }
    return this._curSequenceItem
  }
  _pushCurSequenceItem(timeout?: number): void {
    if (this._curSequenceItem) {
      this._curSequenceItem.timeout = timeout
      this._pushSequenceItem(this._curSequenceItem)
      this._curSequenceItem = null
    }
  }
  _pushSequence(sequence: KuaioSequence): void {
    this._sequenceList.push(sequence)
  }
  _getCurSequence(): KuaioSequence {
    if (!this._curSequence) {
      this._curSequence = new KuaioSequence()
    }
    return this._curSequence
  }
  _pushCurSequence(): void {
    this._pushCurSequenceItem()
    if (this._curSequence) {
      this._pushSequence(this._curSequence)
      this._curSequence = null
    }
  }
  /**
   * Use the `keydown` event.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
   */
  keydown(): this {
    this._eventType = KeyboardEventType.KeyDown
    return this
  }
  /**
   * Use the `keyup` event.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
   */
  keyup(): this {
    this._eventType = KeyboardEventType.KeyUp
    return this
  }
  /**
   * Add a key to the modifier list.
   */
  modifier(key: string): this {
    if (!isCombinationModifierKey(key)) {
      throw new Error(
        'Parameter [key] is not a modifier key that can be used in combination.'
      )
    }
    this._getCurSequenceItem().modifiers.push(key)
    return this
  }
  /**
   * Set a key as trigger key.
   */
  key(key: string): this {
    this._getCurSequenceItem().key = key
    return this
  }
  /**
   * Prevent the browser's default behavior when the sequence executes to the current combination.
   */
  preventDefault(): this {
    this._getCurSequenceItem().preventDefault = true
    return this
  }
  /**
   * Prevent the event from propagating further when the sequence executes to the current combination.alue
   */
  stopPropagation(): this {
    this._getCurSequenceItem().stopPropagation = true
    return this
  }
  /**
   * Prevent other event listeners on the event target listening to the same event from being called when the sequence executes to the current composition.
   */
  stopImmediatePropagation(): this {
    this._getCurSequenceItem().stopImmediatePropagation = true
    return this
  }
  /**
   * Create the next combination in the sequence.
   * @param timeout The timeout of the current combination in the sequence, which is the time to wait for the next combination in the sequence to be pressed.
   */
  after(timeout?: number): this {
    this._pushCurSequenceItem(timeout)
    return this
  }
  /**
   * Create a new sequence, usually used to bind multiple sequences to the same callback.
   */
  or(): this {
    this._pushCurSequence()
    return this
  }
  /**
   * Bind the callback to sequences.
   */
  on(callback: KuaioCallback): EventListener[] {
    if (typeof callback !== 'function') {
      throw new Error('Parameter [callback] must be a function.')
    }
    this._pushCurSequence()
    this._listeners = createNativeEventListeners(
      {
        target: this.target,
        config: this.config,
        eventType: this._eventType,
        sequenceList: this._sequenceList
      },
      callback
    )
    return this._listeners
  }
  /**
   * Unbind the callback and unbind all native event handlers.
   */
  off(): void {
    if (this._listeners && this._listeners.length > 0) {
      this._listeners.forEach((listener) => {
        this.target.removeEventListener(this._eventType, listener)
      })
    }
  }
  /**
   * Dispatch a sequence from the sequence list based on a picker function.
   * This will generate keyboard events and dispatch them to the target element.
   */
  async dispatchAny(
    picker: (sequence: KuaioSequence, index: number) => boolean
  ): Promise<void> {
    this._pushCurSequence()
    if (this._sequenceList.length === 0) {
      throw new Error('No sequence to dispatch.')
    }
    if (typeof picker !== 'function') {
      throw new Error('Parameter [picker] must be a function.')
    }
    for (let i = 0; i < this._sequenceList.length; i++) {
      const sequence = this._sequenceList[i]
      if (picker(sequence, i)) {
        await dispatchSequence({
          target: this.target,
          sequence
        })
      }
    }
  }
  /**
   * Dispatch the first sequence in the sequence list.
   * This will generate keyboard events and dispatch them to the target element.
   */
  async dispatchFirst(): Promise<void> {
    await this.dispatchAny((sequence, i) => i === 0)
  }

  // #region Modifier methods
  /**
   * Add `Alt` key to modifier list, which is the `Option` or `⌥` key on Mac keyboards.
   */
  Alt(): this {
    return this.modifier(CombinationModifierKeys.Alt)
  }
  /**
   * Add `Ctrl` key to modifier list, which is the `Control` or `⌃` key on Mac keyboards.
   */
  Control(): this {
    return this.modifier(CombinationModifierKeys.Control)
  }
  /**
   * Add `Meta` key to modifier list, which is the `Windows` or `⊞` key on Windows keyboards, or the `Command` or `⌘` key on Mac keyboards.
   */
  Meta(): this {
    return this.modifier(CombinationModifierKeys.Meta)
  }
  /**
   * Add `Shift` key to modifier list.
   */
  Shift(): this {
    return this.modifier(CombinationModifierKeys.Shift)
  }
  // #endregion

  // #region Modifier aliases
  /**
   * Alias for method `Control`.
   */
  Ctrl(): this {
    return this.modifier(CombinationModifierKeyAlias.Ctrl)
  }
  /**
   * Alias for method `Alt`.
   */
  Option(): this {
    return this.modifier(CombinationModifierKeyAlias.Option)
  }
  /**
   * Alias for method `Meta`.
   */
  Command(): this {
    return this.modifier(CombinationModifierKeyAlias.Command)
  }
  /**
   * Alias for method `Meta`.
   */
  Windows(): this {
    return this.modifier(CombinationModifierKeyAlias.Windows)
  }
  // #endregion

  // #region Virtual keys
  /**
   * This is a virtual key, inspired by Mousetrap. \
   * It will be mapped to the `Command` key on Mac, and the `Ctrl` key on other operating systems.
   */
  Mod(): this {
    return this.modifier(VirtualKeys.Mod)
  }
  // #endregion

  // #region Whitespace keys
  /**
   * Set `Enter` as trigger key.
   */
  Enter(): this {
    return this.key(WhitespaceKeys.Enter)
  }
  /**
   * Set `Tab` as trigger key.
   */
  Tab(): this {
    return this.key(WhitespaceKeys.Tab)
  }
  /**
   * Set `Space` as trigger key.
   */
  Space(): this {
    return this.key(WhitespaceKeys.Space)
  }
  // #endregion

  // #region Navigation keys
  /**
   * Set `ArrowDown` as trigger key.
   */
  ArrowDown(): this {
    return this.key(NavigationKeys.ArrowDown)
  }
  /**
   * Set `ArrowLeft` as trigger key.
   */
  ArrowLeft(): this {
    return this.key(NavigationKeys.ArrowLeft)
  }
  /**
   * Set `ArrowRight` as trigger key.
   */
  ArrowRight(): this {
    return this.key(NavigationKeys.ArrowRight)
  }
  /**
   * Set `ArrowUp` as trigger key.
   */
  ArrowUp(): this {
    return this.key(NavigationKeys.ArrowUp)
  }
  /**
   * Set `End` as trigger key.
   */
  End(): this {
    return this.key(NavigationKeys.End)
  }
  /**
   * Set `Home` as trigger key.
   */
  Home(): this {
    return this.key(NavigationKeys.Home)
  }
  /**
   * Set `PageDown` as trigger key.
   */
  PageDown(): this {
    return this.key(NavigationKeys.PageDown)
  }
  /**
   * Set `PageUp` as trigger key.
   */
  PageUp(): this {
    return this.key(NavigationKeys.PageUp)
  }
  // #endregion

  // #region Editing keys
  /**
   * Set `Backspace` as trigger key, which is the `Delete` key on Mac keyboards.
   */
  Backspace(): this {
    return this.key(EditingKeys.Backspace)
  }
  /**
   * Set `Delete` as trigger key. The Mac generates the "Delete" value when `Fn` key is pressed in tandem with `Delete` key.
   */
  Delete(): this {
    return this.key(EditingKeys.Delete)
  }
  /**
   * Set `Insert` as trigger key.
   */
  Insert(): this {
    return this.key(EditingKeys.Insert)
  }
  // #endregion

  // #region UI keys
  /**
   * Set `ContextMenu` as trigger key.
   */
  ContextMenu(): this {
    return this.key(UIKeys.ContextMenu)
  }
  /**
   * Set `Escape` as trigger key.
   */
  Escape(): this {
    return this.key(UIKeys.Escape)
  }
  /**
   * Set `Pause` as trigger key.
   */
  Pause(): this {
    return this.key(UIKeys.Pause)
  }
  // #endregion

  // #region Function keys
  /**
   * Set `F1` as trigger key.
   */
  F1(): this {
    return this.key(FunctionKeys.F1)
  }
  /**
   * Set `F2` as trigger key.
   */
  F2(): this {
    return this.key(FunctionKeys.F2)
  }
  /**
   * Set `F3` as trigger key.
   */
  F3(): this {
    return this.key(FunctionKeys.F3)
  }
  /**
   * Set `F4` as trigger key.
   */
  F4(): this {
    return this.key(FunctionKeys.F4)
  }
  /**
   * Set `F5` as trigger key.
   */
  F5(): this {
    return this.key(FunctionKeys.F5)
  }
  /**
   * Set `F6` as trigger key.
   */
  F6(): this {
    return this.key(FunctionKeys.F6)
  }
  /**
   * Set `F7` as trigger key.
   */
  F7(): this {
    return this.key(FunctionKeys.F7)
  }
  /**
   * Set `F8` as trigger key.
   */
  F8(): this {
    return this.key(FunctionKeys.F8)
  }
  /**
   * Set `F9` as trigger key.
   */
  F9(): this {
    return this.key(FunctionKeys.F9)
  }
  /**
   * Set `F10` as trigger key.
   */
  F10(): this {
    return this.key(FunctionKeys.F10)
  }
  /**
   * Set `F12` as trigger key.
   */
  F12(): this {
    return this.key(FunctionKeys.F12)
  }
  /**
   * Set `F13` as trigger key.
   */
  F13(): this {
    return this.key(FunctionKeys.F13)
  }
  /**
   * Set `F14` as trigger key.
   */
  F14(): this {
    return this.key(FunctionKeys.F14)
  }
  /**
   * Set `F15` as trigger key.
   */
  F15(): this {
    return this.key(FunctionKeys.F15)
  }
  /**
   * Set `F16` as trigger key.
   */
  F16(): this {
    return this.key(FunctionKeys.F16)
  }
  /**
   * Set `F17` as trigger key.
   */
  F17(): this {
    return this.key(FunctionKeys.F17)
  }
  /**
   * Set `F18` as trigger key.
   */
  F18(): this {
    return this.key(FunctionKeys.F18)
  }
  /**
   * Set `F19` as trigger key.
   */
  F19(): this {
    return this.key(FunctionKeys.F19)
  }
  /**
   * Set `F20` as trigger key.
   */
  F20(): this {
    return this.key(FunctionKeys.F20)
  }
  // #endregion

  // #region General keys (A-Z)
  /**
   * Set `a` as trigger key.
   * @param upperCase `A`
   */
  A(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.A.toUpperCase() : GeneralKeys.A)
  }
  /**
   * Set `b` as trigger key.
   * @param upperCase `B`
   */
  B(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.B.toUpperCase() : GeneralKeys.B)
  }
  /**
   * Set `c` as trigger key.
   * @param upperCase `C`
   */
  C(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.C.toUpperCase() : GeneralKeys.C)
  }
  /**
   * Set `d` as trigger key.
   * @param upperCase `D`
   */
  D(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.D.toUpperCase() : GeneralKeys.D)
  }
  /**
   * Set `e` as trigger key.
   * @param upperCase `E`
   */
  E(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.E.toUpperCase() : GeneralKeys.E)
  }
  /**
   * Set `f` as trigger key.
   * @param upperCase `F`
   */
  F(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.F.toUpperCase() : GeneralKeys.F)
  }
  /**
   * Set `g` as trigger key.
   * @param upperCase `G`
   */
  G(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.G.toUpperCase() : GeneralKeys.G)
  }
  /**
   * Set `h` as trigger key.
   * @param upperCase `H`
   */
  H(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.H.toUpperCase() : GeneralKeys.H)
  }
  /**
   * Set `i` as trigger key.
   * @param upperCase `I`
   */
  I(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.I.toUpperCase() : GeneralKeys.I)
  }
  /**
   * Set `j` as trigger key.
   * @param upperCase `J`
   */
  J(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.J.toUpperCase() : GeneralKeys.J)
  }
  /**
   * Set `k` as trigger key.
   * @param upperCase `K`
   */
  K(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.K.toUpperCase() : GeneralKeys.K)
  }
  /**
   * Set `l` as trigger key.
   * @param upperCase `L`
   */
  L(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.L.toUpperCase() : GeneralKeys.L)
  }
  /**
   * Set `m` as trigger key.
   * @param upperCase `M`
   */
  M(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.M.toUpperCase() : GeneralKeys.M)
  }
  /**
   * Set `n` as trigger key.
   * @param upperCase `N`
   */
  N(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.N.toUpperCase() : GeneralKeys.N)
  }
  /**
   * Set `o` as trigger key.
   * @param upperCase `O`
   */
  O(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.O.toUpperCase() : GeneralKeys.O)
  }
  /**
   * Set `p` as trigger key.
   * @param upperCase `P`
   */
  P(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.P.toUpperCase() : GeneralKeys.P)
  }
  /**
   * Set `q` as trigger key.
   * @param upperCase `Q`
   */
  Q(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.Q.toUpperCase() : GeneralKeys.Q)
  }
  /**
   * Set `r` as trigger key.
   * @param upperCase `R`
   */
  R(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.R.toUpperCase() : GeneralKeys.R)
  }
  /**
   * Set `s` as trigger key.
   * @param upperCase `S`
   */
  S(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.S.toUpperCase() : GeneralKeys.S)
  }
  /**
   * Set `t` as trigger key.
   * @param upperCase `T`
   */
  T(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.T.toUpperCase() : GeneralKeys.T)
  }
  /**
   * Set `u` as trigger key.
   * @param upperCase `U`
   */
  U(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.U.toUpperCase() : GeneralKeys.U)
  }
  /**
   * Set `v` as trigger key.
   * @param upperCase `V`
   */
  V(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.V.toUpperCase() : GeneralKeys.V)
  }
  /**
   * Set `w` as trigger key.
   * @param upperCase `W`
   */
  W(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.W.toUpperCase() : GeneralKeys.W)
  }
  /**
   * Set `x` as trigger key.
   * @param upperCase `X`
   */
  X(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.X.toUpperCase() : GeneralKeys.X)
  }
  /**
   * Set `y` as trigger key.
   * @param upperCase `Y`
   */
  Y(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.Y.toUpperCase() : GeneralKeys.Y)
  }
  /**
   * Set `z` as trigger key.
   * @param upperCase `Z`
   */
  Z(upperCase = false): this {
    return this.key(upperCase ? GeneralKeys.Z.toUpperCase() : GeneralKeys.Z)
  }
  // #endregion

  // #region Digit keys
  /**
   * Set `0` as trigger key.
   */
  Digit0(): this {
    return this.key(GeneralKeys.Digit0)
  }
  /**
   * Set `1` as trigger key.
   */
  Digit1(): this {
    return this.key(GeneralKeys.Digit1)
  }
  /**
   * Set `2` as trigger key.
   */
  Digit2(): this {
    return this.key(GeneralKeys.Digit2)
  }
  /**
   * Set `3` as trigger key.
   */
  Digit3(): this {
    return this.key(GeneralKeys.Digit3)
  }
  /**
   * Set `4` as trigger key.
   */
  Digit4(): this {
    return this.key(GeneralKeys.Digit4)
  }
  /**
   * Set `5` as trigger key.
   */
  Digit5(): this {
    return this.key(GeneralKeys.Digit5)
  }
  /**
   * Set `6` as trigger key.
   */
  Digit6(): this {
    return this.key(GeneralKeys.Digit6)
  }
  /**
   * Set `7` as trigger key.
   */
  Digit7(): this {
    return this.key(GeneralKeys.Digit7)
  }
  /**
   * Set `8` as trigger key.
   */
  Digit8(): this {
    return this.key(GeneralKeys.Digit8)
  }
  /**
   * Set `9` as trigger key.
   */
  Digit9(): this {
    return this.key(GeneralKeys.Digit9)
  }
  // #endregion

  // #region Symbol keys
  /**
   * Set `!` as trigger key.
   */
  ExclamationMark(): this {
    return this.key(GeneralKeys.ExclamationMark)
  }
  /**
   * Set `@` as trigger key.
   */
  At(): this {
    return this.key(GeneralKeys.At)
  }
  /**
   * Set `#` as trigger key.
   */
  Number(): this {
    return this.key(GeneralKeys.Number)
  }
  /**
   * Set `$` as trigger key.
   */
  Dollar(): this {
    return this.key(GeneralKeys.Dollar)
  }
  /**
   * Set `%` as trigger key.
   */
  Percent(): this {
    return this.key(GeneralKeys.Percent)
  }
  /**
   * Set `^` as trigger key.
   */
  Caret(): this {
    return this.key(GeneralKeys.Caret)
  }
  /**
   * Set `&` as trigger key.
   */
  Ampersand(): this {
    return this.key(GeneralKeys.Ampersand)
  }
  /**
   * Set `*` as trigger key.
   */
  Asterisk(): this {
    return this.key(GeneralKeys.Asterisk)
  }
  /**
   * Set `(` as trigger key.
   */
  ParenthesisLeft(): this {
    return this.key(GeneralKeys.ParenthesisLeft)
  }
  /**
   * Set `)` as trigger key.
   */
  ParenthesisRight(): this {
    return this.key(GeneralKeys.ParenthesisRight)
  }
  /**
   * Set `-` as trigger key.
   */
  Minus(): this {
    return this.key(GeneralKeys.Minus)
  }
  /**
   * Set `_` as trigger key.
   */
  Underscore(): this {
    return this.key(GeneralKeys.Underscore)
  }
  /**
   * Set `=` as trigger key.
   */
  Equal(): this {
    return this.key(GeneralKeys.Equal)
  }
  /**
   * Set `+` as trigger key.
   */
  Plus(): this {
    return this.key(GeneralKeys.Plus)
  }
  /**
   * Set `` ` `` as trigger key.
   */
  Backquote(): this {
    return this.key(GeneralKeys.Backquote)
  }
  /**
   * Set `~` as trigger key.
   */
  Tilde(): this {
    return this.key(GeneralKeys.Tilde)
  }
  /**
   * Set `[` as trigger key.
   */
  BracketLeft(): this {
    return this.key(GeneralKeys.BracketLeft)
  }
  /**
   * Set `]` as trigger key.
   */
  BracketRight(): this {
    return this.key(GeneralKeys.BracketRight)
  }
  /**
   * Set `{` as trigger key.
   */
  CurlyBracketLeft(): this {
    return this.key(GeneralKeys.CurlyBracketLeft)
  }
  /**
   * Set `}` as trigger key.
   */
  CurlyBracketRight(): this {
    return this.key(GeneralKeys.CurlyBracketRight)
  }
  /**
   * Set `\` as trigger key.
   */
  Backslash(): this {
    return this.key(GeneralKeys.Backslash)
  }
  /**
   * Set `|` as trigger key.
   */
  VerticalLine(): this {
    return this.key(GeneralKeys.VerticalLine)
  }
  /**
   * Set `;` as trigger key.
   */
  Semicolon(): this {
    return this.key(GeneralKeys.Semicolon)
  }
  /**
   * Set `:` as trigger key.
   */
  Colon(): this {
    return this.key(GeneralKeys.Colon)
  }
  /**
   * Set `'` as trigger key.
   */
  Quote(): this {
    return this.key(GeneralKeys.Quote)
  }
  /**
   * Set `"` as trigger key.
   */
  DoubleQuotes(): this {
    return this.key(GeneralKeys.DoubleQuotes)
  }
  /**
   * Set `,` as trigger key.
   */
  Comma(): this {
    return this.key(GeneralKeys.Comma)
  }
  /**
   * Set `<` as trigger key.
   */
  LessThan(): this {
    return this.key(GeneralKeys.LessThan)
  }
  /**
   * Set `.` as trigger key.
   */
  Period(): this {
    return this.key(GeneralKeys.Period)
  }
  /**
   * Set `>` as trigger key.
   */
  GreaterThan(): this {
    return this.key(GeneralKeys.GreaterThan)
  }
  /**
   * Set `/` as trigger key.
   */
  Slash(): this {
    return this.key(GeneralKeys.Slash)
  }
  /**
   * Set `?` as trigger key.
   */
  QuestionMark(): this {
    return this.key(GeneralKeys.QuestionMark)
  }
  // #endregion

  // #region Aliases
  /**
   * Alias for method `Escape`.
   */
  Esc(): this {
    return this.key(UIKeys.Escape)
  }
  /**
   * Alias for method `Enter`.
   */
  Return(): this {
    return this.key(WhitespaceKeys.Enter)
  }
  /**
   * Alias for method `Backspace`.
   */
  MacDelete(): this {
    return this.key(EditingKeys.Backspace)
  }
  // #endregion
}

export default Kuaio
export type { KuaioConfig, KuaioLayout, KuaioCallback }
