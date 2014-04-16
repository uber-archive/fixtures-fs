var test = require('tape');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');

var withFixtures = require('../index.js');
var createFixtures = require('../create-fixtures.js');
var teardownFixtures = require('../teardown-fixtures.js');

var FOO_PATH = path.join(__dirname, 'foo');
var BAR_PATH = path.join(__dirname, 'bar');
var BAZ_PATH = path.join(__dirname, 'bar', 'baz');

test('create temporary file system', function (assert) {
    assert.equal(fs.existsSync(FOO_PATH), false);
    assert.equal(fs.existsSync(BAR_PATH), false);
    assert.equal(fs.existsSync(BAZ_PATH), false);

    withFixtures(__dirname, {
        'foo': 'bar',
        'bar': {
            'baz': 'foobar'
        }
    }, function (callback) {
        assert.equal(fs.existsSync(FOO_PATH), true);
        assert.equal(fs.existsSync(BAR_PATH), true);
        assert.equal(fs.existsSync(BAZ_PATH), true);

        process.nextTick(callback);
    })(function (err) {
        assert.ifError(err);

        assert.equal(fs.existsSync(FOO_PATH), false);
        assert.equal(fs.existsSync(BAR_PATH), false);
        assert.equal(fs.existsSync(BAZ_PATH), false);

        assert.end();
    });
});

test('create folders', function (assert) {
    createFixtures(__dirname, {
        'foo': 'bar',
        'bar': {
            'baz': 'foobar'
        }
    }, function (err) {
        assert.ifError(err);

        assert.equal(fs.readFileSync(FOO_PATH, 'utf8'), 'bar');
        assert.equal(fs.statSync(BAR_PATH).isDirectory(), true);
        assert.equal(fs.readFileSync(BAZ_PATH, 'utf8'), 'foobar');

        rimraf.sync(FOO_PATH);
        rimraf.sync(BAR_PATH);

        assert.end();
    });
});

test('removes folders', function (assert) {
    fs.writeFileSync(FOO_PATH, 'bar', 'utf8');
    fs.mkdirSync(BAR_PATH);
    fs.writeFileSync(BAZ_PATH, 'foobar', 'utf8');

    assert.equal(fs.existsSync(FOO_PATH), true);
    assert.equal(fs.existsSync(BAR_PATH), true);
    assert.equal(fs.existsSync(BAZ_PATH), true);

    teardownFixtures(__dirname, {
        'foo': 'bar',
        'bar': {
            'baz': 'foobar'
        }
    }, function (err) {
        assert.ifError(err);

        assert.equal(fs.existsSync(FOO_PATH), false);
        assert.equal(fs.existsSync(BAR_PATH), false);
        assert.equal(fs.existsSync(BAZ_PATH), false);

        assert.end();
    });
});
