export interface KuaioConfig {
  sequenceTimeout?: number
  preventDefault?: boolean
  stopPropagation?: boolean
  stopImmediatePropagation?: boolean
  disableGlyphHandler?: boolean
}

export const defaultConfig: Required<KuaioConfig> = {
  sequenceTimeout: 1000,
  preventDefault: false,
  stopPropagation: false,
  stopImmediatePropagation: false,
  disableGlyphHandler: false
}

let userDefaultConfig: Partial<KuaioConfig> = {}

export function setDefaultConfig(config: Partial<KuaioConfig> = {}): void {
  userDefaultConfig = Object.fromEntries(
    Object.entries(config).filter(
      (item) => typeof item[1] !== 'undefined' && item[1] !== null
    )
  )
}

export function getDefaultConfig(): Required<KuaioConfig> {
  return {
    ...defaultConfig,
    ...userDefaultConfig
  } as Required<KuaioConfig>
}
