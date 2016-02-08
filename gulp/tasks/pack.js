var gulp = require('gulp');
var exec = require("child_process").exec;
var config = require('../config').deploy;

gulp.task('pack', function (cb) {
    exec('"C:\\Program Files\\7-Zip\\7z" a -tzip '+config.packageName+' '+config.packItems.join(" ")+' -mx5', function (err, stdout, stderr) {
        if (err || stderr.length) {
            console.error("7Zip error", err || stderr);
            return cb(err);
        }
        return cb(null);
    });
});