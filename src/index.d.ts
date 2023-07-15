declare class Kuaio {
  readonly target: EventTarget
  private _eventType
  private _sequence
  private _sequenceTimeout
  private _curSequenceItem
  private _prventDefault
  private _stopPropagation
  private _stopImmediatePropagation
  private _listener?
  constructor(target: EventTarget)
  static create(target: EventTarget): Kuaio
  static global(): Kuaio
  private _pushSequenceItem
  private _getCurSequenceItem
  private _pushCurSequenceItem
  /**
   * Use the `keydown` event.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
   */
  keydown(): this
  /**
   * Use the `keyup` event.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
   */
  keyup(): this
  defaultSequenceTimeout(timeout: number): this
  defaultPrventDefault(value: boolean): this
  defaultStopPropagation(value: boolean): this
  defaultStopImmediatePropagation(value: boolean): this
  /**
   * Add a key to the modifier list
   */
  modifier(key: string): this
  /**
   * Add `Alt` key to modifier list, which is the `Option` or `⌥` key on Mac keyboards.
   */
  alt(): this
  /**
   * Add `Ctrl` key to modifier list, which is the `Control` or `⌃` key on Mac keyboards.
   */
  ctrl(): this
  /**
   * Add `Meta` key to modifier list, which is the `Windows` or `⊞` key on Windows keyboards, or the `Command` or `⌘` key on Mac keyboards.
   */
  meta(): this
  /**
   * Add `Shift` key to modifier list
   */
  shift(): this
  key(key: string): this
  prventDefault(value: boolean): this
  stopPropagation(value: boolean): this
  stopImmediatePropagation(value: boolean): this
  after(timeout?: number): this
  bind(callback: Function): EventListener
  unbind(): void
}

declare function keyEqualTo(key1: string, key2: string): boolean

/**
 * Modifiers are special keys which are used to generate special characters or cause special actions when used in combination with other keys.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#whitespace_keys
 */
declare enum ModifierKeys {
  /** This is the `Alt` key, which is the `Option` or `⌥` key on Mac keyboards. */
  ALT = 'Alt',
  CAPS_LOCK = 'CapsLock',
  /** This is the `Ctrl` key, which is the `Control` or `⌃` key on Mac keyboards. */
  CONTROL = 'Control',
  /** This is the `Windows` or `⊞` key, which is the `Command` or `⌘` key on Mac keyboards. */
  META = 'Meta',
  NUM_LOCK = 'NumLock',
  SCROLL_LOCK = 'ScrollLock',
  SHIFT = 'Shift'
}
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#whitespace_keys
 */
declare enum WhitespaceKeys {
  ENTER = 'Enter',
  TAB = 'Tab',
  SPACE = ' '
}
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#navigation_keys
 */
declare enum NavigationKeys {
  ARROW_DOWN = 'ArrowDown',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  ARROW_UP = 'ArrowUp',
  END = 'End',
  HOME = 'Home',
  PAGE_DOWN = 'PageDown',
  PAGE_UP = 'PageUp'
}
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#editing_keys
 */
declare enum EditingKeys {
  /** This is the `Backspace` key, which is the `Delete` key on Mac keyboards. */
  BACKSPACE = 'Backspace',
  /** The Mac generates the "Delete" value when Fn is pressed in tandem with Delete. */
  DELETE = 'Delete',
  INSERT = 'Insert'
}
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#function_keys
 */
declare enum FunctionKeys {
  F1 = 'F1',
  F2 = 'F2',
  F3 = 'F3',
  F4 = 'F4',
  F5 = 'F5',
  F6 = 'F6',
  F7 = 'F7',
  F8 = 'F8',
  F9 = 'F9',
  F10 = 'F10',
  F12 = 'F12',
  F13 = 'F13',
  F14 = 'F14',
  F15 = 'F15',
  F16 = 'F16',
  F17 = 'F17',
  F18 = 'F18',
  F19 = 'F19',
  F20 = 'F20'
}

declare enum KeyboardEventType {
  KEY_DOWN = 'keydown',
  KEY_UP = 'keyup'
}

export {
  EditingKeys,
  FunctionKeys,
  KeyboardEventType,
  Kuaio,
  ModifierKeys,
  NavigationKeys,
  WhitespaceKeys,
  keyEqualTo
}
