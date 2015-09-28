// Memoize these results, they're basically invariants.
var hasCaptureStackTrace = 'captureStackTrace' in Error
var hasSetPrototypeOf = 'setPrototypeOf' in Object


module.exports = function errorClass (name, fn) {
  if (!name || typeof name !== 'string')
    throw TypeError('Argument "name" must be a non-empty string.')

  // This is basically `eval`, there's no other way to dynamically define a
  // function name.
  var ErrorClass = Function('setupError', 'fn',
    'return function ' + name + ' () { ' +
    'if (!(this instanceof ' + name + ')) ' +
    'return new (' + name + '.bind.apply(' + name +
      ', Array.prototype.concat.apply([ null ], arguments))); ' +
    'setupError.apply(this, arguments); ' +
    (fn ? 'fn.apply(this, arguments); ' : '') +
    '}')(setupError, fn)

  ErrorClass.prototype = Object.create(Error.prototype, {
    constructor: nonEnumerableProperty(ErrorClass),
    name: nonEnumerableProperty(name)
  })

  // The `setPrototypeOf` method is part of ES6.
  if (hasSetPrototypeOf) Object.setPrototypeOf(ErrorClass, Error)
  else ErrorClass.__proto__ = Error

  return ErrorClass
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

  // Use the `+` operator with an empty string to implicitly type cast the
  // `message` argument into a string.
  Object.defineProperty(this, 'message',
    nonEnumerableProperty(message !== undefined ? '' + message : ''))
}


function nonEnumerableProperty (value) {
  // The field `enumerable` is `false` by default.
  return {
    value: value,
    writable: true,
    configurable: true
  }
}
