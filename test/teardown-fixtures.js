var test = require('tape');
var FakeFs = require('fake-fs');
var path = require('path');

var teardownFixtures = require('../teardown-fixtures.js');

var FOO_PATH = path.join(__dirname, 'foo');
var BAR_PATH = path.join(__dirname, 'bar');
var BAZ_PATH = path.join(__dirname, 'bar', 'baz');
var GIT_PATH = path.join(__dirname, 'bar', '.git');

function createFs() {
    var fs = new FakeFs();
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
    return fs;
}

test('teardownFixtures is a function', function (assert) {
    assert.equal(typeof teardownFixtures, 'function');

    assert.end();
});

test('removes single file', function (assert) {
    var fs = createFs();
    fs.file(FOO_PATH, 'bar');

    assert.equal(fs.existsSync(FOO_PATH), true);

    teardownFixtures(__dirname, {
        'foo': 'bar'
    }, { fs: fs, rimraf: fs.rimraf }, function (err) {
        assert.ifError(err);

        assert.equal(fs.existsSync(FOO_PATH), false);

        assert.end();
    });
});

test('removes multiple files', function (assert) {
    var fs = createFs();
    fs.file(FOO_PATH, 'bar');
    fs.file(BAR_PATH, 'baz');

    assert.equal(fs.existsSync(FOO_PATH), true);
    assert.equal(fs.existsSync(BAR_PATH), true);

    teardownFixtures(__dirname, {
        'foo': 'bar',
        'bar': 'baz'
    }, { fs: fs, rimraf: fs.rimraf }, function (err) {
        assert.ifError(err);

        assert.equal(fs.existsSync(FOO_PATH), false);
        assert.equal(fs.existsSync(BAR_PATH), false);

        assert.end();
    });
});

test('removes folders', function (assert) {
    var fs = createFs();
    fs.file(FOO_PATH, 'bar');
    fs.file(BAZ_PATH, 'foobar');

    assert.equal(fs.existsSync(FOO_PATH), true);
    assert.equal(fs.existsSync(BAR_PATH), true);
    assert.equal(fs.existsSync(BAZ_PATH), true);

    teardownFixtures(__dirname, {
        'foo': 'bar',
        'bar': {
            'baz': 'foobar'
        }
    }, { fs: fs, rimraf: fs.rimraf }, function (err) {
        assert.ifError(err);

        assert.equal(fs.existsSync(FOO_PATH), false);
        assert.equal(fs.existsSync(BAR_PATH), false);
        assert.equal(fs.existsSync(BAZ_PATH), false);

        assert.end();
    });
});

test('cleanups other files', function (assert) {
    var fs = createFs();
    fs.file(FOO_PATH, 'bar');
    fs.file(BAZ_PATH, 'foobar');
    fs.file(GIT_PATH, 'some git stuff');

    assert.equal(fs.existsSync(FOO_PATH), true);
    assert.equal(fs.existsSync(BAR_PATH), true);
    assert.equal(fs.existsSync(BAZ_PATH), true);
    assert.equal(fs.existsSync(GIT_PATH), true);

    teardownFixtures(__dirname, {
        'foo': 'bar',
        'bar': {
            'baz': 'foobar'
        }
    }, { fs: fs, rimraf: fs.rimraf }, function (err) {
        assert.ifError(err);

        assert.equal(fs.existsSync(FOO_PATH), false);
        assert.equal(fs.existsSync(BAR_PATH), false);
        assert.equal(fs.existsSync(BAZ_PATH), false);
        assert.equal(fs.existsSync(GIT_PATH), false);

        assert.end();
    });
});
