# fixtures-fs

<!--
    [![build status][build-png]][build]
    [![Coverage Status][cover-png]][cover]
    [![Davis Dependency status][dep-png]][dep]
-->

<!-- [![NPM][npm-png]][npm] -->

<!-- [![browser support][test-png]][test] -->

Create a temporary fs with JSON fixtures

## Example

```js
var withFixtures = require("fixtures-fs");
var test = require('tape')

/*
  this test wants a directory set up with some mock data
  then do asserts against the directory with some code.

  withFixtures creates the file system before your test and 
  tears it down after your test is done.
*/
test('something something npm', withFixtures(__dirname, {
  'foo': {
    'package.json': JSON.stringify({
      name: 'foo',
      version: 'bar',
      dependecies: { 'foobaz': '~1.0.0' }
    }),
    'npm-shrinkwrap.json': JSON.stringify({
      name: 'foo',
      version: 'bar',
      dependencies: {
        'foobaz': {
          version: '3.0.0',
          resolved: 'http://npm.registry.org/foobaz/foobaz-3.0.0.tgz'
        }
      }
    })
  }
}, function (assert) {
  myNpmVerify(path.join(__dirname, 'foo'), function (err) {
    assert.equal(err.message, 'shrinkwrap is wrong.')

    assert.end()
  })
}))
```

## Docs

### `var someValue = fixturesFs(/*arguments*/)`

<!--
  This is a jsig notation of your interface.
  https://github.com/Raynos/jsig
-->
```ocaml
fixtures-fs := (arg: Any) => void
```

// TODO. State what the module does.

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
