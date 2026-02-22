import { KeyboardLayout } from '../../constants/index'

export interface KuaioLayoutHandlers {
  validator: (layoutMap: Map<string, string> | null, langTag: string) => boolean
  glyphHandler: (key: string, glyphModifierState: Record<string, boolean>) => string
}

interface LayoutEntry {
  name: string
  handlers: KuaioLayoutHandlers
}

const keyboardLayoutMap = new Map<string, LayoutEntry>()

let cachedLayout: LayoutEntry | null = null

/**
 * Register a keyboard layout related handler.
 */
export function registryLayout(name: string, handlers: KuaioLayoutHandlers): void {
  if (typeof name !== 'string') {
    throw new Error('Parameter [name] must be a string.')
  }
  if (!handlers || typeof handlers.validator !== 'function') {
    throw new Error(
      'The registered layout is missing method: validator, or it is not a function.'
    )
  }
  keyboardLayoutMap.set(name, {
    name,
    handlers
  })
}

/**
 * Unregister a keyboard layout.
 */
export function unregistryLayout(name: string): void {
  keyboardLayoutMap.delete(name)
}

/**
 * Get the registered keyboard layout.
 */
export function getLayout(name: string): LayoutEntry | undefined {
  return keyboardLayoutMap.get(name)
}

/**
 * Get user current keyboard layout.
 */
export async function getCurrentLayout(): Promise<LayoutEntry | undefined> {
  let layoutMap: Map<string, string> | null = null
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

export function setCachedLayout(layout: LayoutEntry): void {
  cachedLayout = layout
}

export async function getCachedLayout(): Promise<LayoutEntry> {
  if (!cachedLayout) {
    const layout = await getCurrentLayout()
    if (layout) {
      setCachedLayout(layout)
    }
  }
  return cachedLayout!
}
