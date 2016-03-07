define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'handlebars',
    'hbs!partials/footer/templates/footer',
    'moment'
], function($, _, Backbone, Marionette, Handlebars, FooterTpl, moment) {
    'use strict';

    return Marionette.ItemView.extend({
        template: FooterTpl,

        events: {

        },

        initialize: function(options) {
            this.ticketsStats = options.ticketsStats;
            this.queueStatuses = options.queueStatuses;

            this.ticketsStats.fetch();

            this.listenTo(this.ticketsStats, 'add change remove reset', this.render);
            this.listenTo(this.queueStatuses, 'add change remove reset', this.render);
        },

        render: function() {
            var tpl = Handlebars.compile(this.template({
                tickets: this.ticketsStats.toJSON(),
                queueStatuses: this.queueStatuses.toJSON()
            }));
            this.$el.html(tpl);

            return this;
        }
    });
});

