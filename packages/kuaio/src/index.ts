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

export * from './core/classes'
export type { KuaioConfig, KuaioLayout, KuaioCallback } from './core/index'

export * from './core/layout/index'

export default Kuaio
