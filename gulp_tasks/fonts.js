var gulp = require('gulp');

/**
 * Bootstrap fonts
 */
 
module.exports = function (plugins, config) {

    var taskname = 'fonts';
    config.defaults.push(taskname);

    gulp.task(taskname, function () {
        return gulp.src('./node_modules/bootstrap/fonts/*.{' + config.fonts + '}')
            .pipe(gulp.dest('./app/public/fonts/'));
    });
}
