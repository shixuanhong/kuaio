import {
  ModifierKeys,
  WritingSystemCodes,
  qwertyShiftMap,
  GeneralKeys,
  KeyboardLayout
} from '../../constants/index'

const qwertyLangTagSet = new Set(['zh-CN', 'en-US', 'zh', 'en'])

/**
 * Verify that the current keyboard layout is QWERTY.
 * @param layoutMap A mapping of physical key codes to key strings. \
 * If your browser does not support `navigator.keyboard`, then it will be `null`.
 * @param langTag e.g., zh-CN, en-US and fr-FR.
 */
function qwertyValidator(layoutMap: Map<string, string> | null, langTag: string): boolean {
  if (layoutMap) {
    return (
      layoutMap.get(WritingSystemCodes.KeyQ) === GeneralKeys.Q &&
      layoutMap.get(WritingSystemCodes.KeyY) === GeneralKeys.Y
    )
  } else {
    const [language] = langTag.split('-')
    return qwertyLangTagSet.has(langTag) || qwertyLangTagSet.has(language)
  }
}

/**
 * Handle glyph changes brought about by glyph modifier keys: `Shift`, `CapsLock`, `AltGr`. \
 * The return value will be used as a new key to participate in the subsequent matching process of the shortcut.
 */
function qwertyGlyphHandler(key: string, glyphModifierState: Record<string, boolean>): string {
  if (
    /^[A-Z]$/.test(key) &&
    (glyphModifierState[ModifierKeys.CapsLock] ||
      glyphModifierState[ModifierKeys.Shift])
  ) {
    return key.toLocaleLowerCase()
  } else if (glyphModifierState[ModifierKeys.Shift] && qwertyShiftMap[key]) {
    return qwertyShiftMap[key]
  } else {
    return key
  }
}

export default {
  name: KeyboardLayout.QWERTY,
  handlers: {
    validator: qwertyValidator,
    glyphHandler: qwertyGlyphHandler
  }
}
