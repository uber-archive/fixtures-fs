var createFixtures = require('./create-fixtures');
var teardownFixtures = require('./teardown-fixtures');

function withFixtures(dirname, fixtures, task, callback) {
    if (!callback) {
        return withFixtures.bind(null, dirname, fixtures, task);
    }

    createFixtures(dirname, fixtures, function onFixtures(err) {
        if (err) {
            return callback(err);
        }

        task(function onTask(err, value) {
            function onTeardown(newErr) {
                callback(err || newErr, value);
            }

            teardownFixtures(dirname, fixtures, onTeardown);
        });
    });
}

module.exports = withFixtures;
