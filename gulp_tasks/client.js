var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// Bundle client
module.exports = function (plugins, config) {

  // Include in default gulp tasks
  var taskname = 'client';
  config.defaults.push(taskname);

  gulp.task(taskname, function () {

    // Setup file bundle
    var bundler = browserify(watchify.args)
      .transform('stringify', {  // simple templating
        extensions: config.templates
      })
      .add(config.input + '/javascripts/index.js') // main client file
      .external(config.libs); // don't bundle libs
        
    // Setup file watcher
    var watcher = watchify(bundler)
      .on('update', rebundler)
      .on('log', function (info) {
        plugins.util.log(
          'Bundled',
          '\'' + plugins.util.colors.cyan(taskname) + '\'',
          plugins.util.colors.yellow(info)
        );
      });
        
    // Setup gulp pipeline
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
      .pipe(gulp.dest(config.output + '/javascripts/'));
    }
      
    // Return as completion hint
    return rebundler();
  });
}
