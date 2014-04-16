# fixtures-fs

[![build status][build-png]][build]
<!--
    [![Coverage Status][cover-png]][cover]
    [![Davis Dependency status][dep-png]][dep]
-->

<!-- [![NPM][npm-png]][npm] -->

<!-- [![browser support][test-png]][test] -->

Create a temporary fs with JSON fixtures

## Example

```js
var withFixtures = require('fixtures-fs');
var test = require('tape');
var path = require('path');

var myNpmVerify = ...

/*
  this test wants a directory set up with some mock data
  then do asserts against the directory with some code.

  withFixtures creates the file system before your test and 
  tears it down after your test is done.
*/
test('something something npm', withFixtures(__dirname, {
  foo: {
    'package.json': JSON.stringify({
      name: 'foo',
      version: 'bar',
      dependecies: { foobaz: '~1.0.0' }
    }),
    'npm-shrinkwrap.json': JSON.stringify({
      name: 'foo',
      version: 'bar',
      dependencies: {
        foobaz: {
          version: '3.0.0',
          resolved: 'http://npm.registry.org/foobaz/foobaz-3.0.0.tgz'
        }
      }
    })
  }
}, function (assert) {
  myNpmVerify(path.join(__dirname, 'foo'), function (err) {
    assert.equal(err.message, 'shrinkwrap is wrong.');

    assert.end();
  });
}));
```

### example with mocha

```js
var withFixtures = require('fixtures-fs');
var suite = require('mocha').suite;
var test = require('mocha').it;
var assert = require('assert');
var path = require('path');

var myNpmVerify = ...

suite('test npm stuff', function () {
  test('something something npm', withFixtures(__dirname, {
    ...
  }, function (end) {
    myNpmVerify(path.join(__dirname, 'foo'), function (err) {
      assert.equal(err.message, 'shrinkwrap is wrong.');

      end();
    });
  }));
});
```

## Docs

### `var func = withFixtures(dirname, fixtures, lambda, opts={})`

```ocaml
fixtures-fs := (
    dirname: String,
    fixtures: Fixture, 
    lambda: (EndCallback<T>) => void,
    opts?: FsMock
) => (EndCallback<T>) => void
```

`withFixtures` takes a `dirname`, an object of `fixtures` 
  and an async `lambda` function

It will run create a file system matching your `fixtures` 
  before calling your async `lambda` function and tear down
  the file system once the `lambda` finishes.

You can invoke the returned `func` with a callback or an object
 with an `.end()` method.

#### `dirname`

This is the directory the `fixtures` will be written into.

If this directory does not exist, it will be created.

#### `fixtures`

```ocaml
fixtures := Object<String, String | Fixture>
```

The `fixtures` object has key value pairs where the key is the
  directory or file name and the value is either a string content
  of the file or another object that is the content of a directory

#### `lambda`

```ocaml
lambda := (Callback<Error, T> | Object & {
    end: Callback<Error, T>
}) => void
```

The `lambda` should be an async function that takes either a 
  callback or an object with an `.end(err=null)` method. This
  callback / `.end()` method is intercepted and `withFixtures`
  will cleanup the file system before it completes.

#### `opts`

```ocaml
opts := { fs: Object, mkdirp: Function, rimraf: Function }
```

You can pass an optional `opts` object to customize the file
  system functions that `withFixtures` uses. This is useful if
  you want to `withFixtures` to write to a non-standard file
  system like a browser file system, a remote file system or
  an in memory file system.

#### `func`

The `func` result of the `withFixtures()` call can be passed
  directly into the `test()` function of `tape` or the `test()`
  function of `mocha`.

When you call `func` with either a callback or object with an
  `.end()` method argument it will create the fixtures, invoke
  the `lambda`, tear down the fixtures and then invoke either
  the callback or `.end()` method.

## Installation

`npm install fixtures-fs`

## Tests

`npm test`

## Contributors

 - Raynos

## MIT Licenced

  [build-png]: https://secure.travis-ci.org/Raynos/fixtures-fs.png
  [build]: https://travis-ci.org/Raynos/fixtures-fs
  [cover-png]: https://coveralls.io/repos/Raynos/fixtures-fs/badge.png
  [cover]: https://coveralls.io/r/Raynos/fixtures-fs
  [dep-png]: https://david-dm.org/Raynos/fixtures-fs.png
  [dep]: https://david-dm.org/Raynos/fixtures-fs
  [npm-png]: https://ci.testling.com/Raynos/fixtures-fs.png
  [npm]: https://ci.testling.com/Raynos/fixtures-fs
  [test-png]: https://nodei.co/npm/fixtures-fs.png?stars&downloads
  [test]: https://nodei.co/npm/fixtures-fs
