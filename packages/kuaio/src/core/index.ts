import { VirtualKeys } from '../constants/index'
import {
  KeyboardEventType,
  KeyboardCodes,
  ModifierKeys,
  CombinationModifierKeyAlias,
  CombinationModifierCodes,
  CombinationModifierKeys
} from '../enums'
import { KuaioKey, KuaioKeyInit, KuaioCombination, KuaioSequence } from './classes'
import { createNativeEventListeners, KuaioCallback } from './listener'
import {
  registerLayout,
  unregisterLayout,
  KuaioLayout,
  getCurrentLayout
} from './layout/index'
import { stringDefinitionParser } from './parser/index'
import { KuaioConfig, setGlobalConfig, getGlobalConfig } from './config/index'
import { dispatchSequence } from './dispatcher'
import { isCombinationModifierKey, normalizeToKuaioKey } from '../utils/index'
import qwerty from './layout/presets/qwerty/index'

/**
 *
 * Kuaio provides a chainable API for defining keyboard shortcuts and event listeners.
 * It supports both programmatic sequence building and string-based definitions.
 *
 * @class Kuaio
 * @example
 * ```typescript
 * // Create instance and bind shortcut
 * const kuaio = await Kuaio.create()
 * kuaio.Control().A().on((event) => {
 *   console.log('Ctrl+A pressed!')
 * })
 *
 * // String-based definition
 * Kuaio.createSync(document).define('Control+Shift+A').on(callback)
 *
 * // Dispatch events programmatically
 * await kuaio.define('Escape').dispatchFirst()
 * ```
 * @see {@link Kuaio.create} for async instance creation
 * @see {@link Kuaio.createSync} for sync instance creation
 * @see {@link Kuaio.define} for string-based sequence definition
 */
class Kuaio {
  // #region Static fields and methods
  /** Default layout used for new instances when no layout is specified */
  static _defaultLayout: KuaioLayout = qwerty
  /**
   * Update the global configuration shared across Kuaio instances
   * @param config - Configuration options to apply globally
   * @see {@link KuaioConfig} for available configuration options
   */
  static setGlobalConfig = setGlobalConfig
  /**
   * Read the global configuration shared across Kuaio instances
   * @returns Current global configuration
   * @see {@link KuaioConfig} for configuration structure
   */
  static getGlobalConfig = getGlobalConfig
  /**
   * Register a keyboard layout so it can be referenced by name
   * @param layout - The keyboard layout to register
   * @see {@link KuaioLayout} for layout structure
   * @see {@link Kuaio.unregisterLayout} to remove a layout
   * @example
   * ```typescript
   * Kuaio.registerLayout(myCustomLayout)
   * ```
   */
  static registerLayout = registerLayout
  /**
   * Remove a previously registered keyboard layout
   * @param name - The name of the layout to unregister
   * @see {@link Kuaio.registerLayout} to register a layout
   */
  static unregisterLayout = unregisterLayout
  /**
   * Set the default keyboard layout used by all new Kuaio instances.
   * @param layout - The keyboard layout to set as default
   * @see {@link Kuaio.registerLayout} to register a layout first
   * @see {@link Kuaio.create} for async layout detection
   */
  static setDefaultLayout(layout: KuaioLayout): void {
    Kuaio._defaultLayout = layout
  }
  /**
   * Create a Kuaio instance asynchronously.
   * The layout is automatically detected from the user's environment.
   * If no event target is specified, defaults to `document` or `window`.
   * @param args - Optional arguments for target and configuration
   * @returns Promise that resolves to a new Kuaio instance
   * @see {@link Kuaio.createSync} for synchronous creation
   * @see {@link Kuaio.setDefaultLayout} to set a fallback layout
   * @example
   * ```typescript
   * const kuaio = await Kuaio.create()
   * const kuaioWithTarget = await Kuaio.create(document.body)
   * const kuaioWithConfig = await Kuaio.create({ preventDefault: true })
   * const kuaioWithTargetAndConfig = await Kuaio.create(document.body, { preventDefault: true })
   * ```
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
   * Create a Kuaio instance synchronously.
   * Uses the provided layout, or falls back to the default layout set via {@link Kuaio.setDefaultLayout}.
   * If no event target is specified, defaults to `document` or `window`.
   * @param args - Optional arguments for target, configuration, and layout
   * @returns A new Kuaio instance
   * @see {@link Kuaio.create} for automatic layout detection
   * @example
   * ```typescript
   * const kuaio = Kuaio.createSync()
   * const kuaioWithTarget = Kuaio.createSync(document.body)
   * const kuaioWithConfig = Kuaio.createSync({ preventDefault: true })
   * const kuaioWithTargetAndConfig = Kuaio.createSync(document.body, { preventDefault: true })
   * const kuaioWithTargetAndConfigAndLayout = Kuaio.createSync(document.body, { preventDefault: true }, myLayout)
   * ```
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

  /**
   * Resolve creation arguments into standardized format
   * @param args - The arguments passed to create methods
   * @returns Object containing resolved target, config, and optional layout
   * @private
   */
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
  /** Event target that receives the keyboard listeners */
  target: EventTarget
  /** Instance-level configuration that overrides global defaults */
  config: Partial<KuaioConfig>
  /** Keyboard layout used for key mapping */
  _layout: KuaioLayout
  /** Event type for keyboard listening (keydown or keyup) */
  _eventType: string
  /** Currently building sequence */
  _curSequence: KuaioSequence | null
  /** List of completed sequences */
  _sequenceList: KuaioSequence[]
  /** Currently building combination within the sequence */
  _curSequenceItem: KuaioCombination | null
 /** Native event listeners added via {@link on} */
  _listeners: EventListener[] | undefined
  // #endregion

