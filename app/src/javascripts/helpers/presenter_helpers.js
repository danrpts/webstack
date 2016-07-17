var _ = require('underscore');

module.exports = function (resource, view) {

  return {

    rid: function () {
      return resource.id || undefined;
    },

    vid: function () {
      return view.cid || undefined;
    },

    get: function (key) {
      return resource.get(key);
    },

    has: function (key) {
      return !! resource.get(key);
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
    }

  }
}
