var _ = require('underscore');

// Import this within a context to return a closure
module.exports = function () {
  
  // Using eval so that resource may be deleted
  // http://perfectionkills.com/understanding-delete/
  eval('var resource = this;');

  return {

    id: function () {
      return resource.id;
    },

    get: function (key) {
      return resource.get(key);
    },

    has: function (key) {
      return (!!resource.get(key));
    },

    size: function () {
      return resource.length;
    },

    each: function (callback) {
      resource.each(callback, resource);
    },

    format: function (key) {
      var timestamp = new Date(resource.get(key));
      var today = new Date();
      var time = key + ' @ ' + timestamp.toLocaleTimeString();
      var date = key + ' on ' + timestamp.toDateString();
      return (timestamp.getDay() === today.getDay()) ? time : date;
    },

    state: function (value) {
      return resource.promise 
        && (resource.promise.state() === value);
    },

    release: function () {
      console.log('Releasing the context closure on the resource.');
      delete resource;
    }

  }
}
