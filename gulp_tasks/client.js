var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var stringify = require('stringify');

module.exports = function (plugins, config) {

  // include in default gulp tasks
  var taskname = 'client';
  config.defaults.push(taskname);

  gulp.task(taskname, function () {

    // setup file bundle
    var bundler = browserify(watchify.args)
      .transform(stringify(config.templates)) // simple templating
      .add(config.entry) // main client file
      .external(config.libs); // don't bundle libs
        
        // setup file watcher
    var watcher = watchify(bundler)
      .on('update', rebundler)
      .on('log', function (info) {
        plugins.util.log(
          'Bundled',
          '\'' + plugins.util.colors.cyan(taskname) + '\'',
          plugins.util.colors.yellow(info)
        );
      });
        
    // setup gulp pipeline
    function rebundler () {
      return watcher.bundle()
        .on('error', function (err) {
          plugins.util.log(plugins.util.colors.red(err.toString()));
          this.emit('end');
        })
        .pipe(source('client.js'))
        //.pipe(buffer())
        //.pipe(plugins.uglify())
        //.pipe(plugins.gzip())
        .pipe(gulp.dest('./app/public/javascripts/'));
    }
      
    // return as completion hint
    return rebundler();
  });
}
