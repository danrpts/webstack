var _ = require('underscore');
var Backbone = require('Backbone');

//TODO: make individual presenter from base presenter class
// Call this function with a context to return a closure
module.exports = function () {
  
  // Using eval so that context may be deleted
  // http://perfectionkills.com/understanding-delete/
  eval('var context = this;');

  return {

    id: function () {
      return context.id;
    },

    get: function (key) {
      return context.get(key);
    },

    has: function (key) {
      return (!!context.get(key));
    },

    size: function () {
      return context.length;
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
