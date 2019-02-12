
'use strict'

const assert = require('assert')
const { Dispatcher } = require('./dispatcher')


/**
 * Middleware dispatcher
 */
exports.Dispatcher = Dispatcher

/**
 * Initialize a new dispatcher instance
 * 
 * @param {function[]} [fns] 
 * @throws if the given argument is not an array of functions
 */
exports.createDispatcher = function (fns = []) {
  _ensureMiddleware(fns)

  return new Dispatcher(fns)
}

/**
 * Compose multiple middlewares
 * 
 * @param {function[]} fns 
 * @throws if the given argument is not an array of functions
 */
exports.compose = function (fns) {
  _ensureMiddleware(fns)

  return (value, next) => {
    let i = 0

    function dispatch () {
      let fn = fns[i++]

      if (fn) return fn(value, dispatch)

      if (next) return next()
    }

    return dispatch()
  }
}

/**
 * Ensure the argument is a valid middleware stack.
 * 
 * @param {function[]} fns 
 * @private
 */
function _ensureMiddleware (fns) {
  assert(Array.isArray(fns), `Only an array of function is allowed.`)

  for (let fn of fns) {
    assert.equal(typeof fn, 'function', `Only a function is allowed as middleware.`)
  }
}
