# Kuaio

**A modern shortcut JavaScript library.**

[中文](https://github.com/shixuanhong/kuaio/blob/main/packages/kuaio/README_zh-CN.md) | [English](https://github.com/shixuanhong/kuaio/blob/main/packages/kuaio/README.md)

> Note: This library is under development, please do not use it in a production environment.

<p align="left">
  <a href="https://npmjs.com/package/kuaio"><img src="https://img.shields.io/npm/v/kuaio" alt="npm package"></a>
</p>

## Features

### 🟦 Basic Features

- **⚡ Chain API** - Intuitive and fluent method chaining
- **📝 String Definition** - Simple string-based shortcut definitions
- **🔄 Sequence Support** - Trigger events only when all defined keys or combinations are pressed in sequence (e.g., `Ctrl+K, Ctrl+C`)
- **⌨️ Modifier Detection** - Full support for modifier keys such as `Alt`, `Ctrl`, `Meta`, `Shift`
- **🎯 Event Control** - Support for event controls such as `preventDefault`, `stopPropagation`
- **🔧 Flexible Binding** - Support for any EventTarget

### 🟨 Advanced Features

- **🎹 Auto Layout Check** - Automatic keyboard layout detection

## Browser Support

| Browser     | Minimum Version | Basic Features  | Auto Layout Check | Status         |
| ----------- | --------------- | --------------- | ----------------- | -------------- |
| **Chrome**  | 69+             | ✅ Full Support | ✅ Full Support   | 🟢 Recommended |
| **Edge**    | 79+             | ✅ Full Support | ✅ Full Support   | 🟢 Recommended |
| **Firefox** | 51+             | ✅ Full Support | ❌ Not Supported  | 🟡 Compatible  |
| **Opera**   | 56+             | ✅ Full Support | ✅ Full Support   | 🟢 Recommended |
| **Safari**  | 10.1+           | ✅ Full Support | ❌ Not Supported  | 🟡 Compatible  |

> **💡 Usage Recommendations**:
>
> - 🟢 Recommended versions: Support all features
> - 🟡 Compatible versions: Support basic features, layout check falls back to default QWERTY or manually register and specify other layouts

## Getting Started

### CDN Usage

You can also use Kuaio via CDN without installing any packages:

#### jsDelivr

```html
<!-- Development version -->
<script src="https://cdn.jsdelivr.net/npm/kuaio@latest/dist/kuaio.umd.js"></script>

<!-- Production version (minified) -->
<script src="https://cdn.jsdelivr.net/npm/kuaio@latest/dist/kuaio.umd.prod.js"></script>
```

#### UNPKG

```html
<!-- Development version -->
<script src="https://unpkg.com/kuaio@latest/dist/kuaio.umd.js"></script>

<!-- Production version (minified) -->
<script src="https://unpkg.com/kuaio@latest/dist/kuaio.umd.prod.js"></script>
```

#### Usage with CDN

```html
<!DOCTYPE html>
<html>
<head>
    <title>Kuaio CDN Example</title>
    <!-- Load Kuaio from CDN -->
    <script src="https://cdn.jsdelivr.net/npm/kuaio@latest/dist/kuaio.umd.prod.js"></script>
</head>
<body>
    <script>
        const { Kuaio } = window.KuaioJS
        Kuaio.createSync()
            .Control()
            .A()
            .on((event) => {
                console.log('Ctrl+A pressed!', event)
            })
    </script>
</body>
</html>
```

### Installation

```shell
# Using npm
npm install kuaio

# Using yarn
yarn add kuaio

# Using pnpm
pnpm add kuaio
```

### Quick Start

```javascript
import { Kuaio } from 'kuaio'

// Chain call - recommended approach
Kuaio.createSync()
  .Control()
  .A()
  .on((event) => {
    console.log('Ctrl+A pressed!', event)
  })

// String-based definition
Kuaio.createSync()
  .define('Control+A')
  .on((event) => {
    console.log('Ctrl+A pressed!', event)
  })

// Dispatch events programmatically
Kuaio.createSync().define('Escape').dispatchFirst()
```

## Usage

### Create Instance

There are two ways to create an instance:

1\. **[Recommended] Create via factory methods**

```javascript
// Async creation with automatic layout detection
const kuaio = await Kuaio.create()

// Sync creation with default layout (qwerty)
const kuaio = Kuaio.createSync()

// Set default layout for all new instances
// Kuaio.setDefaultLayout(myLayout)

// Sync creation with specific layout
const kuaio = Kuaio.createSync(document, {}, myLayout)

// Create with specific target
const kuaio = await Kuaio.create(document.body)

// Create with configuration
const config = { preventDefault: true }
const kuaio = await Kuaio.create(config)

// Create with target and configuration
const kuaio = await Kuaio.create(document.body, config)
```

2\. **Create via the `new` operator**

> Note: Direct constructor usage is not recommended. Use factory methods {@link Kuaio.create} and {@link Kuaio.createSync} instead.

```javascript
// Required parameters
const target = document // EventTarget that receives the keyboard listeners
const config = {} // Instance-level configuration that overrides global defaults

// Optional parameter
const layout = myLayout // Optional keyboard layout. Falls back to default layout if omitted

// Direct constructor usage (not recommended)
const kuaio = new Kuaio(target, config, layout)

// Constructor signature
new Kuaio(target: EventTarget, config: Partial<KuaioConfig>, layout?: KuaioLayout)
```

### Create Listeners

There are two ways to create listeners:

1\. **Chain Call**

```javascript
Kuaio.createSync()
  .Control()
  .A()
  .on((event) => {
    console.log('Ctrl+A pressed!', event)
  })
```

2\. **String Definition**

```javascript
Kuaio.createSync()
  .define('Control+A')
  .on((event) => {
    console.log('Ctrl+A pressed!', event)
  })

// Multiple alternative sequences
Kuaio.createSync()
  .define('Control+A', 'Meta+A')
  .on((event) => {
    console.log('Ctrl+A or Cmd+A pressed!', event)
  })
```

### Trigger

#### Single Key

Kuaio provides built-in methods for efficient key selection. When these methods are called, the specified key will serve as the trigger.

```javascript
// Logical keys (A-Z)
Kuaio.createSync()
  .A()
  .on((event) => console.log('A pressed!', event))

// Physical key codes
Kuaio.createSync()
  .KeyA()
  .on((event) => console.log('KeyA pressed!', event))

// Function keys
Kuaio.createSync()
  .F1()
  .on((event) => console.log('F1 pressed!', event))

// Special keys
Kuaio.createSync()
  .Enter()
  .on((event) => console.log('Enter pressed!', event))
Kuaio.createSync()
  .Escape()
  .on((event) => console.log('Escape pressed!', event))
Kuaio.createSync()
  .Backspace()
  .on((event) => console.log('Backspace pressed!', event))
```

You can also use the generic `key` method:

```javascript
Kuaio.createSync()
  .key('A')
  .on((event) => console.log('A pressed!', event))
Kuaio.createSync()
  .key({ code: 'Enter', matchMode: 'code' })
  .on((event) => console.log('Enter pressed!', event))
```

#### Key Combination

Use a combination of modifier keys with other trigger keys:

1\. **Chain Call**

```javascript
// Basic combination
Kuaio.createSync()
  .Control()
  .A()
  .on((event) => {
    console.log('Ctrl+A pressed!', event)
  })

// Multiple modifiers
Kuaio.createSync()
  .Control()
  .Shift()
  .A()
  .on((event) => {
    console.log('Ctrl+Shift+A pressed!', event)
  })

// Using generic modifier method
Kuaio.createSync()
  .modifier('Alt')
  .A()
  .on((event) => {
    console.log('Alt+A pressed!', event)
  })
```

2\. **String Definition**

```javascript
Kuaio.createSync()
  .define('Control+A')
  .on((event) => {
    console.log('Ctrl+A pressed!', event)
  })

Kuaio.createSync()
  .define('Control+Alt+A')
  .on((event) => {
    console.log('Ctrl+Alt+A pressed!', event)
  })
```

#### Sequence

Define sequences of key combinations that trigger when pressed in order:

1\. **Chain Call**

```javascript
// Simple sequence
Kuaio.createSync()
  .Q()
  .after(1000)
  .W()
  .after()
  .E()
  .after()
  .R()
  .on((event) => {
    console.log('Q, W, E, R sequence pressed!', event)
  })

// Complex sequence with combinations
Kuaio.createSync()
  .preventDefault()
  .Control()
  .K()
  .after()
  .Control()
  .C()
  .on((event) => {
    console.log('Ctrl+K, Ctrl+C sequence pressed!', event)
  })
```

2\. **String Definition**

```javascript
// Simple sequence
Kuaio.createSync()
  .define('Q,W,E,R')
  .on((event) => {
    console.log('Q, W, E, R sequence pressed!', event)
  })

// Complex sequence
Kuaio.createSync()
  .define('Control+K,Control+C')
  .on((event) => {
    console.log('Ctrl+K, Ctrl+C sequence pressed!', event)
  })

// With configuration
Kuaio.createSync({ preventDefault: true })
  .define('Control+Shift+A')
  .on((event) => {
    console.log('Ctrl+Shift+A pressed!', event)
  })
```
