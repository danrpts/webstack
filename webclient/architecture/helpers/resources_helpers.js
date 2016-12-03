'use strict';

var _ = require('underscore');

module.exports = {

  anyPending: function () {
    return _.chain(this).invoke('isPending').some().value();
  },

  arePending: function () {
    return _.chain(this).invoke('isPending').every().value();
  },

  anyResolved: function () {
    return _.chain(this).invoke('isResolved').some().value();
  },

  areResolved: function () {
    return _.chain(this).invoke('isResolved').every().value();
  }

}
