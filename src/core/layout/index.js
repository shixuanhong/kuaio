import { KeyboardLayout } from '../../constants/index'

const keyboardLayoutMap = new Map()

let cachedLayout = null

/**
 * Register a keyboard layout related handler.
 * @param {string} name
 * @param {object} handlers
 */
export function registryLayout(name, handlers) {
  if (typeof name !== 'string') {
    throw new Error('')
  }
  keyboardLayoutMap.set(name, {
    name,
    handlers
  })
}

/**
 * Unregister a keyboard layout.
 * @param {string} name
 */
export function unregistryLayout(name) {
  keyboardLayoutMap.delete(name)
}

/**
 * Get the registered keyboard layout.
 * @param {string} name
 */
export function getLayout(name) {
  keyboardLayoutMap.get(name)
}

/**
 * Get user current keyboard layout.
 * @returns {Promise<string | undefined>}
 */
export async function getCurrentLayout() {
  let layoutMap = null
  if (navigator.keyboard) {
    layoutMap = await navigator.keyboard.getLayoutMap()
  }

  for (const layout of keyboardLayoutMap.values()) {
    const { validator } = layout.handlers
    if (validator(layoutMap, navigator.language)) {
      return layout
    }
  }
  return getLayout(KeyboardLayout.QWERTY)
}

export function setCachedLayout(layout) {
  cachedLayout = layout
}

export async function getCachedLayout() {
  if (!cachedLayout) {
    setCachedLayout(await getCurrentLayout())
  }
  return cachedLayout
}
