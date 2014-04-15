var globalFs = require('fs');
var path = require('path');
var parallel = require('continuable-para');
var series = require('continuable-series');
var globalMkdirp = require('mkdirp');
var format = require('util').format;

function createFixtures(dirname, fixtures, opts, callback) {
    if (typeof opts === 'function') {
        callback = opts;
        opts = {};
    }

    var fs = opts.fs || globalFs;
    var mkdirp = opts.mkdirp || globalMkdirp;
    var tasks = Object.keys(fixtures).map(function (key) {
        var value = fixtures[key];
        var loc = path.join(dirname, key);

        if (typeof value === 'string') {
            return fs.writeFile.bind(fs, loc, value);
        } else if (typeof value === 'object') {
            return series([
                fs.mkdir.bind(fs, loc),
                createFixtures.bind(null, loc, value, opts)
            ]);
        } else {
            var msg = format('value not supported %j', value);
            throw new Error(msg);
        }
    });

    tasks.unshift(mkdirp.bind(null, dirname));

    parallel(tasks, callback);
}

module.exports = createFixtures;
