/**
 * Match mode for KuaioKey.
 * - `'code'`: match against `KeyboardEvent.code`
 * - `'key'`: match against `KeyboardEvent.key`
 */
export type KuaioKeyMatchMode = 'code' | 'key'

/**
 * Initialization object for constructing a KuaioKey.
 */
export interface KuaioKeyInit {
  isModifier?: boolean
  code?: string
  key?: string
  matchMode?: KuaioKeyMatchMode
}

/**
 * Represents a key on the keyboard.
 *
 * - `code`: physical key code (e.g. `'KeyA'`, `'ShiftLeft'`)
 * - `key`: logical key value (e.g. `'a'`, `'Shift'`)
 * - `matchMode`: determines which field is used for matching
 *
 * For example:
 * - By code: `new KuaioKey({ code: 'KeyA', matchMode: 'code' })`
 * - By key:  `new KuaioKey({ key: 'a', matchMode: 'key' })`
 */
export class KuaioKey {
  isModifier: boolean
  code?: string
  key?: string
  matchMode: KuaioKeyMatchMode

  constructor(init: KuaioKeyInit) {
    this.isModifier = init.isModifier ?? false
    this.code = init.code
    this.key = init.key
    this.matchMode = init.matchMode ?? 'code'
  }

  /**
   * Returns true if the input matches this key based on `matchMode`.
   * - `string`: compared against the active field (`code` or `key`)
   * - `KeyboardEvent`: compared against `event.code` or `event.key`
   */
  match(input: string | KeyboardEvent): boolean {
    if (this.matchMode === 'code') {
      if (!this.code) return false
      const value = typeof input === 'string' ? input : input.code
      return this.code === value
    } else {
      if (!this.key) return false
      const value = typeof input === 'string' ? input : input.key
      return this.key === value
    }
  }
}
