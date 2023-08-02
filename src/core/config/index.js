export const defaultConfig = {
  sequenceTimeout: 1000,
  preventDefault: false,
  stopPropagation: false,
  stopImmediatePropagation: false,
  disableGlyphHandler: false
}

let userDefaultConfig = {}

export function setDefaultConfig(config = {}) {
  userDefaultConfig = Object.fromEntries(
    Object.entries(config).filter(
      (item) => typeof item[1] !== 'undefined' && item[1] !== null
    )
  )
}

export function getDefaultConfig() {
  return {
    ...defaultConfig,
    ...userDefaultConfig
  }
}
