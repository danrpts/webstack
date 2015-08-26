var gulp = require('gulp');
var bower = require('main-bower-files');

/**
 * Bundle css
 */
module.exports = function (plugins, config) {

  var taskname = 'styles';
  config.defaults.push(taskname);

  gulp.task(taskname, function () {

    var filter = plugins.filter(config.styles);

    return gulp.src(bower())
    .pipe(filter)
    .pipe(gulp.dest('./app/public/stylesheets/'));
  });
}
