
'use strict'

exports.Dispatcher = class {
  /**
   * 
   * @param {function[]} fns 
   */
  constructor (fns) {
    this._middlewares = fns
  }

  /**
   * Use a middleware
   * 
   * @param {function} fn The middleware function
   * @throws `TypeError` if the given middleware is not a function
   * @public
   */
  use (fn) {
    if (typeof fn !== 'function') {
      throw new TypeError(`Only a function is allowed as middleware.`)
    }

    this._middlewares.push(fn)

    return this
  }

  /**
   * Dispatch the given input to middlewares
   * 
   * @param {any} value The middleware input data
   * @public
   */
  dispatch (value) {
    return this._dispatch(0, value)
  }

  /**
   * Invoke the current middleware.
   * 
   * @param {number} i The current middleware index
   * @param {any} value The value to dispatch
   * @private
   */
  _dispatch (i, value) {
    let fn = this._middlewares[i]

    if (fn) return fn(value, () => this._dispatch(i + 1, value))
  }
}
