module.exports = {
  
  promise: function (options) {
    options = options || {};
    return this.fetch(options).promise();
  }

}
