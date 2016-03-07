define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'handlebars',
    'hbs!partials/body/templates/body',
    'collections/agentStatuses',
    'partials/body/firstRow',
    'partials/body/secondaryRow'
], function($, _, Backbone, Marionette, Handlebars, BodyTpl, AgentStatusesCollection, firstRowView, secondRowView) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: BodyTpl,

        className: 'telephony-wrapper',

        events: {

        },

        regions: {
            firstRow: '.primary-row',
            secondRow: '.secondary-row'
        },

        initialize: function(options) {
            var that = this;
            this.collection = options.collection;

            //this.listenTo(this.collection, 'add change remove reset', this.render);
        },

        render: function() {
            /*this.filteredCollection = this.collection.slice(this.collection.models.length - 9);
            //this.filteredCollection = this.collection.models;

            var tpl = Handlebars.compile(this.template({collection: this.filteredCollection}));
            this.$el.html(tpl);

            console.log(this.$el.find('.row > .body-item:first-child').addClass('first-body-element'));
            return this;*/

            var tpl = Handlebars.compile(this.template());
            this.$el.html(tpl);
            this.firstRow.show(new firstRowView({collection: this.collection}));
            //this.firstRow.render();
            this.secondRow.show(new secondRowView({collection: this.collection}));

            var that = this;
            setTimeout(function() {
                var width = 0;

                that.$el.find('.body-item').each(function(index, elem) {
                    width += $(elem).width();
                });

                var wrapperWidth = that.$el.width();
                if(wrapperWidth < width) {
                    that.$el.find('.body-item:first-child').addClass('first-body-element');

                    that.firstRow.$el.children().append(new firstRowView({collection: that.collection}).render().el.children);
                    that.secondRow.$el.children().append(new secondRowView({collection: that.collection}).render().el.children);
                }
            }, 1000);
        }
    });
});

