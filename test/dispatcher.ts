
import 'mocha'
import * as assert from 'assert'
import { Dispatcher } from '../src/dispatcher'

const NOOP = () => {}

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

    it('should throw the error', () => {
      let dispatcher = new Dispatcher([
        (_: any, next: any) => next(),
        { 
          process: () => {
            throw new Error('KO')
          }
        },
        () => 'foobar'
      ])

      assert.throws(() => dispatcher.dispatch({}))
    })
  })
})
