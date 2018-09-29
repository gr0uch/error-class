var run = require('tapdance')
var errorClass = require('./')

var fooError, FooError, instance

run(function (assert, comment) {
  comment('wrong argument')
  try { errorClass(1234) }
  catch (e) { assert(true, 'argument must be string') }

  fooError = errorClass('FooError')
  FooError = errorClass('FooError')

  comment('new constructor')
  try { throw Error('omg') }
  catch (error) { instance = new FooError(error.message) }
  checkInstance(instance, FooError)

  comment('no constructor')
  try { throw Error('omg') }
  catch (error) { instance = fooError(error.message) }
  checkInstance(instance, fooError)

  function checkInstance (instance, errorConstructor) {
    assert(instance instanceof errorConstructor, 'instanceof operator works')
    assert(instance instanceof Error, 'instanceof error')
    assert(instance.constructor === errorConstructor, 'constructor is correct')
    assert(instance.name === 'FooError', 'name is correct')
    assert(instance.message === 'omg', 'message is correct')
    assert(!instance.hasOwnProperty('name'), 'name isn\'t property')
    assert(instance.hasOwnProperty('message'), 'message is property')
    assert(instance.hasOwnProperty('stack'), 'stack is property')
    assert(~instance.stack.indexOf('FooError'), 'stack trace contains name')
    assert(!Object.keys(instance).length, 'properties not enumerable')
  }
})
