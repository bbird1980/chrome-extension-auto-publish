var gulp = require('gulp');
var replace = require('gulp-replace-async');

gulp.task('update_version', function () {
    return gulp.src('./manifest.json')
        .pipe(replace(/"version": "([0-9.]+)"/, function(match, callback) {
            var version = match[1].split(".");
            version[version.length-1]++;
            version = version.join(".");
            callback(null, match[0].replace(match[1], version));
        }))
        .pipe(gulp.dest('./'));
});