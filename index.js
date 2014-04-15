/*jshint maxparams: 5 */
var createFixtures = require('./create-fixtures');
var teardownFixtures = require('./teardown-fixtures');

function isTask(maybeTask) {
    return typeof maybeTask === 'function' || (
        typeof maybeTask === 'object' && maybeTask !== null &&
            typeof maybeTask.end === 'function'
    );
}

function interceptTask(task, thunk) {
    var callback;

    function interceptCallback(err, value) {
        function onTeardown(newErr) {
            callback(err || newErr, value);
        }

        thunk(onTeardown);
    }

    if (typeof task === 'function') {
        callback = task;
        return interceptCallback;
    } else {
        callback = task.end.bind(task);
        task.end = interceptCallback;
        return task;
    }
}

function withFixtures(dirname, fixtures, lambda, opts, task) {
    if (isTask(opts)) {
        task = opts;
        opts = {};
    }

    if (!task) {
        return withFixtures.bind(null,
            dirname, fixtures, lambda, opts);
    }

    createFixtures(dirname, fixtures, opts, function onFixtures(err) {
        if (err) {
            return task(err);
        }

        var thunk = teardownFixtures.bind(null,
            dirname, fixtures, opts);

        lambda(interceptTask(task, thunk));
    });
}

module.exports = withFixtures;
