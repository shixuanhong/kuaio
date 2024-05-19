# Kuaio

A modern shortcut JavaScript library.

 **Note: This library is under development, please do not use it in a production environment.**

## Introduction



### Installation

TODO

### Quick Start




## Usage

### Create Instance

There are two ways to create an instance:

1. **[Recommend] Create via the `create` method**

``` javascript
// 1. Create a listener globally.
const instance = Kuaio.create()
```

``` javascript
// 2. Create a listener on the specified element.
const target = document.querySelector('#input')
const instance = Kuaio.create(target)
```

```javascript
// 3. Use configuration.
const config = {
  preventDefault: true,
  stopPropagation: true,
}
const instance = Kuaio.create(config)
// const instance = Kuaio.create(target, config)
```
2. **Create via the `new` operator**

``` javascript
const target = document
const config = {}
const instance = new Kuaio(target, config)
```

### Single Trigger Key

Kuaio provides built-in methods for efficient key selection from the standard US keyboard. When these methods are called, the specified key, excluding modifier keys, will serve as the trigger key.

```javascript
// General keys
Kuaio.create().A().bind(e => { 
})
// Function keys
Kuaio.create().F1().bind(e => { 
})
// Whitespace keys
Kuaio.create().Enter().bind(e => { 
})
// Navigation keys
Kuaio.create().PageDown().bind(e => { 
})
// Editing keys
Kuaio.create().Backspace().bind(e => { 
})
// UI keys
Kuaio.create().Escape().bind(e => { 
})
```

In addition, we can also use the `key` method to specify the trigger key.

``` javascript
Kuaio.create().key('a').bind((e) => {})
```

> Note:  You can use this method to set a modifier key as a trigger key, but this is not recommended. 

### Key Combination



### Keyboard Layout and Glyph Modifiers



![US Layout](https://www.w3.org/TR/uievents-code/images/keyboard-101-us.svg)
