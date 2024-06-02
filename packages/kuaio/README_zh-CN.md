# Kuaio

一个现代的用于创建快捷键的 JavaScript 库。

**Note: 该库正在开发中，请勿在生产环境中使用。**

## 入门

### 浏览器支持

TODO

### 安装

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

### 快速开始

```javascript
import Kuaio from 'kuaio'

// 链式调用
Kuaio.create()
  .Ctrl()
  .A()
  .bind((e) => {
    console.log('Ctrl + a', e)
  })

// 使用字符串定义
Kuaio.on('Ctrl + a', (e) => {
  console.log('Ctrl + a', e)
})
```

## 使用方法

### 创建实例

有两种方式可以用于创建实例:

1\. **[推荐] 通过`create` 方法创建**

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

2\. **通过 `new` 操作符创建**

```javascript
const target = document
const config = {}
const instance = new Kuaio(target, config)
```

### 创建侦听器

有两种方式可以用于创建侦听器:

1\. **链式调用**

```javascript
Kuaio.create()
  .Ctrl()
  .A()
  .bind((e) => {
    console.log('Ctrl + a', e)
  })
```

2\. **字符串定义**

通过静态方法 `Kuaio.on` 创建。

```javascript
Kuaio.on('Ctrl + a', (e) => {
  console.log('Ctrl + a', e)
})
```

> 注意: `Kuaio.on('Ctrl + A')` 不会生效, 你可能需要阅读 [TODO](#TODO).

### 触发器

#### 单键触发

Kuaio 提供了内置方法，可以从标准美式键盘中进行高效的按键选择。 当调用这些方法时，指定的键（不包括修饰键）将作为触发器。

```javascript
// General keys
Kuaio.create()
  .A()
  .bind((e) => {})
// Function keys
Kuaio.create()
  .F1()
  .bind((e) => {})
// Whitespace keys
Kuaio.create()
  .Enter()
  .bind((e) => {})
// Navigation keys
Kuaio.create()
  .PageDown()
  .bind((e) => {})
// Editing keys
Kuaio.create()
  .Backspace()
  .bind((e) => {})
// UI keys
Kuaio.create()
  .Escape()
  .bind((e) => {})
```

另外，你还可以使用`key`方法指定触发键，但必须是 [KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) 的一个有效值.

你可以很轻松的通过这个工具来获取这些值：[JavaScript Key Code Event Tool](https://www.toptal.com/developers/keycode).

```javascript
Kuaio.create()
  .key('a')
  .bind((e) => {})
```

> 注意: 你可以使用这个方法将一个修饰键指定为一个触发键，但这并不推荐。

#### 组合键

你可以使用修饰键和其它触发键的组合来作为触发器

1\. **链式调用**

```javascript
// 1. Use built-in modifier methods.
Kuaio.create()
  .Ctrl()
  .A()
  .bind((e) => {
    console.log('Ctrl + a', e)
  })

Kuaio.create()
  .Ctrl()
  .Alt()
  .A()
  .bind((e) => {
    console.log('Ctrl + Alt + a', e)
  })
```

```javascript
// 2. Use the method `modifier` to specify modifiers.
Kuaio.create()
  .modifier('Shift')
  .A()
  .bind((e) => {
    console.log('Shift + a', e)
  })
```

> 注意: 你可以使用这个方法将一个触发键指定为一个修饰键，但这并不推荐。

2\. **字符串定义**

```javascript
Kuaio.on('Ctrl + a', (e) => {
  console.log('Ctrl + a', e)
})
Kuaio.on('Ctrl + Alt + a', (e) => {
  console.log('Ctrl + Alt + a', e)
})
```

#### 序列

你可以定义一个包含`单键`或`组合键`的序列来作为触发器，当按指定顺序按下键盘时将触发该序列。其实这也是一种组合键，但是功能更强大。

1\. **链式调用**

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
  .bind((e) => {
    console.log('q, w, e, r', e)
  })

Kuaio.create()
  .prventDefault()
  .Ctrl()
  .K()
  .after()
  .Ctrl()
  .C()
  .bind((e) => {
    console.log('Ctrl + k, Ctrl + c', e)
  })
```

2\. **字符串定义**

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

### 键盘布局和字形修饰符

TODO

![US Layout](https://www.w3.org/TR/uievents-code/images/keyboard-101-us.svg)
