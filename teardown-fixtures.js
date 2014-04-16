var globalFs = require('fs');
var path = require('path');
var parallel = require('continuable-para');
var series = require('continuable-series');
var globalRimRaf = require('rimraf');
var format = require('util').format;

var message = '`fixtures-fs#teardownFixtures` expected key %s ' +
    'to have value that is a string or object but we ' +
    'received %j.';

function teardownFixtures(dirname, fixtures, opts, callback) {
    if (typeof opts === 'function') {
        callback = opts;
        opts = {};
    }

    var fs = opts.fs || globalFs;
    var rimraf = opts.rimraf || globalRimRaf;

    var tasks = Object.keys(fixtures).map(function (key) {
        var value = fixtures[key];
        var loc = path.join(dirname, key);

        if (typeof value === 'string') {
            return fs.unlink.bind(fs, loc);
        } else if (typeof value === 'object') {
            return series([
                teardownFixtures.bind(null, loc, value, opts),
                rimraf.bind(null, loc)
            ]);
        } else {
            var msg = format(message, key, value);
            throw new Error(msg);
        }
    });

    parallel(tasks, callback);
}

module.exports = teardownFixtures;
