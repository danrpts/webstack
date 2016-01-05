module.exports = {

  inject: function (req, res, next) {
    res.locals.token = req.csrfToken();
    next();
  }

}
