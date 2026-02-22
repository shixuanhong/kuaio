import Kuaio from './core/index'
export {
  EditingKeys,
  FunctionKeys,
  CombinationModifierKeys,
  ModifierKeys,
  NavigationKeys,
  WhitespaceKeys,
  GeneralKeys,
  VirtualKeys,
  KeyboardEventType
} from './constants/index'

export { KuaioCombination, KuaioSequence } from './core/sequence'
export type { KuaioConfig, KuaioLayoutHandlers, KuaioCallback } from './core/index'

import qwerty from './core/layout/qwerty'

Kuaio.registryLayout(qwerty.name, qwerty.handlers)

export default Kuaio
