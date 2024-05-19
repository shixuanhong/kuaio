import {
  ModifierKeys,
  WritingSystemCodes,
  qwertyShiftMap,
  GeneralKeys,
  KeyboardLayout
} from '../../constants/index'

const qwertyLangTagSet = new Set(['zh-CN', 'en-US ', 'zh', 'en'])

/**
 * Verify that the current keyboard layout is QWERTY.
 * @param {?Map<string, string>} layoutMap A mapping of physical key codes to key strings. \
 * If your browser does not support `navigator.keyboard`, then it will be `null`.
 * @param {string} langTag e.g., zh-CN, en-US and fr-FR.
 */
function qwertyValidator(layoutMap, langTag) {
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
 * @param {string} key
 * @param {object} glyphModifierState The state of the glyph modifier key(whether it is pressed or locked).
 * @returns {string}
 */
function qwertyGlyphHandler(key, glyphModifierState) {
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
