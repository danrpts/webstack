var gulp = require('gulp');
var glob = require('glob');
var plugins = require('gulp-load-plugins')();
var argv = require('minimist')(process.argv.slice(2));

// A config object for all tasks
var config = {
  entry: './app/src/javascripts/index.js',
  libs: 'jquery underscore backbone backbone.localstorage'.split(' '),
  templates: '.html .ejs .tpl .tmpl .glsl'.split(' '),
  fonts: 'eot svg ttf woff woff2 otf'.split(' '),
  defaults: []
}

/* Development or Production
TODO:
check environment
check for arguments
set default
*/

// Setup all tasks
var list = (!!argv._.length) ? argv._.join(',') : '*';
var pattern = './gulp_tasks/{'+ list +',}.js'; // notice the comma
var tasks = glob.sync(pattern); // must be synchronous

// Load all tasks
tasks.forEach(function (path) {
  require(path)(plugins, config);
});

// Run default tasks
gulp.task('default', config.defaults);
