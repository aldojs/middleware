
'use strict'

const NOOP = () => {}

/**
 * Compose multiple middlewares
 * 
 * @param {Function[]} fns 
 * @throws if the given argument is not an array of functions
 */
exports.compose = function (fns) {
  if (! Array.isArray(fns)) {
    throw new TypeError(`Expect an array, but got "${typeof fns}"`)
  }

  if (fns.length === 0) return NOOP

  for (let fn of fns) {
    if (typeof fn !== 'function') {
      throw new TypeError(`Expect a function, but got "${typeof fn}"`)
    }
  }

  return fns.reverse().reduce((a, b) => b(a))
}
