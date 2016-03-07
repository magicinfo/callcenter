define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'handlebars',
    'hbs!partials/head/templates/left',
    'collections/queueStatuses',
    'helpers/eqWindowHeight'
], function($, _, Backbone, Marionette, Handlebars, LeftTpl, queueStatusesCollection, eqHeight) {
    'use strict';

    return Marionette.ItemView.extend({
        template: LeftTpl,

        events: {

        },

        initialize: function(options) {
            var self = this;

            this.app = options.app;
            //this.collection = new queueStatusesCollection();
            this.collection = options.queueStatuses;

            this.collection.fetch();
            setInterval(function() {
                self.collection.fetch();
            }, this.app.refreshInterval);

            this.listenTo(this.collection, 'add change remove reset', this.render);
        },

        render: function() {
            var tpl = Handlebars.compile(this.template({collection: this.collection.toJSON()}));
            this.$el.html(tpl);

            //eqHeight('.head-cell-outer');
            eqHeight('.head-row');
            return this;
        }

        /*onAttach: function() {
            eqHeight('.head-row');
        }*/
    });
});

