/*jshint maxparams: 5 */
var createFixtures = require('./create-fixtures');
var teardownFixtures = require('./teardown-fixtures');

/*  to support common testing libraries we accept either a
    a callback function or an assert like object with an `end()`
    method on it. 
*/
function isTask(maybeTask) {
    return typeof maybeTask === 'function' || (
        typeof maybeTask === 'object' && maybeTask !== null &&
            typeof maybeTask.end === 'function'
    );
}

/*   we take the `callback` or object with `.end()` method passed
     to the result of `withFixtures` and intercept such that
     we can apply our async teardown logic before invoking
     the done callback
*/
function interceptTask(task, asyncTeardown) {
    var doneCallback;

    function interceptCallback(err, value) {
        function onTeardown(newErr) {
            doneCallback(err || newErr, value);
        }

        asyncTeardown(onTeardown);
    }

    if (typeof task === 'function') {
        doneCallback = task;
        return interceptCallback;
    } else {
        doneCallback = task.end.bind(task);
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
