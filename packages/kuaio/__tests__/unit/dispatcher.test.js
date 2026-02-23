import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { dispatchSequence } from '../../src/core/dispatcher'
import { KuaioCombination, KuaioSequence } from '../../src/core/sequence'
import { CombinationModifierKeys, ModifierKeys } from '../../src/enums'
import Kuaio from '../../src/core/index'
import qwerty from '../../src/core/layout/presets/qwerty/index'

// Helper: collect keydown and keyup events dispatched on a target element
function collectEvents(target) {
  const events = []
  target.addEventListener('keydown', (e) => events.push(e))
  target.addEventListener('keyup', (e) => events.push(e))
  return events
}

// Helper: build a KuaioSequence from descriptors [{ key, modifiers?, timeout? }]
function buildSequence(items) {
  const seq = new KuaioSequence()
  for (const item of items) {
    const combo = new KuaioCombination()
    combo.key = item.key
    if (item.modifiers) combo.modifiers = item.modifiers
    if (item.timeout !== undefined) combo.timeout = item.timeout
    seq.push(combo)
  }
  return seq
}

// ============================================================
// Part 1: dispatchSequence 函数单元测试
// ============================================================
describe('dispatchSequence', () => {
  let target
  let events

  beforeEach(() => {
    target = document.createElement('div')
    events = collectEvents(target)
  })

  // --- 1. target 参数校验 ---
  describe('parameter validation', () => {
    it('should throw when target is null', async () => {
      const seq = buildSequence([{ key: 'a' }])
      await expect(
        dispatchSequence({ target: null, sequence: seq })
      ).rejects.toThrow('Parameter [target] must be an EventTarget')
    })

    it('should throw when target is undefined', async () => {
      const seq = buildSequence([{ key: 'a' }])
      await expect(
        dispatchSequence({ target: undefined, sequence: seq })
      ).rejects.toThrow('Parameter [target] must be an EventTarget')
    })

    it('should throw when target has no dispatchEvent method', async () => {
      const seq = buildSequence([{ key: 'a' }])
      await expect(
        dispatchSequence({ target: {}, sequence: seq })
      ).rejects.toThrow('Parameter [target] must be an EventTarget')
    })
  })

  // --- 2. 空序列不派发任何事件 ---
  describe('empty sequence', () => {
    it('should complete without dispatching any events', async () => {
      const seq = new KuaioSequence()
      await dispatchSequence({ target, sequence: seq })
      expect(events).toHaveLength(0)
    })
  })

  // --- 3. 单组合键派发（无修饰键） ---
  describe('single combination without modifiers', () => {
    it('should dispatch keydown and keyup with correct key', async () => {
      const seq = buildSequence([{ key: 'a' }])
      await dispatchSequence({ target, sequence: seq })

      expect(events).toHaveLength(2)
      expect(events[0].type).toBe('keydown')
      expect(events[0].key).toBe('a')
      expect(events[1].type).toBe('keyup')
      expect(events[1].key).toBe('a')
    })

    it('should have all modifier states as false', async () => {
      const seq = buildSequence([{ key: 'a' }])
      await dispatchSequence({ target, sequence: seq })

      const e = events[0]
      expect(e.ctrlKey).toBe(false)
      expect(e.shiftKey).toBe(false)
      expect(e.altKey).toBe(false)
      expect(e.metaKey).toBe(false)
    })
  })

  // --- 4. 单组合键派发（带修饰键状态） ---
  describe('single combination with modifiers', () => {
    it('should set ctrlKey when Control modifier is present', async () => {
      const seq = buildSequence([{
        key: 'a',
        modifiers: [CombinationModifierKeys.Control]
      }])
      await dispatchSequence({ target, sequence: seq })

      expect(events[0].ctrlKey).toBe(true)
      expect(events[0].shiftKey).toBe(false)
      expect(events[0].altKey).toBe(false)
      expect(events[0].metaKey).toBe(false)
    })

    it('should set multiple modifiers simultaneously', async () => {
      const seq = buildSequence([{
        key: 'a',
        modifiers: [CombinationModifierKeys.Control, CombinationModifierKeys.Shift]
      }])
      await dispatchSequence({ target, sequence: seq })

      expect(events[0].ctrlKey).toBe(true)
      expect(events[0].shiftKey).toBe(true)
      expect(events[0].altKey).toBe(false)
      expect(events[0].metaKey).toBe(false)
    })
  })

  // --- 5. 多组合序列按顺序派发 ---
  describe('multi-combination sequence', () => {
    it('should dispatch events in order: keydown(a) keyup(a) keydown(b) keyup(b)', async () => {
      const seq = buildSequence([{ key: 'a' }, { key: 'b' }])
      await dispatchSequence({ target, sequence: seq })

      expect(events).toHaveLength(4)
      expect(events[0].type).toBe('keydown')
      expect(events[0].key).toBe('a')
      expect(events[1].type).toBe('keyup')
      expect(events[1].key).toBe('a')
      expect(events[2].type).toBe('keydown')
      expect(events[2].key).toBe('b')
      expect(events[3].type).toBe('keyup')
      expect(events[3].key).toBe('b')
    })
  })

  // --- 6. key 为 undefined 时跳过派发 ---
  describe('combination with undefined key', () => {
    it('should not dispatch events but still wait for timeout', async () => {
      const seq = buildSequence([{ key: undefined }])
      await dispatchSequence({ target, sequence: seq })

      expect(events).toHaveLength(0)
    })
  })

  // --- 7. 组合间的延迟（timeout）行为 ---
  describe('timeout behavior', () => {
    it('should use baseTimeout default of 200ms', async () => {
      vi.useFakeTimers()
      const seq = buildSequence([{ key: 'a' }, { key: 'b' }])
      const promise = dispatchSequence({ target, sequence: seq })

      // 199ms 时第一组 keydown+keyup 已同步派发，sleep 尚未结束
      await vi.advanceTimersByTimeAsync(199)
      expect(events).toHaveLength(2)

      // 200ms 时 sleep 结束，第二组事件派发
      await vi.advanceTimersByTimeAsync(1)
      expect(events).toHaveLength(4)

      await vi.advanceTimersByTimeAsync(200)
      await promise
      vi.useRealTimers()
    })

    it('should use combination timeout over baseTimeout', async () => {
      vi.useFakeTimers()
      const seq = buildSequence([
        { key: 'a', timeout: 500 },
        { key: 'b' }
      ])
      const promise = dispatchSequence({ target, sequence: seq })

      // 200ms 时组合自定义 timeout=500 未到，第二组尚未派发
      await vi.advanceTimersByTimeAsync(200)
      expect(events).toHaveLength(2)

      // 500ms 时自定义 timeout 到期，第二组事件派发
      await vi.advanceTimersByTimeAsync(300)
      expect(events).toHaveLength(4)

      await vi.advanceTimersByTimeAsync(200)
      await promise
      vi.useRealTimers()
    })

    it('should respect custom baseTimeout', async () => {
      vi.useFakeTimers()
      const seq = buildSequence([{ key: 'a' }, { key: 'b' }])
      const promise = dispatchSequence({ target, sequence: seq, baseTimeout: 100 })

      await vi.advanceTimersByTimeAsync(99)
      expect(events).toHaveLength(2)

      await vi.advanceTimersByTimeAsync(1)
      expect(events).toHaveLength(4)

      await vi.advanceTimersByTimeAsync(100)
      await promise
      vi.useRealTimers()
    })
  })

  // --- 8. 修饰键状态映射完整性 ---
  describe('modifier state mapping completeness', () => {
    it('should set all four combination modifier keys', async () => {
      const seq = buildSequence([{
        key: 'a',
        modifiers: [
          CombinationModifierKeys.Control,
          CombinationModifierKeys.Shift,
          CombinationModifierKeys.Alt,
          CombinationModifierKeys.Meta
        ]
      }])
      await dispatchSequence({ target, sequence: seq })

      const e = events[0]
      expect(e.ctrlKey).toBe(true)
      expect(e.shiftKey).toBe(true)
      expect(e.altKey).toBe(true)
      expect(e.metaKey).toBe(true)
    })

    it('should set lock modifier keys (CapsLock, NumLock, ScrollLock, AltGraph)', async () => {
      const seq = buildSequence([{
        key: 'a',
        modifiers: [
          ModifierKeys.CapsLock,
          ModifierKeys.AltGraph,
          ModifierKeys.NumLock,
          ModifierKeys.ScrollLock
        ]
      }])
      await dispatchSequence({ target, sequence: seq })

      const e = events[0]
      // 锁定修饰键通过 getModifierState() 查询
      expect(e.getModifierState('CapsLock')).toBe(true)
      expect(e.getModifierState('AltGraph')).toBe(true)
      expect(e.getModifierState('NumLock')).toBe(true)
      expect(e.getModifierState('ScrollLock')).toBe(true)
      // 组合修饰键应为 false
      expect(e.ctrlKey).toBe(false)
      expect(e.shiftKey).toBe(false)
      expect(e.altKey).toBe(false)
      expect(e.metaKey).toBe(false)
    })
  })
})

