
/**
 * Middleware function
 */
export type MiddlewareFunction<T> = (input: T, next: () => any) => any

/**
 * Middleware object with a `process` method having the same signature 
 * as the middleware function
 */
export interface MiddlewareObject<T> {
  process: MiddlewareFunction<T>
}

export type Middleware<T> = MiddlewareFunction<T> | MiddlewareObject<T>

/**
 * Middleware dispatcher class
 * 
 * Register middlewares, and dispatch the given inputs to them
 */
export class Dispatcher<T> {
  /**
   * The middleware stack
   * 
   * @private
   */
  private _middlewares: Middleware<T>[]

  /**
   * Initialize a new dispatcher instance
   * 
   * @param stack The middleware stack
   * @constructor
   * @public
   */
  public constructor (stack = []) {
    this._middlewares = stack
  }

  /**
   * Use a middleware
   * 
   * @param mw The middleware
   * @public
   */
  public use (mw: Middleware<T>): this {
    // TODO: ensure the middleware is valid
    this._middlewares.push(mw)
    return this
  }

  /**
   * Dispatch the given input to middlewares
   * 
   * @param input The value to dispatch
   * @public
   */
  public dispatch (input: T): any {
    return this._dispatch(0, input)
  }

  /**
   * Invoke the current middleware
   * 
   * @param index The curren middleware index
   * @param input The value to dispatch
   * @private
   */
  private _dispatch (index: number, input: T): any {
    let mw = this._middlewares[index]

    if (mw) return this._invoke(mw, input, () => {
      return this._dispatch(index + 1, input)
    })
  }

  /**
   * Invoke the middleware and return the result
   * 
   * @param mw The middleware
   * @param input The value to dispatch
   * @private
   */
  private _invoke (mw: Middleware<T>, input: T, next: () => any): any {
    return (typeof mw === 'function') ? mw(input, next) : mw.process(input, next)
  }
}
