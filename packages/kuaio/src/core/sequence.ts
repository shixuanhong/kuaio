import { KuaioKey } from './key'

/**
 * Represents a keyboard shortcut combination.
 * A combination consists of optional modifier keys and a trigger key that must be pressed together.
 * @class KuaioCombination
 * @property {KuaioKey[]} modifiers - Array of modifier keys, each represented as a KuaioKey with one or more codes
 * @property {KuaioKey} [key] - The trigger key for the combination, matched via event.code
 * @property {number} [timeout] - Optional timeout in milliseconds for sequence combinations
 * @property {boolean} [preventDefault] - Whether to prevent the browser's default behavior
 * @property {boolean} [stopPropagation] - Whether to stop event propagation
 * @property {boolean} [stopImmediatePropagation] - Whether to stop immediate propagation
 */

export class KuaioCombination {
  modifiers: KuaioKey[] = []
  key: KuaioKey | undefined
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

}
