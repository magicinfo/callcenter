define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'handlebars',
    'hbs!partials/head/templates/head',
    'partials/head/views/left',
    'partials/head/views/right',
    'helpers/eqWindowHeight'
], function($, _, Backbone, Marionette, Handlebars, HeadTpl, LeftView, RightView, eqHeight) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: HeadTpl,

        tagName: 'table',

        className: 'dashboard-head-table',

        events: {

        },

        regions: {
            left: '.head-column-left',
            right: '.head-column-right'
        },

        initialize: function(options) {
            this.app = options.app;
            this.ticketsStats = options.ticketsStats;
            this.queueStatuses = options.queueStatuses;

            //this.ticketsStats.fetch();

            //this.listenTo(this.ticketsStats, 'add change remove reset', this.render);
        },

        render: function() {
            var tpl = Handlebars.compile(this.template());
            this.$el.html(tpl);

            this.left.show(new LeftView({
                app: this.app,
                queueStatuses: this.queueStatuses
            }));
            this.right.show(new RightView({tickets: this.ticketsStats}));

            $(window).on('resize', _.bind(this.onResize, this));
            return this;
        },

        onResize: function() {
            eqHeight('.head-row');
        }
    });
});

