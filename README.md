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
var fixturesFs = require("fixtures-fs");

/* withFixtures takes a hash of file fixtures and a task to
    execute.

    It then ensures the fixtures exists in the file system,
        runs the task and then removes the fixtures.

    When it's done with the task it will call the callback.

    ```js
    var test = require('mocha').test;
    var assert = require('assert');
    var configChain = require('config-chain');

    test('run some test', withFixtures(__dirname, {
        json: {
            'config.json': '{ "port": 3000, "awesome": true }',
            'test.json': '{ "port": 4000 }'
        }
    }, function (end) {
        var config = configChain(
            './json/' + process.env.NODE_ENV + '.json',
            './json/config.json'
        );

        assert.equal(config.port, 4000);
        assert.equal(config.awesome, true);

        end();
    }));
    ```

    `withFixtures` is very useful to use with writing integration
        tests. It allows you to declare a file system as a simple
        object and then run a test case against it knowing that
        it will be cleaned up after the test case finishes.

    Notice the usage of the `__dirname` to tell `withFixtures`
        where the folders are local to. In this case the dirname
        of the test file, but it can be set to `process.cwd()` or
        `os.tmpDir()` or whatever location you want.

*/

// TODO. Show example
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
