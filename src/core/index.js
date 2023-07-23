import {
  WhitespaceKeys,
  EditingKeys,
  FunctionKeys,
  NavigationKeys,
  KeyboardEventType,
  CombinationModifierKeys,
  UIKeys,
  GeneralKeys,
  PlatformBrand
} from '../constants/index'
import { KuaioCombination, KuaioSequence } from './sequence'
import { createNativeEventListeners } from './listener'
import { registryLayout, unregistryLayout } from './layout/index'
import { getPlatform, isCombinationModifierKey } from '../utils/index'

class Kuaio {
  target
  config
  _eventType
  _curSequence
  _sequenceList
  _curSequenceItem
  _listeners

  constructor(target, config) {
    if (!target || !(target instanceof EventTarget)) {
      throw new Error(
        'Parameter target cannot be empty or not an instance of EventTarget.'
      )
    }
    this.target = target
    if (
      typeof config !== 'object' ||
      config === null ||
      Array.isArray(config)
    ) {
      throw new Error(
        'The parameter config cannot be empty and must be a plain object'
      )
    }
    this.config = config
    this._eventType = KeyboardEventType.KeyDown
    this._curSequence = null
    this._sequenceList = []
    this._curSequenceItem = null
  }
  static create(...args) {
    const global = document || window
    if (args.length === 0) {
      return new Kuaio(global, {})
    }
    if (args.length === 1) {
      if (args[0] instanceof EventTarget) {
        return new Kuaio(args[0], {})
      } else {
        return new Kuaio(global, args[0])
      }
    }
    if (args.length === 2) {
      return new Kuaio(args[0], args[1])
    }
  }
  static registryLayout = registryLayout
  static unregistryLayout = unregistryLayout
  _pushSequenceItem(sequenceItem) {
    this._getCurSequence().push(sequenceItem)
  }
  _getCurSequenceItem() {
    if (!this._curSequenceItem) {
      this._curSequenceItem = new KuaioCombination()
    }
    return this._curSequenceItem
  }
  _pushCurSequenceItem(timeout) {
    if (this._curSequenceItem) {
      this._curSequenceItem.timeout = timeout
      this._pushSequenceItem(this._curSequenceItem)
      this._curSequenceItem = null
    }
  }
  _pushSequence(sequence) {
    this._sequenceList.push(sequence)
  }
  _getCurSequence() {
    if (!this._curSequence) {
      this._curSequence = new KuaioSequence()
    }
    return this._curSequence
  }
  _pushCurSequence() {
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
  keydown() {
    this._eventType = KeyboardEventType.KeyDown
    return this
  }
  /**
   * Use the `keyup` event.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
   */
  keyup() {
    this._eventType = KeyboardEventType.KeyUp
    return this
  }
  /**
   * Add a key to the modifier list
   */
  modifier(key) {
    if (!isCombinationModifierKey(key)) {
      throw new Error(
        'The parameter key is not a modifier key that can be used in combination.'
      )
    }
    this._getCurSequenceItem().modifiers.push(key)
    return this
  }
  /**
   * Set a key as trigger key
   */
  key(key) {
    this._getCurSequenceItem().key = key
    return this
  }
  /**
   * Prevent the browser's default behavior when the sequence executes to the current combination.
   */
  prventDefault() {
    this._getCurSequenceItem().preventDefault = true
    return this
  }
  /**
   * Prevent the event from propagating further when the sequence executes to the current combination.alue
   */
  stopPropagation() {
    this._getCurSequenceItem().stopPropagation = true
    return this
  }
  /**
   * Prevent other event listeners on the event target listening to the same event from being called when the sequence executes to the current composition.
   */
  stopImmediatePropagation() {
    this._getCurSequenceItem().stopImmediatePropagation = true
    return this
  }
  /**
   * Create the next combination in the sequence.
   * @param {number} [timeout] The timeout of the current combination in the sequence, which is the time to wait for the next combination in the sequence to be pressed.
   */
  after(timeout) {
    this._pushCurSequenceItem(timeout)
    return this
  }
  /**
   * Create a new sequence, usually used to bind multiple sequences to the same callback.
   */
  or() {
    this._pushCurSequence()
    return this
  }
  /**
   * Bind the callback to sequences
   * @param callback
   */
  bind(callback) {
    if (!callback) {
      throw new Error('callback')
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
   * Unbind the callback and unbind all native event handlers
   */
  unbind() {
    if (this._listeners && this._listeners.length > 0) {
      this._listeners.forEach((listener) => {
        this.target.removeEventListener(this._eventType, listener)
      })
    }
  }
}

const initModifierMethods = () => {
  Object.entries(CombinationModifierKeys).forEach(([key, value]) => {
    Kuaio.prototype[key] = function () {
      return this.modifier(value)
    }
  })
  // aliases
  Kuaio.prototype.Ctrl = Kuaio.prototype[CombinationModifierKeys.Control]
  Kuaio.prototype.Option = Kuaio.prototype[CombinationModifierKeys.Alt]
  Kuaio.prototype.Command = Kuaio.prototype[CombinationModifierKeys.Meta]
  Kuaio.prototype.Windows = Kuaio.prototype[CombinationModifierKeys.Meta]
  /**
   * This is a virtual key, inspired by Mousetrap. \
   * It will be mapped to the `Command` key on MacOS, and the `Ctrl` key on other operating systems.
   */
  Kuaio.prototype.Mod = function () {
    return this.modifier(
      getPlatform() === PlatformBrand.MacOS
        ? CombinationModifierKeys.Meta
        : CombinationModifierKeys.Control
    )
  }
}

const initKeyMethods = () => {
  Object.entries(WhitespaceKeys)
    .concat(
      Object.entries(NavigationKeys),
      Object.entries(EditingKeys),
      Object.entries(UIKeys),
      Object.entries(FunctionKeys),
      Object.entries(GeneralKeys)
    )
    .forEach(([key, value]) => {
      Kuaio.prototype[key] = function () {
        return this.key(value)
      }
    })
  // aliases
  Kuaio.prototype.Esc = Kuaio.prototype[UIKeys.Escape]
  Kuaio.prototype.Return = Kuaio.prototype[WhitespaceKeys.Enter]
  Kuaio.prototype.MacDelete = Kuaio.prototype[EditingKeys.Backspace]
}

initModifierMethods()
initKeyMethods()

export default Kuaio
