var gulp = require('gulp');

// Bundle css
module.exports = function (plugins, config) {

  var taskname = 'images';
  config.defaults.push(taskname);

  gulp.task(taskname, function () {
    return gulp.src(config.input + '/images/*')
      // do fancy transform
      .pipe(gulp.dest(config.output + '/images/'));
  });
}
