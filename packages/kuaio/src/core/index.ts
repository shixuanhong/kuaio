import { VirtualKeys } from '../constants/index'
import {
  KeyboardEventType,
  KeyboardCodes,
  ModifierKeys,
  CombinationModifierKeyAlias,
  CombinationModifierCodes,
  CombinationModifierKeys
} from '../enums'
import { KuaioKey, KuaioKeyInit } from './key'
import { KuaioCombination, KuaioSequence } from './sequence'
import { createNativeEventListeners, KuaioCallback } from './listener'
import {
  registryLayout,
  unregistryLayout,
  KuaioLayout,
  getCurrentLayout
} from './layout/index'
import { stringDefinitionParser } from './parser/index'
import { KuaioConfig, setGlobalConfig, getGlobalConfig } from './config/index'
import { dispatchSequence } from './dispatcher'
import { isCombinationModifierKey, normalizeToKuaioKey } from '../utils/index'
import qwerty from './layout/presets/qwerty/index'

class Kuaio {
  // #region Static fields and methods
  static _defaultLayout: KuaioLayout = qwerty
  static setGlobalConfig = setGlobalConfig
  static getGlobalConfig = getGlobalConfig
  static registryLayout = registryLayout
  static unregistryLayout = unregistryLayout
  /**
   * Set the default keyboard layout used by all new Kuaio instances.
   */
  static setDefaultLayout(layout: KuaioLayout): void {
    Kuaio._defaultLayout = layout
  }
  /**
   * Create a Kuaio instance asynchronously. \
   * The layout is automatically detected from the user's environment.
   */
  static async create(
    ...args:
      | []
      | [EventTarget]
      | [Partial<KuaioConfig>]
      | [EventTarget, Partial<KuaioConfig>]
  ): Promise<Kuaio> {
    const layout = await getCurrentLayout()
    const { target, config } = Kuaio._resolveCreateArgs(args)
    return new Kuaio(target, config, layout)
  }
  /**
   * Create a Kuaio instance synchronously. \
   * Uses the provided layout, or falls back to the default layout set via `setDefaultLayout`.
   */
  static createSync(
    ...args:
      | []
      | [EventTarget]
      | [Partial<KuaioConfig>]
      | [EventTarget, Partial<KuaioConfig>]
      | [EventTarget, Partial<KuaioConfig>, KuaioLayout | undefined]
  ): Kuaio {
    const { target, config, resolvedLayout } = Kuaio._resolveCreateArgs(args)
    return new Kuaio(target, config, resolvedLayout)
  }

  private static _resolveCreateArgs(
    args:
      | []
      | [EventTarget]
      | [Partial<KuaioConfig>]
      | [EventTarget, Partial<KuaioConfig>]
      | [EventTarget, Partial<KuaioConfig>, KuaioLayout | undefined]
  ): {
    target: EventTarget
    config: Partial<KuaioConfig>
    resolvedLayout?: KuaioLayout
  } {
    const global = document || window
    if (args.length === 0) {
      return { target: global, config: {} }
    }
    if (args.length === 1) {
      const [first] = args
      if (first instanceof EventTarget) {
        return { target: first, config: {} }
      }
      return {
        target: global,
        config: first as Partial<KuaioConfig>
      }
    }
    if (args.length === 2) {
      const [target, config] = args as [EventTarget, Partial<KuaioConfig>]
      return { target, config }
    }
    const [target, config, layout] = args as [
      EventTarget,
      Partial<KuaioConfig>,
      KuaioLayout | undefined
    ]
    return { target, config, resolvedLayout: layout }
  }
  // #endregion

  // #region Instance fields
  target: EventTarget
  config: Partial<KuaioConfig>
  _layout: KuaioLayout
  _eventType: string
  _curSequence: KuaioSequence | null
  _sequenceList: KuaioSequence[]
  _curSequenceItem: KuaioCombination | null
  _listeners: EventListener[] | undefined
  // #endregion