  /**
   * Create a new Kuaio instance
   * @param target - Event target that receives the keyboard listeners
   * @param config - Instance-level configuration that overrides global defaults
   * @param layout - Optional keyboard layout. Falls back to {@link Kuaio.setDefaultLayout} if omitted
   * @throws {Error} If target is not an EventTarget or config is invalid
   * @see {@link Kuaio.create} and {@link Kuaio.createSync} for factory methods
   * @example
   * ```typescript
   * // Direct constructor usage (not recommended)
   * const kuaio = new Kuaio(document, {}, myLayout)
   *
   * // Preferred factory methods
   * const kuaio = await Kuaio.create() // async with auto-detection
   * const kuaio = Kuaio.createSync() // sync with default layout
   * ```
   */
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
  /**
   * Push a combination item to the current sequence
   * @param sequenceItem - The combination to add
   * @private
   */
  _pushSequenceItem(sequenceItem: KuaioCombination): void {
    this._getCurSequence().push(sequenceItem)
  }
  /**
   * Get the current combination item, creating one if it doesn't exist
   * @returns The current combination item
   * @private
   */
  _getCurSequenceItem(): KuaioCombination {
    if (!this._curSequenceItem) {
      this._curSequenceItem = new KuaioCombination()
    }
    return this._curSequenceItem
  }
  /**
   * Push the current combination item to the sequence with optional timeout
   * @param timeout - Time to wait for next combination in milliseconds
   * @private
   */
  _pushCurSequenceItem(timeout?: number): void {
    if (this._curSequenceItem) {
      this._curSequenceItem.timeout = timeout
      this._pushSequenceItem(this._curSequenceItem)
      this._curSequenceItem = null
    }
  }
  /**
   * Add a sequence to the sequence list
   * @param sequence - The sequence to add
   * @private
   */
  _pushSequence(sequence: KuaioSequence): void {
    this._sequenceList.push(sequence)
  }
  /**
   * Get the current sequence, creating one if it doesn't exist
   * @returns The current sequence
   * @private
   */
  _getCurSequence(): KuaioSequence {
    if (!this._curSequence) {
      this._curSequence = new KuaioSequence()
    }
    return this._curSequence
  }
  /**
   * Push the current sequence to the sequence list
   * @private
   */
  _pushCurSequence(): void {
    this._pushCurSequenceItem()
    if (this._curSequence) {
      this._pushSequence(this._curSequence)
      this._curSequence = null
    }
  }
  /**
   * Use the `keydown` event for keyboard event listening
   * @returns This instance for chaining
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event|MDN keydown event documentation}
   * @see {@link keyup} to use keyup events instead
   */
  keydown(): this {
    this._eventType = KeyboardEventType.KeyDown
    return this
  }
  /**
   * Use the `keyup` event for keyboard event listening
   * @returns This instance for chaining
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event|MDN keyup event documentation}
   * @see {@link keydown} to use keydown events instead
   */
  keyup(): this {
    this._eventType = KeyboardEventType.KeyUp
    return this
  }
  /**
   * Add a modifier key to the current combination
   * @param input - string, {@link KuaioKeyInit}, or {@link KuaioKey} describing the modifier
   * @returns This instance for chaining
   * @throws {Error} If the input is not a valid modifier key
   * @see {@link Alt}, {@link Control}, {@link Meta}, {@link Shift} for shortcut methods
   * @example
   * ```typescript
   * kuaio.modifier('Control').key('A')
   * kuaio.Control().A() // equivalent shortcut
   * ```
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
   * Set the trigger key for the current combination
   * @param input - string (converted to physical code via layout's {@link KuaioLayout.keyToCodeHandler}), {@link KuaioKeyInit} object, or {@link KuaioKey} instance
   * @returns This instance for chaining
   * @example
   * ```typescript
   * kuaio.key('A')
   * kuaio.A() // equivalent shortcut for letter keys
   * kuaio.key({ code: 'Enter', matchMode: 'code' })
   * kuaio.key(new KuaioKey({ code: 'Enter', matchMode: 'code' }))
   * ```
   */
  key(input: string | KuaioKeyInit | KuaioKey): this {
    this._getCurSequenceItem().key = normalizeToKuaioKey(input, this._layout)
    return this
  }
  /**
   * Prevent the browser's default behavior when the sequence executes for the current combination
   * @returns This instance for chaining
   * @see {@link stopPropagation} to stop event propagation
   * @see {@link stopImmediatePropagation} to stop immediate propagation
   */
  preventDefault(): this {
    this._getCurSequenceItem().preventDefault = true
    return this
  }
  /**
   * Prevent the event from propagating further when the sequence executes for the current combination
   * @returns This instance for chaining
   * @see {@link preventDefault} to prevent default behavior
   * @see {@link stopImmediatePropagation} to stop immediate propagation
   */
  stopPropagation(): this {
    this._getCurSequenceItem().stopPropagation = true
    return this
  }
  /**
   * Prevent other event listeners on the event target listening to the same event from being called when the sequence executes for the current combination
   * @returns This instance for chaining
   * @see {@link preventDefault} to prevent default behavior
   * @see {@link stopPropagation} to stop event propagation
   */
  stopImmediatePropagation(): this {
    this._getCurSequenceItem().stopImmediatePropagation = true
    return this
  }
  /**
   * Create the next combination in the sequence
   * @param timeout - The timeout for the current combination in the sequence, which is the max time to wait for the next combination in the sequence to be pressed (in milliseconds)
   * @returns This instance for chaining
   * @see {@link or} to create alternative sequences
   * @example
   * ```typescript
   * kuaio.Control().A().after(1000).B() // Press Ctrl+A, then press B within 1s.
   * ```
   */
  after(timeout?: number): this {
    this._pushCurSequenceItem(timeout)
    return this
  }
  /**
   * Finalize the current sequence definition, usually used to bind multiple sequences to the same callback
   * @returns This instance for chaining
   * @example
   * ```typescript
   * kuaio.Control().A().or().Meta().A().on(callback) // Ctrl+A OR Meta+A
   * ```
   */
  or(): this {
    this._pushCurSequence()
    return this
  }
  /**
   * Define one or more key sequences from string definitions.
   * Multiple strings will be treated as alternative sequences (like chaining {@link or}).
   * @param strs - String definitions of key sequences
   * @returns This instance for chaining
   * @see {@link modifier}, {@link key} for programmatic sequence building
   * @example
   * ```typescript
   * Kuaio.createSync(document).define('Control+A').on(callback)
   * Kuaio.createSync(document).define('Ctrl+K, Ctrl+C').on(callback)
   * Kuaio.createSync(document).define('Control+A', 'Meta+A').on(callback)
   * ```
   */
  define(...strs: string[]): this {
    this._pushCurSequence()
    strs.forEach((str) => {
      this._sequenceList.push(stringDefinitionParser(str, this._layout))
    })
    return this
  }
  /**
   * Finalize the sequence definition and bind a native event listener
   * @param callback - Function to execute when the key sequence is matched
   * @returns The listener array for manual removal or inspection
   * @throws {Error} If callback is not a function
   * @see {@link off} to remove the listeners
   * @see {@link dispatchAny} to programmatically trigger sequences
   * @example
   * ```typescript
   * kuaio.Control().A().on((event) => {
   *   console.log('Ctrl+A pressed!')
   * })
   * ```
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
   * Remove the listeners added via {@link on}. Safe to call multiple times.
   * @see {@link on} to add listeners
   * @example
   * ```typescript
   * const listeners = kuaio.Control().A().on(callback)
   * // later...
   * kuaio.off() // removes all listeners
   * ```
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
   * @param picker - Receives each sequence and index. Return `true` to dispatch the sequence.
   * @returns Promise that resolves when dispatching is complete
   * @throws {Error} If no sequence is defined or picker is not a function
   * @see {@link dispatchFirst} for dispatching the first sequence
   * @example
   * ```typescript
   * await kuaio.define('Control+A').dispatchAny((seq, i) => i === 0)
   * ```
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
   * Convenience wrapper over {@link dispatchAny} that dispatches the first defined sequence
   * @returns Promise that resolves when dispatching is complete
   * @see {@link dispatchAny} for more control over which sequence to dispatch
   * @example
   * ```typescript
   * await kuaio.define('Control+A').dispatchFirst()
   * ```
   */
  async dispatchFirst(): Promise<void> {
    await this.dispatchAny((sequence, i) => i === 0)
  }

