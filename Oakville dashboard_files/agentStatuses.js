define([
    'jquery',
    'underscore',
    'backbone',
    'models/agentStatus',
    'moment',
    'twix',
    'helpers/Time'
], function($, _, Backbone, agentStatusModel, moment, twix, timeHelper) {
    'use strict';

    return Backbone.Collection.extend({
        url  : 'js/ajax/Oakville_public/agentstatus.xml',

        model: agentStatusModel,

        parse: function(response) {

            var parsedResponse = [];

            //var agentsAmount = $(response).find('XMLAgent').length;

            $(response).find('XMLAgent').each(function() {
                var name = $(this).find('Name').text();
                var id = $(this).find('AgentID').text();
                var busyReason = $(this).find('MakeBusyReason').text();
                var state = $(this).find('State').text();
                var date = $(this).find('EventDateTime').text();

                //var dateFrom = moment(date).fromNow();
                //dateFrom = dateFrom === 'Invalid date' ? '' : dateFrom;
                var now = moment();
                var range = moment(date).twix(now);
                range = range.asDuration("days");

                var formattedCountdown = timeHelper.formatTime(range._data);
                var refreshType = timeHelper.setRefreshInterval(range._data);

                var agent = {
                    name: name,
                    id: id,
                    busyReason: busyReason,
                    state: state,
                    date: date,
                    countdown: formattedCountdown
                    //agentsAmount: agentsAmount
                };

                agent.icon = timeHelper.setIcon(agent);

                if(!(agent.icon == 'noicon')) {
                    parsedResponse.push(agent);
                }
            });

            parsedResponse[0].agentsAmount = parsedResponse.length;
            return parsedResponse;
        },

        fetch: function (options) {
            options = options || {};
            options.dataType = "xml";
            return Backbone.Collection.prototype.fetch.call(this, options);
        },

        comparator: function(model) {
            return model.get('id');
        }
    });
});