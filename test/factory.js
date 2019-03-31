
'use strict'

let assert = require('assert')
const { createDispatcher, Dispatcher } = require('../lib')


describe('test dispatcher factory', () => {
  describe('createDispatcher()', () => {
    it('should return a dispatcher instance', () => {
      assert.ok(createDispatcher() instanceof Dispatcher)
    })
  })

  describe('createDispatcher(fns)', () => {
    it('should accept an array', () => {
      assert.throws(() => createDispatcher(null))

      assert.throws(() => createDispatcher(true))

      assert.throws(() => createDispatcher('text'))

      assert.throws(() => createDispatcher({}))

      assert.doesNotThrow(() => createDispatcher([]))
    })

    it('should accept an array of functions', () => {
      assert.throws(() => {
        createDispatcher([
          () => {},
          null,
          () => {},
        ])
      })

      assert.doesNotThrow(() => {
        createDispatcher([
          () => {},
          () => {},
          () => {},
        ])
      })
    })
  })
})
