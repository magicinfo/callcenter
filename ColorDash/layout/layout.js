define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'handlebars',
  //  'hbs!layout/templates/layout',
  //  'partials/head/views/head',
  //  'partials/body/body',
   // 'partials/footer/footer',
   // 'collections/ticketsStats',
   // 'collections/agentStatuses',
   // 'collections/queueStatuses'
], function($, _, Backbone, Marionette, Handlebars, LayoutTpl, HeadView, BodyView, FooterView, TicketsCollection, AgentStatusesCollection, queueStatusesCollection) {
    'use strict';

    return Marionette.LayoutView.extend({
        template: LayoutTpl,

        regions: {
            head: '#telephonyHeader',
            body: '#telephonyBody',
            footer: '#SharePointSection'
        },

        initialize: function(options) {
            var that = this;

            this.app = options.app;

            this.ticketsStats = new TicketsCollection();
            this.agentStatuses = new AgentStatusesCollection();
            this.queueStatuses = new queueStatusesCollection();

            this.agentsAmount = 0;

            this.agentStatuses.fetch();
            setInterval(function() {
                that.agentStatuses.fetch();
            }, this.app.refreshInterval);

            this.listenTo(this.agentStatuses, 'add change remove reset', this.setAgentsAmount);
        },

        setAgentsAmount: function() {
            var that = this;
            if(this.agentStatuses.models.length) {
                that.agentsAmount = this.agentStatuses.models[0].get('agentsAmount');
            }

            setTimeout(function() {
                that.head.$el.find('#agentsAmount').html(that.agentsAmount);
            }, 1000);
        },

        render: function() {
            var tpl = Handlebars.compile(this.template());
            this.$el.html(tpl);

            this.head.show(new HeadView({
                app: this.app,
                ticketsStats: this.ticketsStats,
                queueStatuses: this.queueStatuses
            }));

            this.body.show(new BodyView({collection: this.agentStatuses}));

            this.footer.show(new FooterView({
                ticketsStats: this.ticketsStats,
                queueStatuses: this.queueStatuses
            }));

            //var fontSize = $(window).width()/200;
            //$('body').css('font-size', fontSize);
            //
            //$(window).resize(function() {
            //    var fontSize = $(window).width()/200;
            //    $('body').css('font-size', fontSize);
            //});
        }
    });

});

