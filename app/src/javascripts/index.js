'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');

var Item = Backbone.Model.extend({
    defaults: {
        'completed': false
    }
});

var List = Backbone.Collection.extend({
    model: Item,
    localStorage: new Backbone.LocalStorage('TaskList'),
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
        this.model.save(); // save completed attribute
        this.$el.toggleClass('text-muted completed');
    },

    render: function () {
        this.$el.html(this.template(this.model.attributes));
        this.delegateEvents(); // because of list re-renders
        if (this.model.get('completed')) this.$el.addClass('text-muted completed');
        return this;
    }

});

var ListView = Backbone.View.extend({

    tagName: 'ul',

    className: 'list-group',

    _childViews: [], // simple view management

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
        _.each(this._childViews, function (view) {
            that.$el.append(view.render().$el);
        });
        return this;
    }
});

var InputView = Backbone.View.extend({

    tagName: 'form',

    className: 'form-horizontal',

    events: {
        'keydown': '_keydown'
    },

    template: _.template(require('../templates/InputView.html')),

    _keydown: function (e) {
        if (e.which === 13) {
            var input = this.$('input'),
            value = input.val().trim();
            if (value != '') {
                this.collection.create({data: value});
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
        list.fetch(); // fetch from local storage after view is rendered
        return this;
    }
});

$(function () {
    new AppView().render();
});
