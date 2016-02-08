var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('publish', function(callback) {
    runSequence('clean', 'update_version', 'pack', 'deploy', callback);
});
