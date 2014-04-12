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
        fs.dir(dirname);
        process.nextTick(cb);
    };
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
    }, { fs: fs, mkdirp: fs.mkdirp }, function (err) {
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
    }, { fs: fs, mkdirp: fs.mkdirp }, function (err) {
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
    }, { fs: fs, mkdirp: fs.mkdirp }, function (err) {
        assert.ifError(err);

        assert.equal(fs.readFileSync(FOO_PATH, 'utf8'), 'bar');
        assert.equal(fs.statSync(BAR_PATH).isDirectory(), true);
        assert.equal(fs.readFileSync(BAZ_PATH, 'utf8'), 'foobar');

        assert.end();
    });
});

