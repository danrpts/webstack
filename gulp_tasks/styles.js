var gulp = require('gulp');

// Bundle css
module.exports = function (plugins, config) {

  var taskname = 'styles';
  config.defaults.push(taskname);

  gulp.task(taskname, function () {
    return gulp.src(config.input + '/stylesheets/index.css')
      .pipe(plugins.importCss())
      .pipe(plugins.rename('default.css'))
      .pipe(gulp.dest(config.output + '/stylesheets/'));
  });
}
