'use strict'

var hasCaptureStackTrace = 'captureStackTrace' in Error

module.exports = errorClass


function errorClass (name) {
  var ErrorClass

  if (!name || typeof name !== 'string')
    throw new TypeError('Argument "name" must be a non-empty string.')

  // This is basically `eval`, there's no other way to dynamically define a
  // function name.
  ErrorClass = function CustomError () {
    if (!(this instanceof CustomError))
      return new (CustomError.bind.apply(CustomError,
        Array.prototype.concat.apply([ null ], arguments)))
    setupError.apply(this, arguments)
  }

  ErrorClass.prototype = Object.create(Error.prototype, {
    constructor: nonEnumerableProperty(ErrorClass),
    name: nonEnumerableProperty(name)
  })

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
    nonEnumerableProperty(message !== void 0 ? '' + message : ''))
}


function nonEnumerableProperty (value) {
  // The field `enumerable` is `false` by default.
  return {
    value: value,
    writable: true,
    configurable: true
  }
}
