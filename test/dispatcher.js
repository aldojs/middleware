
'use strict'

const assert = require('assert')
const { createDispatcher } = require('../lib')

const NOOP = () => {}

const wait = (ms) => new Promise((ok) => setTimeout(ok, ms))


describe('test the middleware dispatcher', () => {
  describe('dispatcher.use(fn)', () => {
    it('should push middlewares in the list', () => {
      let fns = new Array()
      let dispatcher = createDispatcher(fns)

      dispatcher.use(NOOP).use(NOOP)

      assert.equal(fns.length, 2)
      assert.equal(fns[0], NOOP)
      assert.equal(fns[1], NOOP)
    })

    it('should throw if middleware is not a function', () => {
      let dispatcher = createDispatcher()

      assert.throws(() => {
        dispatcher.use([])
      })

      assert.throws(() => {
        dispatcher.use({})
      })

      assert.throws(() => {
        dispatcher.use(123)
      })

      assert.throws(() => {
        dispatcher.use(null)
      })

      assert.throws(() => {
        dispatcher.use(true)
      })

      assert.throws(() => {
        dispatcher.use('foo')
      })

      assert.throws(() => {
        dispatcher.use(undefined)
      })
    })
  })

  describe('dispatcher.dispatch(input)', () => {
    it('should return the middleware output', () => {
      let dispatcher = createDispatcher([
        (next) => (o) => next(o) + 'bar'
      ])

      dispatcher.setHandler((input) => input)

      assert.equal(dispatcher.dispatch('foo'), 'foobar')
    })

    it('should return the middleware output - async', async () => {
      let dispatcher = createDispatcher([
        (next) => async (_) => {
          await wait(2)
          let r = await next(_)
          return r.toLowerCase()
        },
        (next) => async (_) => {
          await wait(1)
          let r = await next(_)
          return r.toUpperCase()
        }
      ])

      dispatcher.setHandler(() => 'foo')

      assert.equal(await dispatcher.dispatch({}), 'foo')
    })

    it('should throw the error', () => {
      let dispatcher = createDispatcher([
        (next) => next,
        () => () => { throw new Error('KO') }
      ])

      dispatcher.setHandler(() => assert.fail('should not be called'))

      assert.throws(() => dispatcher.dispatch({}))
    })

    it('should throw the error - async', async () => {
      let dispatcher = createDispatcher([
        (next) => async (_) => {
          await wait(3)
          return next()
        },
        () => async () => {
          throw new Error('KO')
        }
      ])

      dispatcher.setHandler(() => assert.fail('should not be called'))

      try {
        await dispatcher.dispatch({})
        assert.fail('should throw the error')
      } catch (error) {
        assert.equal(error.message, 'KO')
      }
    })

    it('should work with zero middleware', () => {
      let dispatcher = createDispatcher()

      assert.equal(dispatcher.dispatch({}), undefined)
    })

    it('should keep the input', async () => {
      let obj = {}
      let dispatcher = createDispatcher()

      dispatcher.use((next) => (input) => {
        assert.strictEqual(input, obj)
        return next(input)
      })

      dispatcher.setHandler(() => 'abc')

      assert.equal(dispatcher.dispatch(obj), 'abc')
    })

    it('should catch downstream errors', async () => {
      let dispatcher = createDispatcher([
        (next) => async () => {
          try {
            return next()
          } catch (error) {
            return 'OK'
          }
        },
        () => () => {
          throw new Error('KO')
        }
      ])

      dispatcher.setHandler(() => assert.fail('should not be called'))

      assert.equal(await dispatcher.dispatch({}), 'OK')
    })
  })
})
