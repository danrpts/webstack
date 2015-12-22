var _ = require('underscore');

// Call this function with a context to return a closure
module.exports = function () {
  
  // Using eval so that context may be deleted
  // http://perfectionkills.com/understanding-delete/
  eval('var context = this;');

  return {

    size: function () {
      return context.length;
    },

    totals: function (key) {
      return context.length - _.where(context, {key: null}).length;
    },

    format: function (key) {
      var timestamp = new Date(context.get(key));
      var today = new Date();
      var time = key + ' @ ' + timestamp.toLocaleTimeString()
      var date = key + ' on ' + timestamp.toDateString();
      return (timestamp.getDay() === today.getDay()) ? time : date;
    },

    has: function (key) {
      return (!!context.get(key));
    },

    get: function (key) {
      return context.get(key);
    },

    release: function () {
      console.log('Releasing closure on context.');
      delete context;
      console.log(typeof context);
    }

  }

}
