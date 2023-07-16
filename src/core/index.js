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
import { defaultConfig } from './config/index'
import { createNativeEventListener } from './listener'
import { getKeyMethodName } from '../utils/index'

class Kuaio {
  target
  _eventType
  _sequence
  _sequenceTimeout
  _curSequenceItem
  _prventDefault
  _stopPropagation
  _stopImmediatePropagation
  _listener

  constructor(target) {
    this.target = target
    this._eventType = KeyboardEventType.KeyDown
    this._sequence = new KuaioSequence()
    this._sequenceTimeout = defaultConfig.sequenceTimeout
    this._curSequenceItem = null
    this._prventDefault = defaultConfig.preventDefault
    this._stopPropagation = defaultConfig.stopPropagation
    this._stopImmediatePropagation = defaultConfig.stopImmediatePropagation
  }
  static create(target) {
    if (!target) {
      return new Kuaio(window || globalThis)
    }
    return new Kuaio(target)
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
      this._curSequenceItem.timeout = timeout ?? this._sequenceTimeout
      this._curSequenceItem.preventDefault ??= this._prventDefault
      this._curSequenceItem.stopPropagation ??= this._stopPropagation
      this._curSequenceItem.stopImmediatePropagation ??=
        this._stopImmediatePropagation
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
  defaultSequenceTimeout(timeout) {
    this._sequenceTimeout = timeout
    return this
  }
  defaultPrventDefault(value) {
    this._prventDefault = value
    return this
  }
  defaultStopPropagation(value) {
    this._stopPropagation = value
    return this
  }
  defaultStopImmediatePropagation(value) {
    this._stopImmediatePropagation = value
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
  ModifierKeys.CAPS_LOCK,
  ModifierKeys.NUM_LOCK,
  ModifierKeys.SCROLL_LOCK
]

Object.values(ModifierKeys).forEach((key) => {
  if (ignoreModifierKeys.indexOf(key) > -1) {
    return
  }
  Kuaio.prototype[key] = function () {
    return this.modifier(key)
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
