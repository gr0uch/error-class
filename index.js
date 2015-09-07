// Memoize these results, they're basically invariants.
var hasCaptureStackTrace = 'captureStackTrace' in Error
var hasSetPrototypeOf = 'setPrototypeOf' in Object

// Invalid JavaScript identifiers.
var invalidName = /[^0-9a-zA-Z_$]/


module.exports = function errorClass (name, fn) {
  if (!name || typeof name !== 'string')
    throw TypeError('Argument "name" must be a non-empty string.')

  if (invalidName.test(name))
    throw Error('Argument "name" is an invalid identifier.')

  // This is basically `eval`, there's no other way to dynamically define a
  // function name.
  var error = Function('setupError', 'fn',
    'return function ' + name + ' () { ' +
    'if (!(this instanceof ' + name + ')) ' +
    'return new (' + name + '.bind.apply(' + name +
      ', Array.prototype.concat.apply([ null ], arguments))); ' +
    'setupError.apply(this, arguments); ' +
    (fn ? 'fn.apply(this, arguments); ' : '') +
    '}')(setupError, fn)

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
    nonEnumerableProperty(message !== undefined ? '' + message : ''))
}


function nonEnumerableProperty (value) {
  return {
    value: value,
    enumerable: false,
    writable: true,
    configurable: true
  }
}
