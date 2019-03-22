
'use strict'

const { compose } = require('./composer')

const NOOP = () => {}

/**
 * 
 */
exports.Dispatcher = class {
  /**
   * 
   * @param {function[]} fns 
   */
  constructor (fns) {
    this._handler = NOOP
    this._middlewares = fns
  }

  /**
   * Use a middleware
   * 
   * @param {function} middleware 
   * @throws if the given middleware is not a function
   * @public
   */
  use (middleware) {
    if (typeof middleware !== 'function') {
      throw new TypeError(`Only a function is allowed as middleware.`)
    }

    this._middlewares.push(middleware)

    return this
  }

  /**
   * Set the default handler
   * 
   * @param {Function} fn 
   * @public
   */
  setHandler (fn) {
    this._handler = compose(this._middlewares.concat(fn))

    return this
  }

  /**
   * Dispatch the given input to middlewares
   * 
   * @param {any} value The input value to dispatch.
   * @public
   */
  dispatch (value) {
    return this._handler.call(null, value)
  }
}
