module.exports = {
  
  goto: function (fragment) {
    this.navigate(fragment, {trigger: true});
  },

  authorize: function (callback) {
    if(account.isAuthorized()) callback();
  }

}