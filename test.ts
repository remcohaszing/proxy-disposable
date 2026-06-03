import assert from 'node:assert/strict'
import { test } from 'node:test'
import { setTimeout } from 'node:timers/promises'

import { d } from 'proxy-disposable'

test('using', () => {
  let disposed = false

  {
    using disposable = d({
      dispose() {
        disposed = true
      }
    })
  }

  assert.ok(disposed)
})

test('await using', async () => {
  const order: string[] = []

  {
    await using disposable = d({
      async dispose() {
        order.push('before await')
        // Force the next tick.
        await setTimeout(0)
        order.push('after await')
      }
    })
  }
  order.push('after dispose')

  assert.deepEqual(order, ['before await', 'after await', 'after dispose'])
})

test('property access', () => {
  const disposable = d({
    dispose() {
      // Do nothing
    },

    property: 'value'
  })

  assert.equal(disposable.property, 'value')
})

test('getOwnPropertyDescriptor', () => {
  const disposable = d({
    dispose() {
      // Do nothing
    },
    property: 'value'
  })

  const descriptor = Object.getOwnPropertyDescriptor(disposable, 'dispose')
  assert.deepEqual(Object.getOwnPropertyDescriptor(disposable, Symbol.dispose), descriptor)
  assert.deepEqual(Object.getOwnPropertyDescriptor(disposable, Symbol.asyncDispose), descriptor)
  assert.notDeepEqual(Object.getOwnPropertyDescriptor(disposable, 'property'), descriptor)
})

test('has', () => {
  const disposable = d({
    dispose() {
      // Do nothing
    },
    property: 'value'
  })

  assert.ok('dispose' in disposable)
  assert.ok(Symbol.dispose in disposable)
  assert.ok(Symbol.asyncDispose in disposable)
  assert.ok('property' in disposable)
})

test('ownKeys', () => {
  const disposable = d({
    dispose() {
      // Do nothing
    },
    property: 'value'
  })

  assert.deepEqual(Reflect.ownKeys(disposable), [
    'dispose',
    'property',
    Symbol.asyncDispose,
    Symbol.dispose
  ])
})
