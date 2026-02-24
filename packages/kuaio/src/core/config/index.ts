export interface KuaioConfig {
  sequenceTimeout?: number
  preventDefault?: boolean
  stopPropagation?: boolean
  stopImmediatePropagation?: boolean
}

export const defaultGlobalConfig: Required<KuaioConfig> = {
  sequenceTimeout: 1000,
  preventDefault: false,
  stopPropagation: false,
  stopImmediatePropagation: false
}

let userGlobalConfig: Partial<KuaioConfig> = {}

export function setGlobalConfig(config: Partial<KuaioConfig> = {}): void {
  userGlobalConfig = Object.fromEntries(
    Object.entries(config).filter(
      (item) => typeof item[1] !== 'undefined' && item[1] !== null
    )
  )
}

export function getGlobalConfig() {
  return {
    ...defaultGlobalConfig,
    ...userGlobalConfig
  } as Required<KuaioConfig>
}
