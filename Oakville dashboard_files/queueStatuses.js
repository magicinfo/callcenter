define([
    'jquery',
    'underscore',
    'moment',
    'backbone',
    'models/queueStatus',
    'helpers/Time'
], function($, _, moment, Backbone, queueStatusModel, timeHelper) {
    'use strict';

    return Backbone.Collection.extend({
        url  : 'js/ajax/Oakville_public/queuestatus.xml',

        model: queueStatusModel,

        parse: function(response) {

            var parsedResponse = [];
            $(response).find('XMLQueue').each(function() {
                var name = $(this).find('Name').text();
                var id = $(this).find('QueueID').text();
                var serviceLevel = $(this).find('ServiceLevel').text();
                var callsQueue = $(this).find('NumCallsInQueue').text();
                var handlingTime = $(this).find('AverageHandlingTime').text();
                var callsAnswered = $(this).find('NumCallsAnswered').text();

                var agent = {
                    name: name,
                    id: id,
                    serviceLevel: serviceLevel,
                    callsQueue: callsQueue,
                    handlingTime: handlingTime,
                    callsAnswered: callsAnswered
                };
                parsedResponse.push(agent);
            });

            var resp = {
                callsQueue: 0,
                callsAnswered: 0,
                averageTimeSeconds: 0,
                serviceLevel: 0
            };
            _.each(parsedResponse, function(obj) {
                var start = moment('00:00:00', 'hh:mm:ss');
                var time = moment(obj.handlingTime, 'hh:mm:ss');


                resp.callsQueue += Number(obj.callsQueue);
                resp.callsAnswered += Number(obj.callsAnswered);
                resp.averageTimeSeconds += Number(time.diff(start, 'seconds'));
                resp.serviceLevel += Number(obj.serviceLevel);
            });

            resp.averageTimeSeconds = Math.floor(resp.averageTimeSeconds / parsedResponse.length);

            resp.averageTime = timeHelper.formatAverageTime(resp.averageTimeSeconds);

            resp.serviceLevel = Math.round(resp.serviceLevel / parsedResponse.length);

            //return parsedResponse;
            return resp;
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