  // #region Combination Modifier methods
  /**
   * Add `Alt` key to modifier list, which is the `Option(⌥)` key on Mac keyboards.
   * @returns This instance for chaining
   * @see {@link Option} for Mac-specific alias
   * @example
   * ```typescript
   * kuaio.Alt().A() // Alt+A
   * ```
   */
  Alt(): this {
    return this.modifier({
      key: ModifierKeys.Alt,
      matchMode: 'key'
    })
  }
  /**
   * Add `Control` key to modifier list, which is the `⌃` key on Mac keyboards.
   * @returns This instance for chaining
   * @see {@link Ctrl} for alias
   * @example
   * ```typescript
   * kuaio.Control().A() // Ctrl+A
   * ```
   */
  Control(): this {
    return this.modifier({
      key: ModifierKeys.Control,
      matchMode: 'key'
    })
  }
  /**
   * Add `Meta` key to modifier list, which is the `Windows(⊞)` key on Windows keyboards, or the `Command(⌘)` key on Mac keyboards.
   * @returns This instance for chaining
   * @see {@link Command} for Mac-specific alias
   * @see {@link Windows} for Windows-specific alias
   * @example
   * ```typescript
   * kuaio.Meta().A() // Cmd+A on Mac, Win+A on Windows
   * ```
   */
  Meta(): this {
    return this.modifier({
      key: ModifierKeys.Meta,
      matchMode: 'key'
    })
  }
  /**
   * Add `Shift` key to modifier list.
   * @returns This instance for chaining
   * @example
   * ```typescript
   * kuaio.Shift().A() // Shift+A
   * ```
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
   * Virtual key inspired by Mousetrap. Expands to `Command(⌘)` on macOS and `Control` elsewhere.
   * @returns This instance for chaining
   * @see {@link Meta} for explicit Meta key usage
   * @see {@link Control} for explicit Control key usage
   * @example
   * ```typescript
   * kuaio.Mod().A() // Cmd+A on Mac, Ctrl+A on Windows/Linux
   * ```
   */
  Mod(): this {
    return this.key(VirtualKeys.Mod)
  }
  // #endregion
}

