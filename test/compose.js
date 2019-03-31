
'use strict'

const assert = require('assert')
const { compose } = require('../lib')


describe('test composition utility', () => {
  describe('compose(fns)', () => {
    it('should return a function', () => {
      assert(typeof compose([]) === 'function')
    })

    it('should only accept an array', () => {
      assert.throws(() => compose(undefined))
      assert.throws(() => compose(null))
      assert.throws(() => compose({}))
      assert.doesNotThrow(() => compose([]))
    })

    it('should only accept an array of functions', () => {
      assert.doesNotThrow(() => compose([
        () => {}, () => {}, () => {}
      ]))

      assert.throws(() => compose([
        () => {}, null, () => {}
      ]))
    })
  })

  describe('compose(fns)(input)', () => {
    it('should work', async () => {
      var fns = [
        (next) => (c) => next(c) - 3,
        (next) => (c) => 2 + next(c),
        ({ n }) => n * 3,
      ]

      assert.equal(await compose(fns)({ n: 1 }), 2)
    })

    it('should work with zero handler', async () => {
      assert.equal(await compose([])({}), undefined)
    })

    it('should reject on errors in a handler', async () => {
      var i = 0
      var fns = [
        (next) => next,
        () => () => { throw new Error('Ooops!') },
        () => assert.fail('should not call this handler')
      ]

      try {
        await compose(fns)({})

        assert.fail('Promise was not rejected')
      } catch (e) {
        assert.equal(e.message, 'Ooops!')
      }
    })
  })
})
