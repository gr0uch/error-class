var assert = require('assert')
var t = require('tapdance')
var errorClass = require('./')

var fooError, FooError, instance

t.comment('wrong argument')
t.fail(function () { errorClass(1234) }, 'argument must be string')

fooError = errorClass('FooError')
FooError = errorClass('FooError')

t.comment('new constructor')

try { throw Error('omg') }
catch (error) { instance = new FooError(error.message) }

checkInstance(instance, FooError)


t.comment('no constructor')

try { throw Error('omg') }
catch (error) { instance = fooError(error.message) }
checkInstance(instance, fooError)


function checkInstance (instance, errorConstructor) {
  t.pass(function () {
    assert(instance instanceof errorConstructor)
  }, 'instanceof operator works')

  t.pass(function () {
    assert(instance instanceof Error)
  }, 'instanceof error')

  t.pass(function () {
    assert(instance.constructor === errorConstructor)
  }, 'constructor is correct')

  t.pass(function () {
    assert(instance.constructor.name === 'FooError')
  }, 'constructor name is correct')

  t.pass(function () {
    assert(instance.name === 'FooError')
  }, 'name is correct')

  t.pass(function () {
    assert(instance.message === 'omg')
  }, 'message is correct')

  t.pass(function () {
    assert(!instance.hasOwnProperty('name'))
  }, 'name isn\'t property')

  t.pass(function () {
    assert(instance.hasOwnProperty('message'))
  }, 'message is property')

  t.pass(function () {
    assert(instance.hasOwnProperty('stack'))
  }, 'stack is property')

  t.pass(function () {
    assert(~instance.stack.indexOf('FooError'))
  }, 'stack trace contains name')

  t.pass(function () {
    assert(!Object.keys(instance).length)
  }, 'properties not enumerable')
}
