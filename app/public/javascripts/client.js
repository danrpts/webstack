(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var Item = Backbone.Model.extend({
    defaults: {
        'completed': false
    }
});

var List = Backbone.Collection.extend({
    model: Item
});

var ItemView = Backbone.View.extend({

    tagName: 'li',

    className: 'list-group-item',

    events: {
        'click #destroy': '_destroy',
        'click': '_click'
    },

    template: _.template(require('../templates/ItemView.html')),

    initialize: function () {
        // re-renders can cause problems with with unsaved state like checkboxes
        // this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },

    _destroy: function (e) {
        e.stopImmediatePropagation(); // so we do not call _click
        var that = this;
        this.$el.fadeOut('fast', function () {
            that.model.destroy();
        });
    },

    _click: function () {
        this.model.get('completed') ?
        this.model.set({'completed': false}) :
        this.model.set({'completed': true});
        this.$el.toggleClass('text-muted completed');
    },

    render: function () {
        this.$el.html(this.template(this.model.attributes));
        this.delegateEvents(); // because of list re-renders
        return this;
    }

});

var ListView = Backbone.View.extend({

    tagName: 'div',

    _childViews: [], // simple view management

    template: _.template(require('../templates/ListView.html')),

    initialize: function () {
        this.listenTo(this.collection, 'add', this._add);
        this.listenTo(this.collection, 'remove', this._remove);
    },

    _add: function (task) {
        var view = new ItemView({model: task});
        this._childViews.push(view);
        this.render();
        view.$el.hide().fadeIn('fast');
    },

    _remove: function (task) {
        var index = _.findIndex(this._childViews, function (found) {
            return found.model.cid === task.cid;
        });
        this._childViews.splice(index, 1);
    },

    render: function () {
        var that = this;
        this.$el.html(this.template());
        _.each(this._childViews, function (view) {
            that.$('ul').append(view.render().$el);
        });
        return this;
    }
});

var InputView = Backbone.View.extend({

    tagName: 'div',

    className: 'form-group',

    events: {
        'keydown': '_keydown'
    },

    template: _.template(require('../templates/InputView.html')),

    _keydown: function (e) {
        if (e.which === 13) {
            var input = this.$('input'),
            value = input.val().trim();
            if (value != '') {
                this.collection.push({data: value});
                input.val('');
            }
        }
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    }
});

var InfoView = Backbone.View.extend({

    tagName: 'p',

    className: 'text-center text-muted',

    template: _.template(require('../templates/InfoView.html')),

    initialize: function () {
        this.listenTo(this.collection, 'change update', this.render);
    },

    render: function () {
        this.$el.html(this.template({
            'completed': this.collection.where({'completed': true}).length,
            'total': this.collection.size()
        }));
        this.collection.isEmpty() ?
        this.$el.hide() :
        this.$el.show(); 
        return this;
    }
});

var AppView = Backbone.View.extend({

    el: 'body',

    template: _.template(require('../templates/AppView.html')),

    render: function () {
        this.$el.html(this.template());
        var list = new List(); // shared resource
        this.$('#task-input').html(new InputView({collection: list}).render().$el);
        this.$('#task-list').html(new ListView({collection: list}).render().$el);
        this.$('#task-info').html(new InfoView({collection: list}).render().$el);
        return this;
    }
});

$(function () {
    new AppView().render();
});

},{"../templates/AppView.html":2,"../templates/InfoView.html":3,"../templates/InputView.html":4,"../templates/ItemView.html":5,"../templates/ListView.html":6,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],2:[function(require,module,exports){
module.exports = "<style>\n\tbody {\n\t\tfont-weight: 300;\n\t\tbackground-color:#F9F9F9;\n\t}\n\t#task-input::-webkit-input-placeholder {\n\t\tfont-weight: 300;\n\t}\n\t#task-input::-moz-placeholder {\n\t\tfont-weight: 300;\n\t}\n\t#task-input:-ms-input-placeholder {\n\t\tfont-weight: 300;\n\t}\n\tinput:-moz-placeholder {\n\t\tfont-weight: 300;\n\t}\n\t#task-input div.well {\n\t\tpadding: 2px;\n\t}\n\t#task-input input {\n\t\tborder-radius: 4px;\n\t}\n\t#task-list ul {\n\t}\n\t#task-list li {\n\t\tcursor: pointer;\n\t}\n\t#task-list li.completed {\n\t\ttext-decoration: line-through;\n\t}\n\t#task-list li #destroy {\n\t\tdisplay: none;\n\t}\n\t#task-list li:hover #destroy {\n\t\tdisplay: block;\n\t}\n</style>\n<div class=\"container\" style=\"padding-top: 10%\">\n\t<div class=\"row\">\n\t\t<div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-8 col-lg-offset-3 col-md-offset-3 col-sm-offset-3 col-xs-offset-2\">\n\t\t\t<div id=\"task-input\"></div>\n\t\t\t<div id=\"task-list\"></div>\n\t\t\t<div id=\"task-info\"></div>\n\t\t</div>\n\t</div>\n</div>";

},{}],3:[function(require,module,exports){
module.exports = "<%= completed %> of <%= total%> tasks completed";

},{}],4:[function(require,module,exports){
module.exports = "<div class=\"form-group\">\n\t<div class=\"well\">\n\t\t<input type=\"text\" class=\"form-control input-lg\" placeholder=\"What needs to be done?\" maxlength=\"35\">\n\t</div>\n</div>";

},{}],5:[function(require,module,exports){
module.exports = "<form class=\"form-inline\">\n\t<span>\n\t\t<%= data %>\n\t</span>\n\t<button id=\"destroy\" type=\"button\" class=\"close\">\n\t\t<span aria-hidden=\"true\">&times;</span>\n\t</button>\n</form>";

},{}],6:[function(require,module,exports){
module.exports = "<ul class=\"list-group\"></ul>";

},{}]},{},[1]);
