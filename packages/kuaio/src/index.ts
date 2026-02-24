import Kuaio from './core/index'
export { VirtualKeys } from './constants/index'

export {
  EditingKeys,
  FunctionKeys,
  CombinationModifierKeys,
  CombinationModifierKeyAlias,
  ModifierKeys,
  NavigationKeys,
  WhitespaceKeys,
  GeneralKeys,
  KeyboardEventType
} from './enums'

export { KuaioKey } from './core/key'
export type { KuaioKeyInit, KuaioKeyMatchMode } from './core/key'
export { KuaioCombination, KuaioSequence } from './core/sequence'
export type { KuaioConfig, KuaioLayout, KuaioCallback } from './core/index'

export * from './core/layout/index'

export default Kuaio
