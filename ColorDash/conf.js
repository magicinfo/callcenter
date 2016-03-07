'use strict';

require.config({
    baseUrl: "ColorDash",
    paths: {
        jquery                 : 'jquery',
        backbone               : 'backbone',
        'backbone.wreqr'       : 'backbone.wreqr',
        marionette             : 'backbone.marionette',
        underscore             : 'underscore',
        moment                 : 'moment',
        twix                   : 'twix',
        papaParse              : 'papaparse',
        hbs                    : 'hbs',
        //hbs                    : 'libs/hbs',
        handlebars             : 'handlebars',
        flowType               : 'flowtype'
    },
    /*hbs: {
        handlebarsPath: "handlebars"
    },*/
    shim : {
        backbone               : {
            deps   : ['jquery', 'underscore'],
            exports: 'Backbone'
        }
    }
});

require([
    'jquery',
    'backbone',
    'marionette',
    'app'
], function($, Backbone, Marionette, App) {

    App.start();
});

