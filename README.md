
A middleware disptcher for Node.js applications.
It provides a clean way to register and invoke a chain of middleware functions.

To use it, simply install the package using `npm` or `yarn` (not tested)

```sh
npm add @aldojs/middleware
```

Then, create a new `Dispatcher` instance

```js
let { Dispatcher } = require('@aldojs/middleware')

let dispatcher = new Dispatcher()
```

Registering middlewares could be done using the `use` method

```js
dispatcher.use(function middleware () { return 123 })
```

To dispatch some input data to the middleware chain, and await the result, you may use the `dispatch` method

```js
let result = await dispatcher.dispatch({ input: 'foobar' })
```

Each middleware should return an output value or a `Promise`
