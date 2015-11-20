# Error Class

[![Build Status](https://img.shields.io/travis/0x8890/error-class/master.svg?style=flat-square)](https://travis-ci.org/0x8890/error-class)
[![npm Version](https://img.shields.io/npm/v/error-class.svg?style=flat-square)](https://www.npmjs.com/package/error-class)
[![License](https://img.shields.io/npm/l/error-class.svg?style=flat-square)](https://raw.githubusercontent.com/0x8890/error-class/master/LICENSE)

This module provides typed errors that closely emulate the native `Error` class to a pedantic degree.

```
$ npm install error-class
```


## Usage

The default export is a function that accepts only one argument, the name of the typed error.

```js
var errorClass = require('error-class')

var SpecialError = errorClass('SpecialError')

var instance = new SpecialError('foobar')
instance.message // 'foobar'
```


## Details

```js
import errorClass from 'error-class'

const HumanError = errorClass('HumanError')

const hungryError = new HumanError(`I'm hungry!`)
hungryError.name // 'HumanError'
hungryError.message // `I'm hungry!`
hungryError.stack // Platform-specific error stack trace.
hungryError.hasOwnProperty('name') // false (!)
hungryError.hasOwnProperty('message') // true
hungryError.hasOwnProperty('stack') // true


// Just like native errors, it doesn't require using `new`.
const thirstyError = HumanError(`I'm thirsty!`)
Object.keys(thirstyError).length === 0 // True, all properties are non-enumerable.
Object.keys(Object.getPrototypeOf(instance)).length === 0 // Prototype non-enumerable.
thirstyError.constructor === HumanError // True.
thirstyError.constructor.name === 'HumanError' // True.
thirstyError instanceof Error // True, errors inherit from native `Error` class.
thirstyError instanceof HumanError // Also true, of course.
```


## License

This software is licensed under the [MIT License](//github.com/0x8890/error-class/blob/master/LICENSE).
