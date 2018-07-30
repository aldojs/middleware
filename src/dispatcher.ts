
/**
 * Middleware function
 */
export type Middleware<T> = (input: T, next: () => any) => any

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
    // TODO: ensures the stack is an array of functions
    this._middlewares = stack
  }

  /**
   * Use a middleware
   * 
   * @param fn The middleware function
   * @throws `TypeError` if the given middleware is not a function
   * @public
   */
  public use (fn: Middleware<T>): this {
    if (typeof fn !== 'function') {
      throw new TypeError(`Only a function is allowed as middleware`)
    }

    this._middlewares.push(fn)
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
   * @param i The curren middleware index
   * @param input The value to dispatch
   * @private
   */
  private _dispatch (i: number, input: T): any {
    let fn = this._middlewares[i]

    if (fn) return fn(input, () => this._dispatch(i + 1, input))
  }
}
