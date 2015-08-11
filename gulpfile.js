var gulp = require('gulp');
var exec = require("child_process").exec;
var clean = require('gulp-clean');
var request = require('superagent');
var runSequence = require('run-sequence');
var fs = require('fs');
var https = require('https');
var util = require('util');
var replace = require('gulp-replace-async');

var packageName = 'zipped_extension.zip';
var APP_ID = '%APP_ID%';
//https://developer.chrome.com/webstore/using_webstore_api
var OAuth = {
    "client_secret":"%client_secret%",
    "token_uri":"https://accounts.google.com/o/oauth2/token",
    "client_id":"%client_id%",
    "refresh_token":"%refresh_token%"
};

gulp.task('deploy', function(cb) {
    // Get token
    request
        .post(OAuth.token_uri)
        .send("client_id="+OAuth.client_id+"&client_secret="+OAuth.client_secret+"&refresh_token="+OAuth.refresh_token+"&grant_type=refresh_token")
        .accept("application/json")
        .end(function(err, res){
            if (err) {
                console.error("Auth token error", err.status, err.response);
                return cb(err);
            }
            if (!res.body.access_token)
            {
                console.error('Auth token error', res.body);
                return cb('Token not found in response');
            }
            var $token = res.body.access_token;

            // Upload zip (superagent doesn't work well with attach
            var req = https.request({
                method: 'PUT',
                host: 'www.googleapis.com',
                path: util.format('/upload/chromewebstore/v1.1/items/%s', APP_ID),
                headers: {
                    'Authorization': 'Bearer ' + $token,
                    'x-goog-api-version': '2'
                }
            }, function(res) {
                res.setEncoding('utf8');
                var response = '';
                res.on('data', function (chunk) {
                    response += chunk;
                });
                res.on('end', function () {
                    var obj = JSON.parse(response);
                    if( obj.uploadState !== "SUCCESS" ) {
                        console.log('Zip uploaded, parse state = fail', obj);
                        return cb(obj.error ? obj.error.message : obj);
                    }
                    // Publish
                    request
                        .post("https://www.googleapis.com/chromewebstore/v1.1/items/"+APP_ID+"/publish")
                        .set('x-goog-api-version', '2')
                        .set('Authorization', 'Bearer ' + $token)
                        .set('Content-Length', '0')
                        .end(function(err, res) {
                            if (err) {
                                console.error("Publish error", err.status, err.response);
                                return cb(err);
                            }
                            if (!res.body.status || res.body.status[0] != 'OK'){
                                console.error("Publish state = fail", res.body);
                                return cb(res.body);
                            }
                            return cb(null);
                        });
                });
            }).on('error', function(e){
                console.log("Upload error", e.message);
                return cb(e);
            });
            var readStream = fs.createReadStream(packageName);
            readStream.on('end', function(){ req.end(); });
            readStream.pipe(req);
        });
});

gulp.task('clean', function () {
    return gulp.src(packageName, {read: false}).pipe(clean());
});

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

gulp.task('pack', function (cb) {
    exec('"C:\\Program Files\\7-Zip\\7z" a -tzip '+packageName+' js/* images/* options/* manifest.json popup* -mx5', function (err, stdout, stderr) {
        if (err || stderr.length) {
            console.error("7Zip error", err || stderr);
            return cb(err);
        }
        return cb(null);
    });
});

gulp.task('publish', function(callback) {
    runSequence('clean', 'update_version', 'pack', 'deploy', callback);
});