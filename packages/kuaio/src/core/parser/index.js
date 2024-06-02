import { getRealKey, isCombinationModifierKey } from '../../utils/index'
import { KuaioCombination, KuaioSequence } from '../sequence'

const COMBINATION_SEPARATOR = ','
const COMBINATION_JOIN = '+'

export function stringParser(inputStr) {
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
      const realKey = getRealKey(key)
      if (isCombinationModifierKey(realKey)) {
        combination.modifiers.push(realKey)
      } else {
        combination.key = realKey
      }
    })
    sequence.push(combination)
  })
  return sequence
}
