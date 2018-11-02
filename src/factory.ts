
import { Dispatcher } from './dispatcher'

/**
 * Create a new dispatcher
 * 
 * @param stack 
 * @public
 */
export function createDispatcher<T> (stack = []): Dispatcher<T> {
  return new Dispatcher(stack)
}
