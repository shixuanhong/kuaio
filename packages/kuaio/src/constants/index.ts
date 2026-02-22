import { getPlatform } from '../utils/index'
import { CombinationModifierKeys, PlatformBrand } from '../enums/index'

export const VirtualKeys = {
  /**
   * This is a virtual key, inspired by Mousetrap. \
   * It will be mapped to the `Command` key on MacOS, and the `Ctrl` key on other operating systems.
   */
  get Mod() {
    return getPlatform() === PlatformBrand.MacOS
      ? CombinationModifierKeys.Meta
      : CombinationModifierKeys.Control
  }
}
