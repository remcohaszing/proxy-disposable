/**
 * @typedef LegacyDisposable
 *   An object that has a `dispose` method.
 * @property {() => unknown} dispose
 *   Dispose the resource.
 */

/**
 * @template {LegacyDisposable} D
 *   The type of the disposable to wrap.
 * @typedef {D & Readonly<Disposable & AsyncDisposable>} ProxiedDisposable
 *   A legacy disposable that’s wrapped as an ES6 disposable.
 */

/**
 * Turn a `Symbol.dispose` or `Symbol.asyncDispose` key into `'dispose'`.
 *
 * @param {PropertyKey} propertyKey
 *   The property to process.
 * @returns {PropertyKey}
 *   `'dispose'` if the key if `Symbol.dispose` or `Symbol.asyncDispose`. Otherwise the input.
 */
function toDisposableKey(propertyKey) {
  return propertyKey === Symbol.dispose || propertyKey === Symbol.asyncDispose
    ? 'dispose'
    : propertyKey
}

/**
 * Wrap an object with a `dispose` method as an ES6 disposable.
 *
 * @template {LegacyDisposable} D
 *   The type of the input disposable.
 * @param {D} disposable
 *   The disposable to wrap.
 * @returns {ProxiedDisposable<D>}
 *   The input disposable as an ES6 disposable.
 */
export function d(disposable) {
  return /** @type {ProxiedDisposable<D>} */ (
    new Proxy(disposable, {
      get(target, propertyKey, receiver) {
        return Reflect.get(target, toDisposableKey(propertyKey), receiver)
      },

      getOwnPropertyDescriptor(target, propertyKey) {
        return Reflect.getOwnPropertyDescriptor(target, toDisposableKey(propertyKey))
      },

      has(target, propertyKey) {
        return Reflect.has(target, toDisposableKey(propertyKey))
      },

      ownKeys(target) {
        const keys = Reflect.ownKeys(target)
        keys.push(Symbol.asyncDispose, Symbol.dispose)
        return keys
      }
    })
  )
}
