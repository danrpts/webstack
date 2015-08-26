var gulp = require('gulp');
var bower = require('main-bower-files');
var _ = require('underscore');

/**
 * Get bootstrap fonts.
 */
module.exports = function (plugins, config) {

  var taskname = 'fonts';
  config.defaults.push(taskname);

  gulp.task(taskname, function () {

    var filter = plugins.filter(config.fonts);

    return gulp.src(bower())
    .pipe(filter)
    .pipe(gulp.dest('./app/public/fonts/'));
  });
}
