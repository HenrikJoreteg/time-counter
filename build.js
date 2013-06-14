var browserify = require('browserify'),
    b = browserify(),
    fs = require('fs');

var filename = 'time-counter.bundled.js';

b.add('./time-counter.js');
b.bundle({standalone: 'TimeCounter'}, function (err, code) {
    fs.writeFile(filename, code, function (err) {
        if (!err) console.log(filename + ' built!');
    });
})
