define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'handlebars',
    'hbs!partials/body/templates/firstRow',
    'helpers/Time'
], function($, _, Backbone, Marionette, Handlebars, RowTpl, timeHelper) {
    'use strict';

    var childItem = Marionette.ItemView.extend({
        template: RowTpl,

        tagName: 'div',

        className: 'body-item text-center',

        initialize: function(options) {
            var that = this;

            this.model = options.model;

            setInterval(function() {
                that.updateTime();
            }, 1000);

            this.listenTo(this.model, 'add change remove', this.updateTime);
        },

        updateTime: function() {
            timeHelper.updateTime(this.model);
        },

        render: function() {
            var tpl = Handlebars.compile(this.template({model: this.model}));
            this.$el.html(tpl);

            this.$el.find('.body-item:first-child').addClass('first-body-element');
        }
    });

    return Marionette.CollectionView.extend({
        childView: childItem,

        /*initialize: function(options) {
            console.log(this);
        }*/

        onAttach: function() {

        }
    })
});

