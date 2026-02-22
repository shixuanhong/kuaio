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

export { KuaioCombination, KuaioSequence } from './core/sequence'
export type { KuaioConfig, KuaioLayout, KuaioCallback } from './core/index'

import qwerty from './core/layout/presets/qwerty'

Kuaio.registryLayout(qwerty)

export default Kuaio
