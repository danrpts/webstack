var $ = require('jquery');
var _ = require('underscore');

module.exports = {
  
  prepare: function ($compiled) {

    // When it's the initial render
    if (!this._rendered) {
      this.setElement($compiled);
      this._rendered = true;
    }

    // When it's a re-render
    else this.$el.html($compiled.html());

    // Return the 
    return this.$el;
    
  }

}