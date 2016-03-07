define([
    'jquery',
    'underscore',
    'backbone',
    'papaParse',
    'moment',
    'helpers/Time'
], function($, _, Backbone, papaParse, moment, TimeHelpers) {
    'use strict';

    console.log(papaParse);
    return Backbone.Collection.extend({
        url  : 'js/ajax/Oakville_public/HelpDeskScreen.csv',

        parse: function(response) {

            var res = papaParse.parse(response);

            var parsedResponse = _.zip(res.data[0], res.data[1]);

            var filteredResponse = _.map(parsedResponse, function (response) {
                return {
                    value: response[1],
                    year: moment().year()
                }
            });

            filteredResponse[6].year = moment().subtract(1, 'y').year();

            filteredResponse[5].year = moment().subtract(1, 'y').year();
            //filteredResponse[5] = TimeHelpers.roundedAverageAnswer(filteredResponse[5].value);

            // push undefined values for last year
            filteredResponse.push({
                value: 'N/A',
                year: moment().subtract(1, 'y').year()
            });

            return filteredResponse;
        },

        fetch: function (options) {
            options = options || {};
            options.dataType = "text";
            return Backbone.Collection.prototype.fetch.call(this, options);
        },

        comparator: function(model) {
            return model.get('id');
        }
    });
});