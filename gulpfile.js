var gulp = require('gulp');
var glob = require('glob');
var plugins = require('gulp-load-plugins')(); // could config it
var argv = require('minimist')(process.argv.slice(2));

/**
 * A config object for all tasks.
 */
 
var config = {
  entry: './app/src/javascripts/index.js',
  libs: 'jquery underscore backbone backbone.localstorage'.split(' '),
  templates: '.html .ejs .tpl .tmpl'.split(' '), // stringify has open issue for glob support
  fonts: '*.{eot,svg,ttf,woff,woff2}',
  styles: '*.{css,}', // notice the comma
  defaults: []
}

/**
 * Development or Production.
 */

//check node environment
//check argumens
//default to something

/**
 * Setup all tasks.
 */
 
var list = (!!argv._.length) ? argv._.join(',') : '*';
var pattern = './gulp_tasks/{'+ list +',}.js'; // notice the comma
var tasks = glob.sync(pattern); // must be synchronous

/**
 * Load all tasks.
 */
 
tasks.forEach(function (path) {
    require(path)(plugins, config);
});

/**
 * Run default tasks.
 */
 
gulp.task('default', config.defaults);