  constructor(
    target: EventTarget,
    config: Partial<KuaioConfig>,
    layout?: KuaioLayout
  ) {
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
    this._layout = layout ?? Kuaio._defaultLayout
    this._eventType = KeyboardEventType.KeyDown
    this._curSequence = null
    this._sequenceList = []
    this._curSequenceItem = null
  }
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
   * Add a modifier key.
   */
  modifier(input: string | KuaioKeyInit | KuaioKey): this {
    const modifier = normalizeToKuaioKey(input, this._layout)
    if (
      modifier.matchMode === 'code' ||
      (modifier.key && !isCombinationModifierKey(modifier.key))
    ) {
      throw new Error(
        `Invalid modifier key: "${modifier.key}". Modifier keys must be one of: ${Object.values(CombinationModifierKeys).join(', ')}.`
      )
    }
    modifier.isModifier = true
    this._getCurSequenceItem().modifiers.push(modifier)
    return this
  }
  /**
   * Set the trigger key.
   */
  key(input: string | KuaioKeyInit | KuaioKey): this {
    this._getCurSequenceItem().key = normalizeToKuaioKey(input, this._layout)
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
   * Define one or more key sequences from string definitions. \
   * Multiple strings will be treated as alternative sequences (like chaining `.or()`).
   * @example
   * Kuaio.createSync(document).define('Control+A').on(callback)
   * Kuaio.createSync(document).define('Control+A', 'Meta+A').on(callback)
   */
  define(...strs: string[]): this {
    this._pushCurSequence()
    strs.forEach((str) => {
      this._sequenceList.push(stringDefinitionParser(str, this._layout))
    })
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

  // #region Combination Modifier methods
  /**
   * Add `Alt` key to modifier list, which is the `Option(⌥)` key on Mac keyboards.
   * Matches both `AltLeft` and `AltRight`.
   */
  Alt(): this {
    return this.modifier({
      key: ModifierKeys.Alt,
      matchMode: 'key'
    })
  }
  /**
   * Add `Control` key to modifier list, which is the `⌃` key on Mac keyboards.
   * Matches both `ControlLeft` and `ControlRight`.
   */
  Control(): this {
    return this.modifier({
      key: ModifierKeys.Control,
      matchMode: 'key'
    })
  }
  /**
   * Add `Meta` key to modifier list, which is the `Windows(⊞)` key on Windows keyboards, or the `Command(⌘)` key on Mac keyboards.
   * Matches both `MetaLeft` and `MetaRight`.
   */
  Meta(): this {
    return this.modifier({
      key: ModifierKeys.Meta,
      matchMode: 'key'
    })
  }
  /**
   * Add `Shift` key to modifier list.
   * Matches both `ShiftLeft` and `ShiftRight`.
   */
  Shift(): this {
    return this.modifier({
      key: ModifierKeys.Shift,
      matchMode: 'key'
    })
  }
  // #endregion

  // #region Virtual keys
  /**
   * This is a virtual key, inspired by Mousetrap. \
   * It will be mapped to the `Command(⌘)` key on Mac, and the `Control` key on other operating systems.
   */
  Mod(): this {
    return this.key(VirtualKeys.Mod)
  }
  // #endregion
}

function registerLogicKeyMethods(): void {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  for (const letter of letters) {
    Object.defineProperty(Kuaio.prototype, letter, {
      value(this: Kuaio) {
        return this.key(letter)
      }
    })
  }
}

function registerKeyboardCodeMethods(): void {
  for (const key of Object.keys(KeyboardCodes)) {
    if (key in CombinationModifierCodes) {
      continue
    } else {
      Object.defineProperty(Kuaio.prototype, key, {
        value(this: Kuaio) {
          return this.key({
            code: key,
            matchMode: 'code'
          })
        }
      })
    }
  }
}

function registerCombinationModifierKeyAliasMethods(): void {
  for (const entry of Object.entries(CombinationModifierKeyAlias)) {
    const [key, value] = entry
    Object.defineProperty(Kuaio.prototype, key, {
      value: Kuaio.prototype[value]
    })
  }
}

registerLogicKeyMethods()
registerKeyboardCodeMethods()
registerCombinationModifierKeyAliasMethods()

interface Kuaio {
  // #region Logic keys
  A(): this
  B(): this
  C(): this
  D(): this
  E(): this
  F(): this
  G(): this
  H(): this
  I(): this
  J(): this
  K(): this
  L(): this
  M(): this
  N(): this
  O(): this
  P(): this
  Q(): this
  R(): this
  S(): this
  T(): this
  U(): this
  V(): this
  W(): this
  X(): this
  Y(): this
  Z(): this
  // #endregion
  // #region Keyboard codes
  KeyA(): this
  KeyB(): this
  KeyC(): this
  KeyD(): this
  KeyE(): this
  KeyF(): this
  KeyG(): this
  KeyH(): this
  KeyI(): this
  KeyJ(): this
  KeyK(): this
  KeyL(): this
  KeyM(): this
  KeyN(): this
  KeyO(): this
  KeyP(): this
  KeyQ(): this
  KeyR(): this
  KeyS(): this
  KeyT(): this
  KeyU(): this
  KeyV(): this
  KeyW(): this
  KeyX(): this
  KeyY(): this
  KeyZ(): this
  Digit0(): this
  Digit1(): this
  Digit2(): this
  Digit3(): this
  Digit4(): this
  Digit5(): this
  Digit6(): this
  Digit7(): this
  Digit8(): this
  Digit9(): this
  Numpad0(): this
  Numpad1(): this
  Numpad2(): this
  Numpad3(): this
  Numpad4(): this
  Numpad5(): this
  Numpad6(): this
  Numpad7(): this
  Numpad8(): this
  Numpad9(): this
  NumpadAdd(): this
  NumpadSubtract(): this
  NumpadMultiply(): this
  NumpadDivide(): this
  NumpadDecimal(): this
  NumpadEnter(): this
  NumpadEqual(): this
  NumLock(): this
  F1(): this
  F2(): this
  F3(): this
  F4(): this
  F5(): this
  F6(): this
  F7(): this
  F8(): this
  F9(): this
  F10(): this
  F11(): this
  F12(): this
  Escape(): this
  Backquote(): this
  Minus(): this
  Equal(): this
  Backspace(): this
  Tab(): this
  BracketLeft(): this
  BracketRight(): this
  Backslash(): this
  CapsLock(): this
  Semicolon(): this
  Quote(): this
  Enter(): this
  Comma(): this
  Period(): this
  Slash(): this
  Space(): this
  ContextMenu(): this
  Insert(): this
  Delete(): this
  Home(): this
  End(): this
  PageUp(): this
  PageDown(): this
  ArrowUp(): this
  ArrowDown(): this
  ArrowLeft(): this
  ArrowRight(): this
  PrintScreen(): this
  ScrollLock(): this
  Pause(): this
  // #endregion
  /**
   * Alias for {@link Kuaio.Control}
   */
  Ctrl(): this
  /**
   * Alias for {@link Kuaio.Alt}
   */
  Option(): this
  /**
   * Alias for {@link Kuaio.Meta}.
   */
  Command(): this
  /**
   * Alias for {@link Kuaio.Meta}.
   */
  Windows(): this
}

Kuaio.registryLayout(qwerty)

export default Kuaio
export type { KuaioConfig, KuaioLayout, KuaioCallback }
