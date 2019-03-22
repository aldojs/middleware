
'use strict'

const { compose } = require('./composer')
const { Dispatcher } = require('./dispatcher')


exports.compose = compose

exports.Dispatcher = Dispatcher

/**
 * Initialize a new dispatcher instance
 * 
 * @param {Function} fn 
 * @throws if the given argument is not a function.
 */
exprots.createDispatcher = function (fns = []) {
  if (! Array.isArray(fns)) {
    throw new TypeError(`Expect an array but got "${typeof fns}"`)
  }

  for (let fn of fns) {
    if (typeof fn !== 'function') {
      throw new TypeError(`Expect a function but got "${typeof fn}"`)
    }
  }

  return new Dispatcher(fns)
}
