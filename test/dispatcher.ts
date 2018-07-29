
import 'mocha'
import * as assert from 'assert'
import { Dispatcher } from '../src/dispatcher'

const NOOP = () => {}

function wait (ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

describe('test the middleware dispatcher', () => {
  describe('dispatcher.use(fn)', () => {
    it('should push middlewares in the stack', () => {
      let stack = new Array()
      let obj = { process: NOOP }
      let dispatcher = new Dispatcher(stack)

      dispatcher.use(NOOP)
      dispatcher.use(obj)

      assert.equal(stack.length, 2)
      assert.equal(stack[0], NOOP)
      assert.equal(stack[1], obj)
    })
  })

  describe('dispatcher.dispatch(input)', () => {
    it('should return the middleware output', () => {
      let dispatcher = new Dispatcher([
        { process: (_: any, next: any) => next() },
        (_: any, next: any) => next(),
        () => 'foo'
      ])

      assert.equal(dispatcher.dispatch({}), 'foo')
    })

    it('should return the middleware output - async', async () => {
      let dispatcher = new Dispatcher([
        {
          process: async (_: any, next: any) => {
            await wait(2)
            return next()
          }
        },
        async (_: any, next: any) => {
          await wait(1)
          return next()
        },
        () => 'foo'
      ])

      assert.equal(await dispatcher.dispatch({}), 'foo')
    })

    it('should throw the error', () => {
      let dispatcher = new Dispatcher([
        (_: any, next: any) => next(),
        { 
          process () {
            throw new Error('KO')
          }
        },
        () => 'foobar'
      ])

      assert.throws(() => dispatcher.dispatch({}))
    })

    it('should throw the error - async', async () => {
      let dispatcher = new Dispatcher([
        async (_: any, next: any) => {
          await wait(3)
          return next()
        },
        { 
          async process () {
            throw new Error('KO')
          }
        },
        () => 'foobar'
      ])

      try {
        await dispatcher.dispatch({})
        assert.fail('should throw the error')
      } catch (error) {
        assert.equal(error.message, 'KO')
      }
    })

    it('should work with zero middleware', () => {
      let dispatcher = new Dispatcher()

      assert.equal(dispatcher.dispatch({}), undefined)
    })

    it('should keep the context', async () => {
      let obj = {}
      let dispatcher = new Dispatcher([
        {
          process: (ctx: any, next: any) => {
            assert.strictEqual(ctx, obj)
            return next()
          }
        },
        (ctx: any, next: any) => {
          assert.strictEqual(ctx, obj)
          return 'abc'
        }
      ])

      assert.equal(dispatcher.dispatch(obj), 'abc')
    })

    it('should catch downstream errors', async () => {
      let dispatcher = new Dispatcher([
        async (ctx, next) => {
          try {
            return next()
          } catch (error) {
            return 'OK'
          }
        },
        () => {
          throw new Error('KO')
        }
      ])

      assert.equal(await dispatcher.dispatch({}), 'OK')
    })
  })
})
