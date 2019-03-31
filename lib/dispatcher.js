
'use strict'

const { compose } = require('./composer')

const NOOP = () => {}


exports.Dispatcher = class {
  /**
   * 
   * @param {Function[]} fns 
   */
  constructor (fns) {
    this._handler = NOOP
    this._middlewares = fns
  }

  /**
   * Use a middleware
   * 
   * @param {Function} middleware 
   * @throws if the given middleware is not a function
   * @public
   */
  use (middleware) {
    if (typeof middleware !== 'function') {
      throw new TypeError(`Expect a function, but got "${typeof middleware}".`)
    }

    this._middlewares.push(middleware)

    return this
  }

  /**
   * Set the default handler
   * 
   * @param {Function} fn 
   * @throws if the given handler is not a function
   * @public
   */
  setHandler (fn) {
    if (typeof fn !== 'function') {
      throw new TypeError(`Expect a function, but got "${typeof fn}".`)
    }

    this._handler = compose(this._middlewares.concat(fn))

    return this
  }

  /**
   * Dispatch the given input to middlewares
   * 
   * @param {Any} value The input value to dispatch.
   * @public
   */
  dispatch (value) {
    return this._handler.call(null, value)
  }
}
