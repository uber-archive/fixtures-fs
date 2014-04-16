var createFixtures = require('./create-fixtures');
var teardownFixtures = require('./teardown-fixtures');

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

function withFixtures(dirname, fixtures, lambda, opts) {
    opts = opts || {};

    function thunk(task) {
        function onFixtures(err) {
            if (err) {
                return task(err);
            }

            var thunk = teardownFixtures.bind(null,
                dirname, fixtures, opts);

            lambda(interceptTask(task, thunk));
        }

        createFixtures(dirname, fixtures, opts, onFixtures);
    }

    return thunk;
}

module.exports = withFixtures;
