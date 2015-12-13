module.exports = {
  
  promise: function(options) {
    var promise;
    options = options || {};
    promise = this.fetch(options).promise();
    return promise;
  }
  
}
