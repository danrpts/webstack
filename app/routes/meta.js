var express = require('express');
var router = express.Router();
var _ = require('underscore');

module.exports = function (app) {

	app.locals.meta = {};
	_.extend(app.locals.meta, _.pick(require('../../package.json'), 'version', 'name', 'author'));

	router.get('/meta', function(req, res, next) {
	 	res.json(app.locals.meta);
	});

	app.use(router);
}