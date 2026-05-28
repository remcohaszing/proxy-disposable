import assert from 'node:assert/strict'
import { mock, test } from 'node:test'

import { d } from 'proxy-disposable'

test('Symbol.dispose', () => {
  const m = mock.fn()

  {
    using disposable = d({
      dispose() {
        m()
      }
    })
  }

  assert.equal(m.mock.callCount(), 1)
})

test('Symbol.asyncDispose', async () => {
  const m = mock.fn()

  {
    await using disposable = d({
      dispose() {
        m()
      }
    })
  }

  assert.equal(m.mock.callCount(), 1)
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
