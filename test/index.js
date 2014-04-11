var test = require('tape');

var fixturesFs = require('../index.js');

test('fixturesFs is a function', function (assert) {
    assert.strictEqual(typeof fixturesFs, 'function');
    assert.end();
});
