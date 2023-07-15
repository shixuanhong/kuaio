export class KuaioSequenceItem {
  modifiers = []
  key
  timeout
  preventDefault
  stopPropagation
  stopImmediatePropagation
}

export class KuaioSequence extends Array {
  getAllModifiers() {
    const result = new Set()
    this.forEach((item) => {
      item.modifiers.forEach((modifier) => result.add(modifier))
    })
    return result
  }
}
