var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// Bundle libs
module.exports = function (plugins, config) {

    var taskname = 'libs';
    config.defaults.push(taskname);

    gulp.task(taskname, function () {

        // Setup file bundle
        var bundler = browserify(watchify.args)
            .require(config.libs, {noParse: config.libs}); // libs must be require-able

        // Setup file watcher
        var watcher = watchify(bundler).on('update', rebundler);

        // Setup the gulp pipeline
        function rebundler () {
            return watcher.bundle()
                .pipe(source('libs.js'))
                //.pipe(buffer())
                //.pipe(plugins.uglify())
                //.pipe(plugins.gzip())
                .pipe(gulp.dest('./app/public/javascripts/'));
        }

        // Return as completion hint
        return rebundler();
    });
}
