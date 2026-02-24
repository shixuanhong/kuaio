import { KeyboardLayout } from '../../enums'

export interface KuaioLayout {
  name: string
  validator: (layoutMap: Map<string, string> | null, langTag: string) => boolean
  keyToCodeHandler: (key: string) => string
}

const keyboardLayoutMap = new Map<string, KuaioLayout>()

/**
 * Register a keyboard layout related handler.
 */
export function registerLayout(layout: KuaioLayout): void {
  keyboardLayoutMap.set(layout.name, layout)
}

/**
 * Unregister a keyboard layout.
 */
export function unregisterLayout(name: string): void {
  keyboardLayoutMap.delete(name)
}

/**
 * Get the registered keyboard layout.
 */
export function getLayout(name: string): KuaioLayout | undefined {
  return keyboardLayoutMap.get(name)
}

/**
 * Get user current keyboard layout.
 */
export async function getCurrentLayout(): Promise<KuaioLayout | undefined> {
  let layoutMap: Map<string, string> | null = null
  if (navigator.keyboard) {
    layoutMap = await navigator.keyboard.getLayoutMap()
  }

  for (const layout of keyboardLayoutMap.values()) {
    const { validator } = layout
    if (validator(layoutMap, navigator.language)) {
      return layout
    }
  }
  return getLayout(KeyboardLayout.QWERTY)
}

