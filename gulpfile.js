var gulp = require("gulp");
var glob = require("glob");
var plugins = require("gulp-load-plugins")();
var argv = require("minimist")(process.argv.slice(2));

// Setup all tasks
var client = argv.client || argv.c;
var env = argv.env || argv.e;
var list = argv.tasks || argv.t || !!argv._.length ? argv._.join(",") : "*";
var pattern = "./gulp_tasks/{" + list + ",}.js"; // notice the comma
var tasks = glob.sync(pattern); // must be synchronous

// A config object for all tasks
var config = {
  input: "./webclient/" + client,
  output: "./webserver/public/",
  libs: "jquery jquery-ui-browserify human-time underscore backbone backbone.localstorage".split(
    " "
  ),
  templates: ".html .ejs .tpl .tmpl .glsl".split(" "),
  fonts: "eot svg ttf woff woff2 otf".split(" "),
  defaults: []
};

// Development or Production
/*
TODO:
check environment
check for arguments
set default
*/

// Load all tasks
tasks.forEach(function(path) {
  require(path)(plugins, config);
});

// Run default tasks
gulp.task("default", config.defaults);
