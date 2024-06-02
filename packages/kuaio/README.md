# Kuaio

A modern shortcut JavaScript library.

**Note: This library is under development, please do not use it in a production environment.**

## Getting Started

### Browser Support

TODO

### Installation

```shell
npm install kuaio
```

or

```shell
yarn add kuaio
```

or

```shell
pnpm add kuaio
```

### Quick Start

```javascript
import Kuaio from 'kuaio'

// Chain call
Kuaio.create()
  .Ctrl()
  .A()
  .on((e) => {
    console.log('Ctrl + a', e)
  })

// Use string definition
Kuaio.on('Ctrl + a', (e) => {
  console.log('Ctrl + a', e)
})
```

## Usage

### Create Instance

There are two ways to create an instance:

1\. **[Recommend] Create via the `create` method.**

```javascript
// 1. Create a global instance.
const instance = Kuaio.create()
```

```javascript
// 2. Create a instance on the specified element.
const target = document.querySelector('#input')
const instance = Kuaio.create(target)
```

```javascript
// 3. Use configuration.
const config = {
  preventDefault: true,
  stopPropagation: true
}
const instance = Kuaio.create(config)
// const instance = Kuaio.create(target, config)
```

2\. **Create via the `new` operator.**

```javascript
const target = document
const config = {}
const instance = new Kuaio(target, config)
```

### Create Listener

There are two ways to create an listener:

1\. **Chain Call**

```javascript
Kuaio.create()
  .Ctrl()
  .A()
  .on((e) => {
    console.log('Ctrl + a', e)
  })
```

2\. **String Definition**

Created through the static method `Kuaio.on`.

```javascript
Kuaio.on('Ctrl + a', (e) => {
  console.log('Ctrl + a', e)
})
```

> NOTE: `Kuaio.on('Ctrl + A')` will not work, you may need to read [TODO](#TODO).

### Trigger

#### Single Key

Kuaio provides built-in methods for efficient key selection from the standard US keyboard. When these methods are called, the specified key, excluding modifier keys, will serve as the trigger.

```javascript
// General keys
Kuaio.create()
  .A()
  .on((e) => {})
// Function keys
Kuaio.create()
  .F1()
  .on((e) => {})
// Whitespace keys
Kuaio.create()
  .Enter()
  .on((e) => {})
// Navigation keys
Kuaio.create()
  .PageDown()
  .on((e) => {})
// Editing keys
Kuaio.create()
  .Backspace()
  .on((e) => {})
// UI keys
Kuaio.create()
  .Escape()
  .on((e) => {})
```

In addition, you can also use the `key` method to specify the trigger key, but it must be a valid value of [KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key).

You can easily get it with [JavaScript Key Code Event Tool](https://www.toptal.com/developers/keycode).

```javascript
Kuaio.create()
  .key('a')
  .on((e) => {})
```

> NOTE: You can use this method to set a modifier key as a trigger key, but this is not recommended.

#### Key Combination

Use a combination of modifier keys (`Ctrl`, `Shift`, etc.) with other trigger keys as triggers.

1\. **Chain Call**

```javascript
// 1. Use built-in modifier methods.
Kuaio.create()
  .Ctrl()
  .A()
  .on((e) => {
    console.log('Ctrl + a', e)
  })

Kuaio.create()
  .Ctrl()
  .Alt()
  .A()
  .on((e) => {
    console.log('Ctrl + Alt + a', e)
  })
```

```javascript
// 2. Use the method `modifier` to specify modifiers.
Kuaio.create()
  .modifier('Shift')
  .A()
  .on((e) => {
    console.log('Shift + a', e)
  })
```

> NOTE: You can use this method to set a trigger key as a modifier key, but this is not recommended.

2\. **String Definition**

```javascript
Kuaio.on('Ctrl + a', (e) => {
  console.log('Ctrl + a', e)
})
Kuaio.on('Ctrl + Alt + a', (e) => {
  console.log('Ctrl + Alt + a', e)
})
```

#### Sequence

You can define an sequence containing `Single Key` or `Key Combination` as a trigger, which will be triggered when the keyboard is pressed in a specified order. In fact this can also be called a key combination, but it is more powerful.

1\. **Chain Call**

```javascript
Kuaio.create()
  .Q()
  // Set timeout. Pressing the next key within this time will continue listening to the sequence, otherwise it will stop.
  .after(1000)
  .W()
  .after()
  .E()
  .after()
  .R()
  .on((e) => {
    console.log('q, w, e, r', e)
  })

Kuaio.create()
  .prventDefault()
  .Ctrl()
  .K()
  .after()
  .Ctrl()
  .C()
  .on((e) => {
    console.log('Ctrl + k, Ctrl + c', e)
  })
```

2\. **String Definition**

```javascript
Kuaio.on('q, w, e, r', (e) => {
  console.log('q, w, e, r', e)
})

Kuaio.on(
  'Ctrl + k, Ctrl + c',
  (e) => {
    console.log('Ctrl + k, Ctrl + c', e)
  },
  {
    preventDefault: true
  }
)
```

### Keyboard Layout and Glyph Modifiers

TODO

![US Layout](https://www.w3.org/TR/uievents-code/images/keyboard-101-us.svg)
