var test = require('tape');

var withFixtures = require('../index.js');

test('withFixtures is a function', function (assert) {
    assert.strictEqual(typeof withFixtures, 'function');
    assert.end();
});
