(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');

var Item = Backbone.Model.extend({

    defaults: {
        'completed': false
    },

    toggle: function () {
        this.save({completed: !this.get('completed')});
    }

});

var List = Backbone.Collection.extend({

    model: Item,

    localStorage: new Backbone.LocalStorage('TaskList'),

    completed: function () {
        return this.where({'completed': true}).length;
    }

});

var ItemView = Backbone.View.extend({

    tagName: 'li',

    className: 'flexbox',

    events: {
        'mouseup #destroy': 'destroy',
        'mouseup #task': 'complete' // bug with 'click'; two click events; mdl-js-checkbox
    },

    template: _.template(require('../templates/ItemView.html')),

    initialize: function () {
        this.listenTo(this.model, 'destroy', this.remove);
    },

    destroy: function (e) {
        e.stopImmediatePropagation();
        var that = this;
        this.$el.fadeOut('fast', function () {
            that.model.destroy();
        });
    },

    complete: function (e) {
        e.stopImmediatePropagation();
        this.model.toggle();
        this.$('span').toggleClass('completed', status);
    },

    render: function () {
        var status = this.model.get('completed'),
            data = _.extend(this.model.toJSON(), {
                'checked': status ? 'checked' : ''
            }); // checkbox state
        this.$el.html(this.template(data));
        this.$('span').toggleClass('completed', status);
        componentHandler.upgradeElements(this.el); // mdl
        return this;
    }

});

var ListView = Backbone.View.extend({

    tagName: 'ol',

    _childViews: [], // view management

    initialize: function () {
        this.listenTo(this.collection, 'add', this.add);
        this.listenTo(this.collection, 'remove', this.remove);
    },

    add: function (task) {
        var view = new ItemView({model: task});
        this._childViews.push(view);
        view.render().$el.hide();
        this.$el.append(view.$el);
        view.$el.fadeIn('fast');
    },

    remove: function (task) {
        var index = _.findIndex(this._childViews, function (found) {
            return found.model.cid === task.cid;
        });
        this._childViews.splice(index, 1);
    }

});

var ControlView = Backbone.View.extend({

    tagName: 'div',

    className: 'flexbox',

    events: {
        'keydown': 'keydown'
    },

    template: _.template(require('../templates/ControlView.html')),

    keydown: function (e) {
        if (e.which === 13) {
            var input = this.$('input'),
            value = input.val().trim();
            if (value != '') {
                this.collection.create({'text': value});
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

    tagName: 'span',

    template: _.template(require('../templates/InfoView.html')),

    initialize: function () {
        this.listenTo(this.collection, 'change update', this.render);
    },

    render: function () {
        this.$el.html(this.template({
            'completed': this.collection.completed(),
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

        // messy
        this.$el.prepend(this.template());

        var list = new List(); // shared resource

        this.$('#task-menu').html(new ControlView({collection: list}).render().$el);

        this.$('#task-list').html(new ListView({collection: list}).$el);

        //$('#task-info').html(new InfoView({collection: list}).render().$el);

        list.fetch();

        return this;
    }
});

$(function () {
    new AppView().render();
});

},{"../templates/AppView.html":2,"../templates/ControlView.html":3,"../templates/InfoView.html":4,"../templates/ItemView.html":5,"backbone":"backbone","backbone.localstorage":"backbone.localstorage","jquery":"jquery","underscore":"underscore"}],2:[function(require,module,exports){
module.exports = "<div style=\"width: 300px; margin:0 auto; padding-top: 2%\">\n    <div id=\"task-menu\"></div>\n    <div id=\"task-list\"></div>\n</div>";

},{}],3:[function(require,module,exports){
module.exports = "<div class=\"flex\">\n    <div id=\"task-input\" class=\"mdl-textfield mdl-js-textfield\">\n        <input class=\"mdl-textfield__input\" type=\"text\" id=\"input-item\" maxlength=\"23\" placeholder=\"What needs to be done?\" />\n        <label class=\"mdl-textfield__label\" for=\"input-item\"></label>\n    </div>\n</div>";

},{}],4:[function(require,module,exports){
module.exports = "<span class=\"mdl-badge\" data-badge=\"<%= completed %> / <%= total%>\"></span>";

},{}],5:[function(require,module,exports){
module.exports = "<div class=\"flex\">\n    <p class=\"text\">\n        <label id=\"task\" class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\">\n            <input type=\"checkbox\" class=\"mdl-checkbox__input\" <%= checked %>/>\n            <span class=\"mdl-checkbox__label\"><%= text %></span>\n        </label>\n    </p>\n</div>\n<div class=\"raw\">\n    <p class=\"icon\">\n        <button id=\"destroy\" class=\"mdl-button mdl-js-button mdl-button--icon\">\n            <i class=\"material-icons\">close</i>\n        </button>\n    </p>\n</div>";

},{}]},{},[1]);
