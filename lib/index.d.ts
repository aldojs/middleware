
/**
 * Compose the given middlewares
 *
 * @param fns An array of middleware functions
 * @public
 */
export declare function compose(fns: Middleware[]): Middleware;

/**
 * Initialize a new dispatcher instance
 */
export declare function createDisptcher (fns?: Middleware[]): Dispatcher;

/**
 * Middleware dispatcher
 */
export declare class Dispatcher {
  /**
   * Construct a new instance
   *
   * @param stack The middleware stack
   * @constructor
   * @public
   */
  constructor(stack: Middleware[]);

  /**
   * Use a middleware
   *
   * @param fn The middleware function
   * @throws `TypeError` if the given middleware is not a function
   * @public
   */
  use(fn: Middleware): this;

  /**
   * Dispatch the given input to middlewares
   *
   * @param input The value to dispatch
   * @public
   */
  dispatch(input: any): any;
}

export declare type Middleware = (input: any, next: () => any) => any;
