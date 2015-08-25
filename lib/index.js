// Memoize these results, they're basically invariants.
var hasCaptureStackTrace = 'captureStackTrace' in Error
var hasSetPrototypeOf = 'setPrototypeOf' in Object


module.exports = function errorClass (name) {
  if (!name || typeof name !== 'string')
    throw Error('Argument "name" must be a string.')

  // This is basically `eval`, there's no other way to dynamically define a
  // function name.
  var error = Function('setupError',
    'return function ' + name + ' (message) {' +
    'if (!(this instanceof ' + name + ')) return new ' + name + '(message); ' +
    'setupError.call(this, message) }')(setupError)

  error.prototype = Object.create(Error.prototype, {
    constructor: nonEnumerableProperty(error),
    name: nonEnumerableProperty(name)
  })

  if (hasSetPrototypeOf) Object.setPrototypeOf(error, Error)
  else error.__proto__ = Error

  return error
}


// Internal function to set up an error.
function setupError (message) {
  if (hasCaptureStackTrace)
    // V8 specific method.
    Error.captureStackTrace(this, this.constructor)
  else
    // Generic way to set the error stack trace.
    Object.defineProperty(this, 'stack',
      nonEnumerableProperty(Error(message).stack))

  Object.defineProperty(this, 'message',
    nonEnumerableProperty('' + message))
}


function nonEnumerableProperty (value) {
  return {
    value: value,
    enumerable: false,
    writable: true,
    configurable: true
  }
}
