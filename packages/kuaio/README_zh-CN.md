# Kuaio

**一个现代的用于创建快捷键的 JavaScript 库。**

[中文](https://github.com/shixuanhong/kuaio/blob/main/packages/kuaio/README_zh-CN.md) | [English](https://github.com/shixuanhong/kuaio/blob/main/packages/kuaio/README.md)

> Note: 该库正在开发中，请勿在生产环境中使用。

<p align="left">
  <a href="https://npmjs.com/package/kuaio"><img src="https://img.shields.io/npm/v/kuaio" alt="npm package"></a>
</p>

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

// 链式调用 - 推荐方式
Kuaio.createSync().Control().A().on((event) => {
  console.log('Ctrl+A 按下!', event)
})

// 字符串定义
Kuaio.createSync().define('Control+A').on((event) => {
  console.log('Ctrl+A 按下!', event)
})

// 程序化派发事件
Kuaio.createSync().define('Escape').dispatchFirst()
```

## 使用方法

### 创建实例

有两种方式可以用于创建实例:

1\. **[推荐] 通过工厂方法创建**

```javascript
// 异步创建，自动检测键盘布局
const kuaio = await Kuaio.create()

// 同步创建，使用默认布局 (qwerty)
const kuaio = Kuaio.createSync()

// 为所有新实例设置默认布局
// Kuaio.setDefaultLayout(myLayout)

// 同步创建，指定布局
const kuaio = Kuaio.createSync(document, {}, myLayout)

// 为指定目标创建
const kuaio = await Kuaio.create(document.body)

// 使用配置创建
const config = { preventDefault: true }
const kuaio = await Kuaio.create(config)

// 为指定目标和配置创建
const kuaio = await Kuaio.create(document.body, config)
```

2\. **通过 `new` 操作符创建**

> 注意：不推荐直接使用构造函数。请使用工厂方法 {@link Kuaio.create} 和 {@link Kuaio.createSync}。

```javascript
// 必需参数
const target = document // 接收键盘监听器的事件目标
const config = {} // 覆盖全局默认值的实例级配置

// 可选参数
const layout = myLayout // 可选的键盘布局。如果省略则回退到默认布局

// 直接构造函数使用（不推荐）
const kuaio = new Kuaio(target, config, layout)

// 构造函数签名
new Kuaio(target: EventTarget, config: Partial<KuaioConfig>, layout?: KuaioLayout)
```

### 创建侦听器

有两种方式可以用于创建侦听器:

1\. **链式调用**

```javascript
Kuaio.createSync().Control().A().on((event) => {
  console.log('Ctrl+A 按下!', event)
})
```

2\. **字符串定义**

```javascript
Kuaio.createSync().define('Control+A').on((event) => {
  console.log('Ctrl+A 按下!', event)
})

// 多个替代序列
Kuaio.createSync().define('Control+A', 'Meta+A').on((event) => {
  console.log('Ctrl+A 或 Cmd+A 按下!', event)
})
```

### 触发器

#### 单键触发

Kuaio 提供了内置方法，可以高效地选择按键。当调用这些方法时，指定的键将作为触发器。

```javascript
// 逻辑键 (A-Z)
Kuaio.createSync().A().on((event) => console.log('A 按下!', event))

// 物理键码
Kuaio.createSync().KeyA().on((event) => console.log('KeyA 按下!', event))

// 功能键
Kuaio.createSync().F1().on((event) => console.log('F1 按下!', event))

// 特殊键
Kuaio.createSync().Enter().on((event) => console.log('Enter 按下!', event))
Kuaio.createSync().Escape().on((event) => console.log('Escape 按下!', event))
Kuaio.createSync().Backspace().on((event) => console.log('Backspace 按下!', event))
```

你也可以使用通用的 `key` 方法:

```javascript
Kuaio.createSync().key('A').on((event) => console.log('A 按下!', event))
Kuaio.createSync().key({ code: 'Enter', matchMode: 'code' }).on((event) => console.log('Enter 按下!', event))
```

#### 组合键

使用修饰键与其他触发键的组合:

1\. **链式调用**

```javascript
// 基础组合
Kuaio.createSync().Control().A().on((event) => {
  console.log('Ctrl+A 按下!', event)
})

// 多个修饰键
Kuaio.createSync().Control().Shift().A().on((event) => {
  console.log('Ctrl+Shift+A 按下!', event)
})

// 使用通用修饰键方法
Kuaio.createSync().modifier('Alt').A().on((event) => {
  console.log('Alt+A 按下!', event)
})
```

2\. **字符串定义**

```javascript
Kuaio.createSync().define('Control+A').on((event) => {
  console.log('Ctrl+A 按下!', event)
})

Kuaio.createSync().define('Control+Alt+A').on((event) => {
  console.log('Ctrl+Alt+A 按下!', event)
})
```

#### 序列

定义按顺序按下时触发的键组合序列:

1\. **链式调用**

```javascript
// 简单序列
Kuaio.createSync().Q().after(1000).W().after().E().after().R().on((event) => {
  console.log('Q, W, E, R 序列按下!', event)
})

// 复杂序列与组合键
Kuaio.createSync().preventDefault().Control().K().after().Control().C().on((event) => {
  console.log('Ctrl+K, Ctrl+C 序列按下!', event)
})
```

2\. **字符串定义**

```javascript
// 简单序列
Kuaio.createSync().define('Q,W,E,R').on((event) => {
  console.log('Q, W, E, R 序列按下!', event)
})

// 复杂序列
Kuaio.createSync().define('Control+K,Control+C').on((event) => {
  console.log('Ctrl+K, Ctrl+C 序列按下!', event)
})

// 带配置
Kuaio.createSync({ preventDefault: true }).define('Control+Shift+A').on((event) => {
  console.log('Ctrl+Shift+A 按下!', event)
})
```