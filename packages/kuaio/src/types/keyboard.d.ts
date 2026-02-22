interface Keyboard {
  getLayoutMap(): Promise<Map<string, string>>
}

interface Navigator {
  readonly keyboard?: Keyboard
}
