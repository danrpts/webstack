var _ = require('underscore');
var Backbone = require('Backbone');

// Call this function with a context to return a closure
module.exports = function () {
  
  // Using eval so that context may be deleted
  // http://perfectionkills.com/understanding-delete/
  eval('var context = this;');

  return {

    get: function (key) {
      return context.get(key);
    },

    has: function (key) {
      return (!!context.get(key));
    },

    size: function () {
      return context.length;
    },

    // Returns an object with count values relative to key
    totals: function (key) {

      // Value names
      var y = 'yep';
      var n = 'nope';

      // Build the totals object
      var gathered = _.countBy(context.models, function (model) {
        return (!!model.get(key)) ? y : n;
      });

      gathered[y] = gathered[y] || 0;
      gathered[n] = gathered[n] || 0;

      return gathered;

    },

    format: function (key) {
      var timestamp = new Date(context.get(key));
      var today = new Date();
      var time = key + ' @ ' + timestamp.toLocaleTimeString()
      var date = key + ' on ' + timestamp.toDateString();
      return (timestamp.getDay() === today.getDay()) ? time : date;
    },

    release: function () {
      console.log('Releasing closure on context.');
      delete context;
      //console.log(typeof context);
    }

  }

}
