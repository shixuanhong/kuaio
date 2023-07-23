import Kuaio from './core/index'
export {
  EditingKeys,
  FunctionKeys,
  CombinationModifierKeys,
  ModifierKeys,
  NavigationKeys,
  WhitespaceKeys,
  GeneralKeys,
  KeyboardEventType
} from './constants/index'

import qwerty from './core/layout/qwerty'

Kuaio.registryLayout(qwerty.name, qwerty.handlers)

export { Kuaio }
