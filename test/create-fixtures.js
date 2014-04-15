var test = require('tape');
var FakeFs = require('fake-fs');
var path = require('path');

var createFixtures = require('../create-fixtures.js');

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
    fs.fs = fs;
    return fs;
}

test('createFixtures is a function', function (assert) {
    assert.equal(typeof createFixtures, 'function');

    assert.end();
});

test('create single file', function (assert) {
    var fs = createFs();

    createFixtures(__dirname, {
        'foo': 'bar'
    }, fs, function (err) {
        assert.ifError(err);

        assert.equal(fs.readFileSync(FOO_PATH, 'utf8'), 'bar');

        assert.end();
    });
});

test('create multiple files', function (assert) {
    var fs = createFs();

    createFixtures(__dirname, {
        'foo': 'bar',
        'bar': 'baz'
    }, fs, function (err) {
        assert.ifError(err);

        assert.equal(fs.readFileSync(FOO_PATH, 'utf8'), 'bar');
        assert.equal(fs.readFileSync(BAR_PATH, 'utf8'), 'baz');

        assert.end();
    });
});

test('create folders', function (assert) {
    var fs = createFs();

    createFixtures(__dirname, {
        'foo': 'bar',
        'bar': {
            'baz': 'foobar'
        }
    }, fs, function (err) {
        assert.ifError(err);

        assert.equal(fs.readFileSync(FOO_PATH, 'utf8'), 'bar');
        assert.equal(fs.statSync(BAR_PATH).isDirectory(), true);
        assert.equal(fs.readFileSync(BAZ_PATH, 'utf8'), 'foobar');

        assert.end();
    });
});

test('error if folder exists', function (assert) {
    var fs = createFs();

    fs.dir(BAR_PATH);

    createFixtures(__dirname, {
        'foo': 'bar',
        'bar': {
            'baz': 'foobar'
        }
    }, fs, function (err) {
        assert.ok(err);

        assert.equal(err.code, 'EEXIST');

        assert.end();
    });
});

test('throws on invalid data structures', function (assert) {
    var fs = createFs();
    var counter = 0;

    assert.throws(function () {
        createFixtures(__dirname, {
            foo: 42
        }, fs, function () {
            counter++;
        });
    }, /value not supported 42/);

    assert.equal(counter, 0);

    assert.end();
});
