import { KuaioLayout } from '../../index'
import {
  KeyboardCodes,
  KeyboardLayout,
  GeneralKeys
} from '../../../../enums'
import { qwertyKeyToCodeMap } from './maps'

const qwertyLangTagSet = new Set(['zh-CN', 'en-US', 'zh', 'en'])

/**
 * Verify that the current keyboard layout is QWERTY.
 * @param layoutMap A mapping of physical key codes to key strings. \
 * If your browser does not support `navigator.keyboard`, then it will be `null`.
 * @param langTag e.g., zh-CN, en-US and fr-FR.
 */
function qwertyValidator(
  layoutMap: Map<string, string> | null,
  langTag: string
): boolean {
  if (layoutMap) {
    return (
      layoutMap.get(KeyboardCodes.KeyQ) === GeneralKeys.Q &&
      layoutMap.get(KeyboardCodes.KeyY) === GeneralKeys.Y
    )
  } else {
    const [language] = langTag.split('-')
    return qwertyLangTagSet.has(langTag) || qwertyLangTagSet.has(language)
  }
}

/**
 * Resolve a key value to its corresponding physical key code in the QWERTY layout.
 */
function qwertyKeyToCodeHandler(key: string) {
  return qwertyKeyToCodeMap[key] ?? key
}

export default {
  name: KeyboardLayout.QWERTY,
  validator: qwertyValidator,
  keyToCodeHandler: qwertyKeyToCodeHandler
} as KuaioLayout
