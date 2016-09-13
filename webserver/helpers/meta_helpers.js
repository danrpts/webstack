var _ = require('underscore');
var json = require('../../package.json');

module.exports = {
  
  data: function () {
    return _.pick(json, 'version', 'name', 'author');
  }

}
