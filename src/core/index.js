import {
  WhitespaceKeys,
  EditingKeys,
  FunctionKeys,
  NavigationKeys,
  KeyboardEventType,
  ModifierKeys,
  UIKeys,
  GeneralKeys
} from '../constants/index'
import { KuaioSequenceItem, KuaioSequence } from './sequence'
import { createNativeEventListener } from './listener'

class Kuaio {
  target
  config
  _eventType
  _sequence
  _curSequenceItem
  _listener

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
    this._sequence = new KuaioSequence()
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
  _pushSequenceItem(sequenceItem) {
    this._sequence.push(sequenceItem)
  }
  _getCurSequenceItem() {
    if (!this._curSequenceItem) {
      this._curSequenceItem = new KuaioSequenceItem()
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
    this._getCurSequenceItem().modifiers.push(key)
    return this
  }
  key(key) {
    this._getCurSequenceItem().key = key
    return this
  }
  prventDefault(value) {
    this._getCurSequenceItem().preventDefault = value
    return this
  }
  stopPropagation(value) {
    this._getCurSequenceItem().stopPropagation = value
    return this
  }
  stopImmediatePropagation(value) {
    this._getCurSequenceItem().stopImmediatePropagation = value
    return this
  }
  after(timeout) {
    this._pushCurSequenceItem(timeout)
    return this
  }
  bind(callback) {
    if (!callback) {
      throw new Error('callback')
    }
    this._pushCurSequenceItem()
    this._listener = createNativeEventListener(
      {
        target: this.target,
        config: this.config,
        eventType: this._eventType,
        sequence: this._sequence
      },
      callback
    )
    return this._listener
  }
  unbind() {
    if (this._listener) {
      this.target.removeEventListener(this._eventType, this._listener)
    }
  }
}

const ignoreModifierKeys = [
  ModifierKeys.CapsLock,
  ModifierKeys.NumLock,
  ModifierKeys.ScrollLock
]

Object.entries(ModifierKeys).forEach(([key, value]) => {
  if (ignoreModifierKeys.indexOf(key) > -1) {
    return
  }
  Kuaio.prototype[key] = function () {
    return this.modifier(value)
  }
})

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

export default Kuaio