// ============================================================
// Part 2: 通过 Kuaio 链式 API 调用 dispatchFirst / dispatchAny
// ============================================================
describe('Kuaio dispatch API', () => {
  let target
  let events

  beforeEach(() => {
    Kuaio.registryLayout(qwerty)
    target = document.createElement('div')
    events = collectEvents(target)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // --- 9. dispatchFirst 派发单键 / 带修饰键 ---
  describe('dispatchFirst - basic', () => {
    it('should dispatch keydown and keyup for a single key', async () => {
      const k = Kuaio.create(target, {}).A()
      const promise = k.dispatchFirst()
      await vi.advanceTimersByTimeAsync(200)
      await promise

      expect(events).toHaveLength(2)
      expect(events[0].type).toBe('keydown')
      expect(events[0].key).toBe('a')
      expect(events[1].type).toBe('keyup')
      expect(events[1].key).toBe('a')
    })

    it('should dispatch with correct modifier state via chain API', async () => {
      const k = Kuaio.create(target, {}).Control().A()
      const promise = k.dispatchFirst()
      await vi.advanceTimersByTimeAsync(200)
      await promise

      expect(events).toHaveLength(2)
      expect(events[0].key).toBe('a')
      expect(events[0].ctrlKey).toBe(true)
      expect(events[0].shiftKey).toBe(false)
    })
  })

  // --- 10. dispatchFirst 在多序列（or）中只派发第一个 ---
  describe('dispatchFirst - multiple sequences', () => {
    it('should only dispatch the first sequence', async () => {
      const k = Kuaio.create(target, {}).A().or().B()
      const promise = k.dispatchFirst()
      await vi.advanceTimersByTimeAsync(200)
      await promise

      expect(events).toHaveLength(2)
      expect(events[0].key).toBe('a')
      expect(events[1].key).toBe('a')
    })
  })

  // --- 11. dispatchAny 通过 picker 选择指定序列派发 ---
  describe('dispatchAny - pick specific sequence', () => {
    it('should dispatch only the second sequence when picker selects index 1', async () => {
      const k = Kuaio.create(target, {}).A().or().B()
      const promise = k.dispatchAny((seq, i) => i === 1)
      await vi.advanceTimersByTimeAsync(200)
      await promise

      expect(events).toHaveLength(2)
      expect(events[0].key).toBe('b')
      expect(events[1].key).toBe('b')
    })
  })

  // --- 12. dispatchAny picker 返回 true 时派发所有序列 ---
  describe('dispatchAny - pick all sequences', () => {
    it('should dispatch all sequences when picker always returns true', async () => {
      const k = Kuaio.create(target, {}).A().or().B()
      const promise = k.dispatchAny(() => true)
      await vi.advanceTimersByTimeAsync(400)
      await promise

      expect(events).toHaveLength(4)
      expect(events[0].key).toBe('a')
      expect(events[1].key).toBe('a')
      expect(events[2].key).toBe('b')
      expect(events[3].key).toBe('b')
    })
  })

  // --- 13. dispatchAny picker 参数校验与空序列校验 ---
  describe('dispatchAny - parameter validation', () => {
    it('should throw when picker is not a function', async () => {
      const k = Kuaio.create(target, {}).A()
      await expect(k.dispatchAny('not a function')).rejects.toThrow(
        'Parameter [picker] must be a function.'
      )
    })

    it('should throw when sequence list is empty', async () => {
      const k = Kuaio.create(target, {})
      await expect(k.dispatchAny(() => true)).rejects.toThrow(
        'No sequence to dispatch.'
      )
    })
  })

  // --- 14. dispatchFirst 派发多步序列（after 链式构建） ---
  describe('dispatchFirst - multi-step sequence with after()', () => {
    it('should dispatch both steps of a sequence built with after()', async () => {
      const k = Kuaio.create(target, {}).A().after().B()
      const promise = k.dispatchFirst()
      await vi.advanceTimersByTimeAsync(400)
      await promise

      expect(events).toHaveLength(4)
      expect(events[0].type).toBe('keydown')
      expect(events[2].type).toBe('keydown')
      expect(events[2].key).toBe('b')
      expect(events[3].type).toBe('keyup')
      expect(events[3].key).toBe('b')
    })
  })
})

// ============================================================
// Part 3: dispatch 派发事件后触发 listener 回调的集成测试
// ============================================================
describe('dispatch triggers listener callback', () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  beforeEach(() => {
    Kuaio.registryLayout(qwerty)
  })

  // --- 15. 派发匹配的单键触发回调 ---
  describe('single key dispatch triggers callback', () => {
    it('should trigger callback when dispatched key matches bound key', async () => {
      const callback = vi.fn()
      const target = document.createElement('div')
      const k = Kuaio.create(target, { disableGlyphHandler: true }).A()
      k.on(callback)
      await k.dispatchFirst()
      // 等待 listener 内部异步逻辑（getCachedLayout）完成
      await sleep(0)

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback.mock.calls[0][0].key).toBe('a')
      k.off()
    })
  })

  // --- 16. 派发匹配的修饰键组合触发回调 ---
  describe('modifier combination dispatch triggers callback', () => {
    it('should trigger callback for Control+A combination', async () => {
      const callback = vi.fn()
      const target = document.createElement('div')
      const k = Kuaio.create(target, { disableGlyphHandler: true }).Control().A()
      k.on(callback)
      await k.dispatchFirst()
      await sleep(0)

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback.mock.calls[0][0].ctrlKey).toBe(true)
      expect(callback.mock.calls[0][0].key).toBe('a')
      k.off()
    })

    it('should trigger callback for Control+Shift+A combination', async () => {
      const callback = vi.fn()
      const target = document.createElement('div')
      const k = Kuaio.create(target, { disableGlyphHandler: true }).Control().Shift().A()
      k.on(callback)
      await k.dispatchFirst()
      await sleep(0)

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback.mock.calls[0][0].ctrlKey).toBe(true)
      expect(callback.mock.calls[0][0].shiftKey).toBe(true)
      k.off()
    })
  })

  // --- 17. 派发不匹配的键或修饰键不触发回调 ---
  describe('non-matching dispatch does not trigger callback', () => {
    it('should NOT trigger callback when dispatched key differs from bound key', async () => {
      const callback = vi.fn()
      const target = document.createElement('div')
      const listener = Kuaio.create(target, { disableGlyphHandler: true }).A()
      listener.on(callback)

      // 绑定 A 但派发 B，不应触发
      const dispatcher = Kuaio.create(target, {}).B()
      await dispatcher.dispatchFirst()
      await sleep(0)

      expect(callback).not.toHaveBeenCalled()
      listener.off()
    })

    it('should NOT trigger callback when dispatched modifiers differ from bound modifiers', async () => {
      const callback = vi.fn()
      const target = document.createElement('div')
      const listener = Kuaio.create(target, { disableGlyphHandler: true }).Control().A()
      listener.on(callback)

      // 绑定 Control+A 但只派发 A（缺少 Control），不应触发
      const dispatcher = Kuaio.create(target, {}).A()
      await dispatcher.dispatchFirst()
      await sleep(0)

      expect(callback).not.toHaveBeenCalled()
      listener.off()
    })
  })

  // --- 18. 多序列绑定（or）中派发任一匹配序列触发回调 ---
  describe('or-bound sequences dispatch', () => {
    it('should trigger callback when dispatched key matches one of the bound sequences', async () => {
      const callback = vi.fn()
      const target = document.createElement('div')
      const listener = Kuaio.create(target, { disableGlyphHandler: true }).A().or().B()
      listener.on(callback)

      // 绑定 A | B，派发 B，应匹配第二个序列
      const dispatcher = Kuaio.create(target, {}).B()
      await dispatcher.dispatchFirst()
      await sleep(0)

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback.mock.calls[0][0].key).toBe('b')
      listener.off()
    })
  })

  // --- 19. 多步序列（after）完整派发触发回调 ---
  describe('multi-step sequence (after) dispatch', () => {
    it('should trigger callback when full sequence A then B is dispatched', async () => {
      const callback = vi.fn()
      const target = document.createElement('div')
      const listener = Kuaio.create(target, { disableGlyphHandler: true }).A().after().B()
      listener.on(callback)

      const dispatcher = Kuaio.create(target, {}).A().after().B()
      await dispatcher.dispatchFirst()
      await sleep(0)

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback.mock.calls[0][0].key).toBe('b')
      listener.off()
    })

    it('should NOT trigger callback when only the first step of the sequence is dispatched', async () => {
      const callback = vi.fn()
      const target = document.createElement('div')
      const listener = Kuaio.create(target, { disableGlyphHandler: true }).A().after().B()
      listener.on(callback)

      // 绑定 A→B 但只派发 A，序列不完整，不应触发
      const dispatcher = Kuaio.create(target, {}).A()
      await dispatcher.dispatchFirst()
      await sleep(0)

      expect(callback).not.toHaveBeenCalled()
      listener.off()
    })
  })

  // --- 20. off() 解绑后派发不再触发回调 ---
  describe('off() prevents further callbacks', () => {
    it('should NOT trigger callback when dispatching after off() has been called', async () => {
      const callback = vi.fn()
      const target = document.createElement('div')
      const k = Kuaio.create(target, { disableGlyphHandler: true }).A()
      k.on(callback)
      k.off()

      const dispatcher = Kuaio.create(target, {}).A()
      await dispatcher.dispatchFirst()
      await sleep(0)

      expect(callback).not.toHaveBeenCalled()
    })
  })
})