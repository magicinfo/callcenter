define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'handlebars',
    'hbs!partials/body/templates/secondaryRow'
], function($, _, Backbone, Marionette, Handlebars, RowTpl) {
    'use strict';

    var childItem = Marionette.ItemView.extend({
        template: RowTpl,

        tagName: 'div',

        className: 'text-center agency-cell body-item',

        initialize: function(options) {
            this.model = options.model;

            this.listenTo(this.model, 'add change remove', this.render);
        },

        render: function() {
            var tpl = Handlebars.compile(this.template({model: this.model}));
            this.$el.html(tpl);
        }
    });

    return Marionette.CollectionView.extend({
        childView: childItem,

        initialize: function(options) {
            console.log(options);
        }
    });
});

