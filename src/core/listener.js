import { getModifierKeyPressed, keyEqualTo } from '../utils/index'

export function createNativeEventListenerWrapper(callback, sequence) {
  if (sequence.length === 0) {
    throw new Error('Sequence cannot be empty.')
  }
  let sequenceIndex = 0
  let timer = null
  return (e) => {
    const event = e
    // console.log(event.key)
    const sequenceItem = sequence[sequenceIndex]
    if (sequenceItem.preventDefault) {
      e.preventDefault
    }
    if (sequenceItem.stopPropagation) {
      e.stopPropagation
    }
    if (sequenceItem.stopImmediatePropagation) {
      e.stopImmediatePropagation()
    }
    if (!sequenceItem.key) {
      throw new Error(
        `The sequenceItem at position ${sequenceIndex} in the sequence does not specify the property: [key].`
      )
    }
    const modifiersMatched =
      sequenceItem.modifiers.length === 0 ||
      sequenceItem.modifiers.every((modifier) =>
        getModifierKeyPressed(modifier, event)
      )
    if (keyEqualTo(event.key, sequenceItem.key) && modifiersMatched) {
      if (sequenceIndex === sequence.length - 1) {
        callback(event)
        sequenceIndex = 0
      } else {
        if (timer) {
          clearTimeout(timer)
        }
        sequenceIndex++
        timer = setTimeout(() => {
          sequenceIndex = 0
          timer = null
        }, sequenceItem.timeout)
      }
    } else {
      sequenceIndex = 0
    }
  }
}

export function createNativeEventListener(options, callback) {
  const { target, eventType, sequence } = options
  const listener = createNativeEventListenerWrapper(callback, sequence)
  target.addEventListener(eventType, listener)
  return listener
}
