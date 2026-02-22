/**
 * Represents a keyboard shortcut combination.
 * A combination consists of optional modifier keys (e.g., Ctrl, Shift, Alt)
 * and a trigger key that must be pressed together.
 * @class KuaioCombination
 * @property {string[]} modifiers - Array of modifier keys (e.g., Control, Shift, Alt)
 * @property {string} key - The trigger key for the combination
 * @property {number} [timeout] - Optional timeout in milliseconds for sequence combinations
 * @property {boolean} [preventDefault] - Whether to prevent the browser's default behavior
 * @property {boolean} [stopPropagation] - Whether to stop event propagation
 * @property {boolean} [stopImmediatePropagation] - Whether to stop immediate propagation
 */

export class KuaioCombination {
  modifiers: string[] = []
  key: string | undefined
  timeout: number | undefined
  preventDefault: boolean | undefined
  stopPropagation: boolean | undefined
  stopImmediatePropagation: boolean | undefined
}

/**
 * Represents a sequence of keyboard shortcut combinations.
 * A sequence is an ordered array of combinations that must be pressed in order.
 * @class KuaioSequence
 * @extends {Array<KuaioCombination>}
 */

export class KuaioSequence extends Array<KuaioCombination> {
  getAllModifiers(): Set<string> {
    const result = new Set<string>()
    this.forEach((item) => {
      item.modifiers.forEach((modifier) => result.add(modifier))
    })
    return result
  }
}
