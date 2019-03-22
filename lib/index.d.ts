
/**
 * Compose the given middlewares
 *
 * @param fns An array of middleware functions
 * @public
 */
export declare function compose(fns: Function[]): Handler;

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
   * @throws if the given middleware is not a function
   * @public
   */
  use(fn: Middleware): this;

  /**
   * Set the default handler.
   * 
   * @param fn 
   * @throws if the handler is not a function.
   * @public
   */
  setHandler(fn: Handler);

  /**
   * Dispatch the given input to middlewares
   *
   * @param input The value to dispatch
   * @public
   */
  dispatch(input: any): any;
}

export declare type Middleware = (fn: Handler) => Handler;

export declare type Handler = (input: any) => any;
