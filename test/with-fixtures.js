var test = require('tape');
var FakeFs = require('fake-fs');
var path = require('path');

var withFixtures = require('../index.js');

var FOO_PATH = path.join(__dirname, 'foo');
var BAR_PATH = path.join(__dirname, 'bar');
var BAZ_PATH = path.join(__dirname, 'bar', 'baz');

function createFs() {
    var fs = new FakeFs();
    fs.mkdirp = function (dirname, cb) {
        if (!fs.existsSync(dirname)) {
            fs.dir(dirname);
        }
        process.nextTick(cb);
    };
    fs.rimraf = function (loc, cb) {
        var dirname = path.dirname(loc);
        var fileName = path.basename(loc);
        var item = fs._itemAt(dirname);

        if (!item) {
            return process.nextTick(cb);
        }

        delete item.childs[fileName];

        process.nextTick(cb);
    };
    fs.fs = fs;
    return fs;
}

test('withFixtures is a function', function (assert) {
    assert.strictEqual(typeof withFixtures, 'function');
    assert.end();
});

test('create temporary file system', function (assert) {
    var fs = createFs();

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
    }, fs, function (err) {
        assert.ifError(err);

        assert.equal(fs.existsSync(FOO_PATH), false);
        assert.equal(fs.existsSync(BAR_PATH), false);
        assert.equal(fs.existsSync(BAZ_PATH), false);

        assert.end();
    });
});

test('createFixtures errors bubbles', function (assert) {
    var fs = createFs();
    var counter = 0;

    fs.dir(BAR_PATH);

    withFixtures(__dirname, {
        'foo': 'bar',
        'bar': {
            'baz': 'foobar'
        }
    }, function (callback) {
        counter++;

        process.nextTick(callback);
    }, fs, function (err) {
        assert.ok(err);

        assert.equal(counter, 0);
        assert.equal(err.code, 'EEXIST');

        assert.end();
    });
});

test('teardownFixtures errors bubbles', function (assert) {
    var fs = createFs();

    withFixtures(__dirname, {
        'foo': 'bar',
        'bar': {
            'baz': 'foobar'
        }
    }, function (callback) {
        fs.unlinkSync(FOO_PATH);

        process.nextTick(callback);
    }, fs, function (err) {
        assert.ok(err);

        assert.equal(err.code, 'ENOENT');

        assert.end();
    });
});

test('task errors bubble', function (assert) {
    var fs = createFs();

    withFixtures(__dirname, {
        'foo': 'bar',
        'bar': {
            'baz': 'foobar'
        }
    }, function (callback) {
        assert.equal(fs.existsSync(FOO_PATH), true);
        assert.equal(fs.existsSync(BAR_PATH), true);
        assert.equal(fs.existsSync(BAZ_PATH), true);

        process.nextTick(callback.bind(null, new Error('foo')));
    }, fs, function (err) {
        assert.ok(err);

        assert.equal(err.message, 'foo');

        assert.equal(fs.existsSync(FOO_PATH), false);
        assert.equal(fs.existsSync(BAR_PATH), false);
        assert.equal(fs.existsSync(BAZ_PATH), false);

        assert.end();
    });
});

test('task can be assert.end interface (thunk)', function (assert) {
    var fs = createFs();

    var assertLike = {
        end: function (err, value) {
            assert.ifError(err);

            assert.equal(value, 42);

            assert.end();
        },
        equal: function () {}
    };

    var thunk = withFixtures(__dirname, {
        'foo': 'bar',
        'bar': {
            'baz': 'foobar'
        }
    }, function (assertLike) {
        assert.equal(typeof assertLike.equal, 'function');
        assert.equal(typeof assertLike.end, 'function');
        assert.equal(typeof assertLike, 'object');

        process.nextTick(assertLike.end.bind(null, null, 42));
    }, fs);

    thunk(assertLike);
});

test('task can be assert.end interface', function (assert) {
    var fs = createFs();

    var assertLike = {
        end: function (err, value) {
            assert.ifError(err);

            assert.equal(value, 42);

            assert.end();
        },
        equal: function () {}
    };

    withFixtures(__dirname, {
        'foo': 'bar',
        'bar': {
            'baz': 'foobar'
        }
    }, function (assertLike) {
        assert.equal(typeof assertLike.equal, 'function');
        assert.equal(typeof assertLike.end, 'function');
        assert.equal(typeof assertLike, 'object');

        process.nextTick(assertLike.end.bind(null, null, 42));
    }, fs, assertLike);
});

test('can pass through values', function (assert) {
    var fs = createFs();

    withFixtures(__dirname, {
        'foo': 'bar',
        'bar': {
            'baz': 'foobar'
        }
    }, function (callback) {
        process.nextTick(callback.bind(null, null, 42));
    }, fs, function (err, value) {
        assert.ifError(err);

        assert.equal(value, 42);

        assert.end();
    });
});

test('withFixtures returns thunks', function (assert) {
    var fs = createFs();

    var thunk = withFixtures(__dirname, {
        'foo': 'bar',
        'bar': {
            'baz': 'foobar'
        }
    }, function (callback) {
        process.nextTick(callback.bind(null, null, 42));
    }, fs);

    assert.equal(typeof thunk, 'function');

    thunk(function (err, value) {
        assert.ifError(err);

        assert.equal(value, 42);

        assert.end();
    });
});