/**
 * Register logic key methods (A-Z) on Kuaio prototype
 * @private
 */
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

/**
 * Register keyboard code methods on Kuaio prototype
 * @private
 */
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

/**
 * Register combination modifier key alias methods on Kuaio prototype
 * @private
 */
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

/**
 * Kuaio interface with dynamically registered methods
 * @interface Kuaio
 */
interface Kuaio {
  // #region Logical keys
  /**
   * Set `A` logical key as the trigger key for the current combination.
   * Unlike {@link KeyA} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.A() // equivalent to kuaio.key('A')
   * ```
   */
  A(): this

  /**
   * Set `B` logical key as the trigger key for the current combination.
   * Unlike {@link KeyB} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.B() // equivalent to kuaio.key('B')
   * ```
   */
  B(): this
  /**
   * Set `C` logical key as the trigger key for the current combination.
   * Unlike {@link KeyC} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.C() // equivalent to kuaio.key('C')
   * ```
   */
  C(): this
  /**
   * Set `D` logical key as the trigger key for the current combination.
   * Unlike {@link KeyD} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.D() // equivalent to kuaio.key('D')
   * ```
   */
  D(): this
  /**
   * Set `E` logical key as the trigger key for the current combination.
   * Unlike {@link KeyE} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.E() // equivalent to kuaio.key('E')
   * ```
   */
  E(): this
  /**
   * Set `F` logical key as the trigger key for the current combination.
   * Unlike {@link KeyF} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.F() // equivalent to kuaio.key('F')
   * ```
   */
  F(): this
  /**
   * Set `G` logical key as the trigger key for the current combination.
   * Unlike {@link KeyG} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.G() // equivalent to kuaio.key('G')
   * ```
   */
  G(): this
  /**
   * Set `H` logical key as the trigger key for the current combination.
   * Unlike {@link KeyH} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.H() // equivalent to kuaio.key('H')
   * ```
   */
  H(): this
  /**
   * Set `I` logical key as the trigger key for the current combination.
   * Unlike {@link KeyI} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.I() // equivalent to kuaio.key('I')
   * ```
   */
  I(): this
  /**
   * Set `J` logical key as the trigger key for the current combination.
   * Unlike {@link KeyJ} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.J() // equivalent to kuaio.key('J')
   * ```
   */
  J(): this
  /**
   * Set `K` logical key as the trigger key for the current combination.
   * Unlike {@link KeyK} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.K() // equivalent to kuaio.key('K')
   * ```
   */
  K(): this
  /**
   * Set `L` logical key as the trigger key for the current combination.
   * Unlike {@link KeyL} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.L() // equivalent to kuaio.key('L')
   * ```
   */
  L(): this
  /**
   * Set `M` logical key as the trigger key for the current combination.
   * Unlike {@link KeyM} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.M() // equivalent to kuaio.key('M')
   * ```
   */
  M(): this
  /**
   * Set `N` logical key as the trigger key for the current combination.
   * Unlike {@link KeyN} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.N() // equivalent to kuaio.key('N')
   * ```
   */
  N(): this
  /**
   * Set `O` logical key as the trigger key for the current combination.
   * Unlike {@link KeyO} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.O() // equivalent to kuaio.key('O')
   * ```
   */
  O(): this
  /**
   * Set `P` logical key as the trigger key for the current combination.
   * Unlike {@link KeyP} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.P() // equivalent to kuaio.key('P')
   * ```
   */
  P(): this
  /**
   * Set `Q` logical key as the trigger key for the current combination.
   * Unlike {@link KeyQ} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Q() // equivalent to kuaio.key('Q')
   * ```
   */
  Q(): this
  /**
   * Set `R` logical key as the trigger key for the current combination.
   * Unlike {@link KeyR} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.R() // equivalent to kuaio.key('R')
   * ```
   */
  R(): this
  /**
   * Set `S` logical key as the trigger key for the current combination.
   * Unlike {@link KeyS} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.S() // equivalent to kuaio.key('S')
   * ```
   */
  S(): this
  /**
   * Set `T` logical key as the trigger key for the current combination.
   * Unlike {@link KeyT} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.T() // equivalent to kuaio.key('T')
   * ```
   */
  T(): this
  /**
   * Set `U` logical key as the trigger key for the current combination.
   * Unlike {@link KeyU} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.U() // equivalent to kuaio.key('U')
   * ```
   */
  U(): this
  /**
   * Set `V` logical key as the trigger key for the current combination.
   * Unlike {@link KeyV} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.V() // equivalent to kuaio.key('V')
   * ```
   */
  V(): this
  /**
   * Set `W` logical key as the trigger key for the current combination.
   * Unlike {@link KeyW} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.W() // equivalent to kuaio.key('W')
   * ```
   */
  W(): this
  /**
   * Set `X` logical key as the trigger key for the current combination.
   * Unlike {@link KeyX} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.X() // equivalent to kuaio.key('X')
   * ```
   */
  X(): this
  /**
   * Set `Y` logical key as the trigger key for the current combination.
   * Unlike {@link KeyY} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Y() // equivalent to kuaio.key('Y')
   * ```
   */
  Y(): this
  /**
   * Set `Z` logical key as the trigger key for the current combination.
   * Unlike {@link KeyZ} which uses physical code
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Z() // equivalent to kuaio.key('Z')
   * ```
   */
  Z(): this
  // #endregion
  // #region Keyboard codes
  /**
   * Set `KeyA` physical code as the trigger key for the current combination.
   * Unlike {@link A} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyA() // equivalent to kuaio.key({ code: 'KeyA', matchMode: 'code' })
   * ```
   */
  KeyA(): this
  /**
   * Set `KeyB` physical code as the trigger key for the current combination.
   * Unlike {@link B} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyB() // equivalent to kuaio.key({ code: 'KeyB', matchMode: 'code' })
   * ```
   */
  KeyB(): this
  /**
   * Set `KeyC` physical code as the trigger key for the current combination.
   * Unlike {@link C} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyC() // equivalent to kuaio.key({ code: 'KeyC', matchMode: 'code' })
   * ```
   */
  KeyC(): this
  /**
   * Set `KeyD` physical code as the trigger key for the current combination.
   * Unlike {@link D} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyD() // equivalent to kuaio.key({ code: 'KeyD', matchMode: 'code' })
   * ```
   */
  KeyD(): this
  /**
   * Set `KeyE` physical code as the trigger key for the current combination.
   * Unlike {@link E} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyE() // equivalent to kuaio.key({ code: 'KeyE', matchMode: 'code' })
   * ```
   */
  KeyE(): this
  /**
   * Set `KeyF` physical code as the trigger key for the current combination.
   * Unlike {@link F} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyF() // equivalent to kuaio.key({ code: 'KeyF', matchMode: 'code' })
   * ```
   */
  KeyF(): this
  /**
   * Set `KeyG` physical code as the trigger key for the current combination.
   * Unlike {@link G} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyG() // equivalent to kuaio.key({ code: 'KeyG', matchMode: 'code' })
   * ```
   */
  KeyG(): this
  /**
   * Set `KeyH` physical code as the trigger key for the current combination.
   * Unlike {@link H} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyH() // equivalent to kuaio.key({ code: 'KeyH', matchMode: 'code' })
   * ```
   */
  KeyH(): this
  /**
   * Set `KeyI` physical code as the trigger key for the current combination.
   * Unlike {@link I} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyI() // equivalent to kuaio.key({ code: 'KeyI', matchMode: 'code' })
   * ```
   */
  KeyI(): this
  /**
   * Set `KeyJ` physical code as the trigger key for the current combination.
   * Unlike {@link J} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyJ() // equivalent to kuaio.key({ code: 'KeyJ', matchMode: 'code' })
   * ```
   */
  KeyJ(): this
  /**
   * Set `KeyK` physical code as the trigger key for the current combination.
   * Unlike {@link K} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyK() // equivalent to kuaio.key({ code: 'KeyK', matchMode: 'code' })
   * ```
   */
  KeyK(): this
  /**
   * Set `KeyL` physical code as the trigger key for the current combination.
   * Unlike {@link L} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyL() // equivalent to kuaio.key({ code: 'KeyL', matchMode: 'code' })
   * ```
   */
  KeyL(): this
  /**
   * Set `KeyM` physical code as the trigger key for the current combination.
   * Unlike {@link M} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyM() // equivalent to kuaio.key({ code: 'KeyM', matchMode: 'code' })
   * ```
   */
  KeyM(): this
  /**
   * Set `KeyN` physical code as the trigger key for the current combination.
   * Unlike {@link N} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyN() // equivalent to kuaio.key({ code: 'KeyN', matchMode: 'code' })
   * ```
   */
  KeyN(): this
  /**
   * Set `KeyO` physical code as the trigger key for the current combination.
   * Unlike {@link O} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyO() // equivalent to kuaio.key({ code: 'KeyO', matchMode: 'code' })
   * ```
   */
  KeyO(): this
  /**
   * Set `KeyP` physical code as the trigger key for the current combination.
   * Unlike {@link P} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyP() // equivalent to kuaio.key({ code: 'KeyP', matchMode: 'code' })
   * ```
   */
  KeyP(): this
  /**
   * Set `KeyQ` physical code as the trigger key for the current combination.
   * Unlike {@link Q} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyQ() // equivalent to kuaio.key({ code: 'KeyQ', matchMode: 'code' })
   * ```
   */
  KeyQ(): this
  /**
   * Set `KeyR` physical code as the trigger key for the current combination.
   * Unlike {@link R} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyR() // equivalent to kuaio.key({ code: 'KeyR', matchMode: 'code' })
   * ```
   */
  KeyR(): this
  /**
   * Set `KeyS` physical code as the trigger key for the current combination.
   * Unlike {@link S} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyS() // equivalent to kuaio.key({ code: 'KeyS', matchMode: 'code' })
   * ```
   */
  KeyS(): this
  /**
   * Set `KeyT` physical code as the trigger key for the current combination.
   * Unlike {@link T} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyT() // equivalent to kuaio.key({ code: 'KeyT', matchMode: 'code' })
   * ```
   */
  KeyT(): this
  /**
   * Set `KeyU` physical code as the trigger key for the current combination.
   * Unlike {@link U} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyU() // equivalent to kuaio.key({ code: 'KeyU', matchMode: 'code' })
   * ```
   */
  KeyU(): this
  /**
   * Set `KeyV` physical code as the trigger key for the current combination.
   * Unlike {@link V} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyV() // equivalent to kuaio.key({ code: 'KeyV', matchMode: 'code' })
   * ```
   */
  KeyV(): this
  /**
   * Set `KeyW` physical code as the trigger key for the current combination.
   * Unlike {@link W} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyW() // equivalent to kuaio.key({ code: 'KeyW', matchMode: 'code' })
   * ```
   */
  KeyW(): this
  /**
   * Set `KeyX` physical code as the trigger key for the current combination.
   * Unlike {@link X} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyX() // equivalent to kuaio.key({ code: 'KeyX', matchMode: 'code' })
   * ```
   */
  KeyX(): this
  /**
   * Set `KeyY` physical code as the trigger key for the current combination.
   * Unlike {@link Y} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyY() // equivalent to kuaio.key({ code: 'KeyY', matchMode: 'code' })
   * ```
   */
  KeyY(): this
  /**
   * Set `KeyZ` physical code as the trigger key for the current combination.
   * Unlike {@link Z} which uses logical key
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.KeyZ() // equivalent to kuaio.key({ code: 'KeyZ', matchMode: 'code' })
   * ```
   */
  KeyZ(): this
  /**
   * Set `Digit0` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Digit0() // equivalent to kuaio.key({ code: 'Digit0', matchMode: 'code' })
   * ```
   */
  Digit0(): this
  /**
   * Set `Digit1` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Digit1() // equivalent to kuaio.key({ code: 'Digit1', matchMode: 'code' })
   * ```
   */
  Digit1(): this
  /**
   * Set `Digit2` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Digit2() // equivalent to kuaio.key({ code: 'Digit2', matchMode: 'code' })
   * ```
   */
  Digit2(): this
  /**
   * Set `Digit3` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Digit3() // equivalent to kuaio.key({ code: 'Digit3', matchMode: 'code' })
   * ```
   */
  Digit3(): this
  /**
   * Set `Digit4` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Digit4() // equivalent to kuaio.key({ code: 'Digit4', matchMode: 'code' })
   * ```
   */
  Digit4(): this
  /**
   * Set `Digit5` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Digit5() // equivalent to kuaio.key({ code: 'Digit5', matchMode: 'code' })
   * ```
   */
  Digit5(): this
  /**
   * Set `Digit6` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Digit6() // equivalent to kuaio.key({ code: 'Digit6', matchMode: 'code' })
   * ```
   */
  Digit6(): this
  /**
   * Set `Digit7` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Digit7() // equivalent to kuaio.key({ code: 'Digit7', matchMode: 'code' })
   * ```
   */
  Digit7(): this
  /**
   * Set `Digit8` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Digit8() // equivalent to kuaio.key({ code: 'Digit8', matchMode: 'code' })
   * ```
   */
  Digit8(): this
  /**
   * Set `Digit9` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Digit9() // equivalent to kuaio.key({ code: 'Digit9', matchMode: 'code' })
   * ```
   */
  Digit9(): this
  /**
   * Set `Numpad0` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Numpad0() // equivalent to kuaio.key({ code: 'Numpad0', matchMode: 'code' })
   * ```
   */
  Numpad0(): this
  /**
   * Set `Numpad1` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Numpad1() // equivalent to kuaio.key({ code: 'Numpad1', matchMode: 'code' })
   * ```
   */
  Numpad1(): this
  /**
   * Set `Numpad2` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Numpad2() // equivalent to kuaio.key({ code: 'Numpad2', matchMode: 'code' })
   * ```
   */
  Numpad2(): this
  /**
   * Set `Numpad3` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Numpad3() // equivalent to kuaio.key({ code: 'Numpad3', matchMode: 'code' })
   * ```
   */
  Numpad3(): this
  /**
   * Set `Numpad4` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Numpad4() // equivalent to kuaio.key({ code: 'Numpad4', matchMode: 'code' })
   * ```
   */
  Numpad4(): this
  /**
   * Set `Numpad5` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Numpad5() // equivalent to kuaio.key({ code: 'Numpad5', matchMode: 'code' })
   * ```
   */
  Numpad5(): this
  /**
   * Set `Numpad6` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Numpad6() // equivalent to kuaio.key({ code: 'Numpad6', matchMode: 'code' })
   * ```
   */
  Numpad6(): this
  /**
   * Set `Numpad7` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Numpad7() // equivalent to kuaio.key({ code: 'Numpad7', matchMode: 'code' })
   * ```
   */
  Numpad7(): this
  /**
   * Set `Numpad8` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Numpad8() // equivalent to kuaio.key({ code: 'Numpad8', matchMode: 'code' })
   * ```
   */
  Numpad8(): this
  /**
   * Set `Numpad9` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Numpad9() // equivalent to kuaio.key({ code: 'Numpad9', matchMode: 'code' })
   * ```
   */
  Numpad9(): this
  /**
   * Set `NumpadAdd` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.NumpadAdd() // equivalent to kuaio.key({ code: 'NumpadAdd', matchMode: 'code' })
   * ```
   */
  NumpadAdd(): this
  /**
   * Set `NumpadSubtract` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.NumpadSubtract() // equivalent to kuaio.key({ code: 'NumpadSubtract', matchMode: 'code' })
   * ```
   */
  NumpadSubtract(): this
  /**
   * Set `NumpadMultiply` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.NumpadMultiply() // equivalent to kuaio.key({ code: 'NumpadMultiply', matchMode: 'code' })
   * ```
   */
  NumpadMultiply(): this
  /**
   * Set `NumpadDivide` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.NumpadDivide() // equivalent to kuaio.key({ code: 'NumpadDivide', matchMode: 'code' })
   * ```
   */
  NumpadDivide(): this
  /**
   * Set `NumpadDecimal` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.NumpadDecimal() // equivalent to kuaio.key({ code: 'NumpadDecimal', matchMode: 'code' })
   * ```
   */
  NumpadDecimal(): this
  /**
   * Set `NumpadEnter` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.NumpadEnter() // equivalent to kuaio.key({ code: 'NumpadEnter', matchMode: 'code' })
   * ```
   */
  NumpadEnter(): this
  /**
   * Set `NumpadEqual` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.NumpadEqual() // equivalent to kuaio.key({ code: 'NumpadEqual', matchMode: 'code' })
   * ```
   */
  NumpadEqual(): this
  /**
   * Set `NumLock` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.NumLock() // equivalent to kuaio.key({ code: 'NumLock', matchMode: 'code' })
   * ```
   */
  NumLock(): this
  /**
   * Set `F1` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.F1() // equivalent to kuaio.key({ code: 'F1', matchMode: 'code' })
   * ```
   */
  F1(): this
  /**
   * Set `F2` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.F2() // equivalent to kuaio.key({ code: 'F2', matchMode: 'code' })
   * ```
   */
  F2(): this
  /**
   * Set `F3` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.F3() // equivalent to kuaio.key({ code: 'F3', matchMode: 'code' })
   * ```
   */
  F3(): this
  /**
   * Set `F4` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.F4() // equivalent to kuaio.key({ code: 'F4', matchMode: 'code' })
   * ```
   */
  F4(): this
  /**
   * Set `F5` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.F5() // equivalent to kuaio.key({ code: 'F5', matchMode: 'code' })
   * ```
   */
  F5(): this
  /**
   * Set `F6` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.F6() // equivalent to kuaio.key({ code: 'F6', matchMode: 'code' })
   * ```
   */
  F6(): this
  /**
   * Set `F7` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.F7() // equivalent to kuaio.key({ code: 'F7', matchMode: 'code' })
   * ```
   */
  F7(): this
  /**
   * Set `F8` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.F8() // equivalent to kuaio.key({ code: 'F8', matchMode: 'code' })
   * ```
   */
  F8(): this
  /**
   * Set `F9` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.F9() // equivalent to kuaio.key({ code: 'F9', matchMode: 'code' })
   * ```
   */
  F9(): this
  /**
   * Set `F10` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.F10() // equivalent to kuaio.key({ code: 'F10', matchMode: 'code' })
   * ```
   */
  F10(): this
  /**
   * Set `F11` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.F11() // equivalent to kuaio.key({ code: 'F11', matchMode: 'code' })
   * ```
   */
  F11(): this
  /**
   * Set `F12` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.F12() // equivalent to kuaio.key({ code: 'F12', matchMode: 'code' })
   * ```
   */
  F12(): this
  /**
   * Set `Escape` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Escape() // equivalent to kuaio.key({ code: 'Escape', matchMode: 'code' })
   * ```
   */
  Escape(): this
  /**
   * Set `Backquote` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Backquote() // equivalent to kuaio.key({ code: 'Backquote', matchMode: 'code' })
   * ```
   */
  Backquote(): this
  /**
   * Set `Minus` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Minus() // equivalent to kuaio.key({ code: 'Minus', matchMode: 'code' })
   * ```
   */
  Minus(): this
  /**
   * Set `Equal` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Equal() // equivalent to kuaio.key({ code: 'Equal', matchMode: 'code' })
   * ```
   */
  Equal(): this
  /**
   * Set `Backspace` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Backspace() // equivalent to kuaio.key({ code: 'Backspace', matchMode: 'code' })
   * ```
   */
  Backspace(): this
  /**
   * Set `Tab` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Tab() // equivalent to kuaio.key({ code: 'Tab', matchMode: 'code' })
   * ```
   */
  Tab(): this
  /**
   * Set `BracketLeft` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.BracketLeft() // equivalent to kuaio.key({ code: 'BracketLeft', matchMode: 'code' })
   * ```
   */
  BracketLeft(): this
  /**
   * Set `BracketRight` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.BracketRight() // equivalent to kuaio.key({ code: 'BracketRight', matchMode: 'code' })
   * ```
   */
  BracketRight(): this
  /**
   * Set `Backslash` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Backslash() // equivalent to kuaio.key({ code: 'Backslash', matchMode: 'code' })
   * ```
   */
  Backslash(): this
  /**
   * Set `CapsLock` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.CapsLock() // equivalent to kuaio.key({ code: 'CapsLock', matchMode: 'code' })
   * ```
   */
  CapsLock(): this
  /**
   * Set `Semicolon` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Semicolon() // equivalent to kuaio.key({ code: 'Semicolon', matchMode: 'code' })
   * ```
   */
  Semicolon(): this
  /**
   * Set `Quote` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Quote() // equivalent to kuaio.key({ code: 'Quote', matchMode: 'code' })
   * ```
   */
  Quote(): this
  /**
   * Set `Enter` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Enter() // equivalent to kuaio.key({ code: 'Enter', matchMode: 'code' })
   * ```
   */
  Enter(): this
  /**
   * Set `Comma` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Comma() // equivalent to kuaio.key({ code: 'Comma', matchMode: 'code' })
   * ```
   */
  Comma(): this
  /**
   * Set `Period` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Period() // equivalent to kuaio.key({ code: 'Period', matchMode: 'code' })
   * ```
   */
  Period(): this
  /**
   * Set `Slash` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Slash() // equivalent to kuaio.key({ code: 'Slash', matchMode: 'code' })
   * ```
   */
  Slash(): this
  /**
   * Set `Space` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Space() // equivalent to kuaio.key({ code: 'Space', matchMode: 'code' })
   * ```
   */
  Space(): this
  /**
   * Set `ContextMenu` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.ContextMenu() // equivalent to kuaio.key({ code: 'ContextMenu', matchMode: 'code' })
   * ```
   */
  ContextMenu(): this
  /**
   * Set `Insert` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Insert() // equivalent to kuaio.key({ code: 'Insert', matchMode: 'code' })
   * ```
   */
  Insert(): this
  /**
   * Set `Delete` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Delete() // equivalent to kuaio.key({ code: 'Delete', matchMode: 'code' })
   * ```
   */
  Delete(): this
  /**
   * Set `Home` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Home() // equivalent to kuaio.key({ code: 'Home', matchMode: 'code' })
   * ```
   */
  Home(): this
  /**
   * Set `End` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.End() // equivalent to kuaio.key({ code: 'End', matchMode: 'code' })
   * ```
   */
  End(): this
  /**
   * Set `PageUp` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.PageUp() // equivalent to kuaio.key({ code: 'PageUp', matchMode: 'code' })
   * ```
   */
  PageUp(): this
  /**
   * Set `PageDown` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.PageDown() // equivalent to kuaio.key({ code: 'PageDown', matchMode: 'code' })
   * ```
   */
  PageDown(): this
  /**
   * Set `ArrowUp` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.ArrowUp() // equivalent to kuaio.key({ code: 'ArrowUp', matchMode: 'code' })
   * ```
   */
  ArrowUp(): this
  /**
   * Set `ArrowDown` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.ArrowDown() // equivalent to kuaio.key({ code: 'ArrowDown', matchMode: 'code' })
   * ```
   */
  ArrowDown(): this
  /**
   * Set `ArrowLeft` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.ArrowLeft() // equivalent to kuaio.key({ code: 'ArrowLeft', matchMode: 'code' })
   * ```
   */
  ArrowLeft(): this
  /**
   * Set `ArrowRight` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.ArrowRight() // equivalent to kuaio.key({ code: 'ArrowRight', matchMode: 'code' })
   * ```
   */
  ArrowRight(): this
  /**
   * Set `PrintScreen` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.PrintScreen() // equivalent to kuaio.key({ code: 'PrintScreen', matchMode: 'code' })
   * ```
   */
  PrintScreen(): this
  /**
   * Set `ScrollLock` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.ScrollLock() // equivalent to kuaio.key({ code: 'ScrollLock', matchMode: 'code' })
   * ```
   */
  ScrollLock(): this
  /**
   * Set `Pause` physical code as the trigger key for the current combination.
   * @returns This instance for chaining
   * @see {@link key} for generic key method
   * @example
   * ```typescript
   * kuaio.Pause() // equivalent to kuaio.key({ code: 'Pause', matchMode: 'code' })
   * ```
   */
  Pause(): this
  // #endregion
  /**
   * Alias for {@link Control}
   * @returns This instance for chaining
   * @example
   * ```typescript
   * kuaio.Ctrl().A() // equivalent to kuaio.Control().A()
   * ```
   */
  Ctrl(): this
  /**
   * Alias for {@link Alt}
   * @returns This instance for chaining
   * @example
   * ```typescript
   * kuaio.Option().A() // equivalent to kuaio.Alt().A() on Mac
   * ```
   */
  Option(): this
  /**
   * Alias for {@link Meta}. Mac-specific alias for Command key
   * @returns This instance for chaining
   * @example
   * ```typescript
   * kuaio.Command().A() // equivalent to kuaio.Meta().A() on Mac
   * ```
   */
  Command(): this
  /**
   * Alias for {@link Meta}. Windows-specific alias for Windows key
   * @returns This instance for chaining
   * @example
   * ```typescript
   * kuaio.Windows().A() // equivalent to kuaio.Meta().A() on Windows
   * ```
   */
  Windows(): this
}

Kuaio.registerLayout(qwerty)

export default Kuaio
export type { KuaioConfig, KuaioLayout, KuaioCallback }
