
import { Dispatcher } from './dispatcher'

/**
 * Create a new dispatcher
 * 
 * @param stack 
 * @public
 */
export function createDispatcher (stack = []) {
  return new Dispatcher(stack)
}
