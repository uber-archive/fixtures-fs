var globalFs = require('fs');
var path = require('path');
var parallel = require('continuable-para');
var series = require('continuable-series');
var globalRimRaf = require('rimraf');

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
        }
    });

    parallel(tasks, callback);
}

module.exports = teardownFixtures;
