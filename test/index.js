var test = require('tape')
var errorClass = require('../lib')


test('wrong argument', function (t) {
  t.throws(function () { errorClass(1234) }, 'argument must be string')
  t.end()
})


test('new constructor', function (t) {
  var FooError = errorClass('FooError')
  var instance

  try {
    throw Error('omg')
  }
  catch (error) {
    instance = new FooError(error.message)
  }

  t.ok(instance instanceof FooError, 'instanceof operator works')
  t.ok(instance instanceof Error, 'instanceof error')
  t.ok(instance.constructor === FooError, 'constructor is correct')
  t.equal(instance.name, 'FooError', 'name is correct')
  t.equal(instance.message, 'omg', 'message is correct')
  t.ok(!instance.hasOwnProperty('name'), 'name isn\'t property')
  t.ok(instance.hasOwnProperty('message'), 'message is property')
  t.ok(instance.hasOwnProperty('stack'), 'stack is property')
  t.ok(~instance.stack.indexOf('FooError'), 'stack trace contains name')
  t.ok(!Object.keys(instance).length, 'properties not enumerable')
  t.end()
})


test('no constructor', function (t) {
  var fooError = errorClass('FooError')
  var instance

  try {
    throw Error('omg')
  }
  catch (error) {
    instance = fooError(error.message)
  }

  t.ok(instance instanceof fooError, 'instanceof operator works')
  t.ok(instance instanceof Error, 'instanceof error')
  t.ok(instance.constructor === fooError, 'constructor is correct')
  t.equal(instance.name, 'FooError', 'name is correct')
  t.equal(instance.message, 'omg', 'message is correct')
  t.ok(!instance.hasOwnProperty('name'), 'name isn\'t property')
  t.ok(instance.hasOwnProperty('message'), 'message is property')
  t.ok(instance.hasOwnProperty('stack'), 'stack is property')
  t.ok(~instance.stack.indexOf('FooError'), 'stack trace contains name')
  t.ok(!Object.keys(instance).length, 'properties not enumerable')
  t.end()
})
