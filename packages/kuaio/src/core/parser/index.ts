import {
  getRealKey,
  isCombinationModifierKey,
  normalizeToKuaioKey
} from '../../utils/index'
import { KuaioKey, KuaioCombination, KuaioSequence } from '../classes'
import { KuaioLayout } from '../layout/index'

const COMBINATION_SEPARATOR = ','
const COMBINATION_JOIN = '+'

export function stringDefinitionParser(
  inputStr: string,
  layout: KuaioLayout
): KuaioSequence {
  if (typeof inputStr !== 'string') {
    throw new Error('Parameter [inputStr] must be a string.')
  }
  const combinationStrArr = inputStr
    .replace(/\s+/g, '')
    .split(COMBINATION_SEPARATOR)
  const sequence = new KuaioSequence()
  combinationStrArr.forEach((combinationStr) => {
    if (combinationStr.length === 0) return
    if (!/^[^+\f\n\r\t\v]+(\+[^+\f\n\r\t\v]+)*$/.test(combinationStr)) {
      throw new Error(`Invalid key combination string: "${combinationStr}".`)
    }
    const combination = new KuaioCombination()
    combinationStr.split(COMBINATION_JOIN).forEach((key) => {
      const kuaioKey = normalizeToKuaioKey(key, layout)
      if (
        kuaioKey.matchMode === 'key' &&
        kuaioKey.key &&
        isCombinationModifierKey(kuaioKey.key)
      ) {
        kuaioKey.isModifier = true
        combination.modifiers.push(kuaioKey)
      } else {
        combination.key = kuaioKey
      }
    })
    sequence.push(combination)
  })
  return sequence
}
