define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'handlebars',
    'hbs!partials/head/templates/right',
    'helpers/eqWindowHeight'
], function($, _, Backbone, Marionette, Handlebars, RightTpl, eqHeight) {
    'use strict';

    return Marionette.ItemView.extend({
        template: RightTpl,

        events: {

        },

        initialize: function(options) {
            this.tickets = options.tickets;

            this.listenTo(this.tickets, 'add change remove reset', this.render);
        },

        render: function() {
            var tpl = Handlebars.compile(this.template({tickets: this.tickets.toJSON()}));
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

