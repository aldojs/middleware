
A middleware dispatcher and composer for Node.js applications.
It provides a clean way to register and invoke a chain of middleware functions.

## Install

```sh
npm add @aldojs/middleware
```

## Dispatcher

To create a new `Dispatcher` instance, you may use `createDispatcher` utility:

```js
let { createDispatcher } = require('@aldojs/middleware')

let dispatcher = createDispatcher()
```

Registering middlewares can be done using `Dispatcher::use` method

```js
dispatcher.use(function middleware () { return 123 })
```

To dispatch some input data to the middleware chain, and await the result, you may use the `Dispatcher::dispatch` method

```js
let result = await dispatcher.dispatch({ input: 'foobar' })
```

> `Dispatcher::dispatch` accepts any input, not only objects.

## Middleware

Each middleware could return any output value including promises.

Whether a middleware runs before or after a downstream middlewares depends on the middleware itself.
For example, the following middleware would perform some task before the others

```js
dispatcher.use((input, next) => {
  // Perform task

  return next()
})
```

However, this middleware would perform its task after the input is handled by the following middlewares

```js
dispatcher.use(async (input, next) => {
  let result = await next()

  // Perform the task

  return result
})
```

## Compose

Composing multiple middleware to make a single handler is easy using the `compose` utility:

```js
const { compose } = require('@aldojs/middleware')

let middleware = compose([
  someMiddleware,
  AnotherMiddleware,
  WhyNotAThirdMiddleware
])
```
