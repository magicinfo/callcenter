'use strict';

require.config({
    baseUrl: "js",
    paths: {
        jquery                 : '../bower_components/jquery/dist/jquery',
        backbone               : '../bower_components/backbone/backbone',
        'backbone.wreqr'       : '../bower_components/backbone.wreqr/lib/backbone.wreqr',
        marionette             : '../bower_components/backbone.marionette/lib/backbone.marionette',
        underscore             : '../bower_components/underscore/underscore',
        moment                 : '../bower_components/moment/moment',
        twix                   : '../bower_components/twix/dist/twix',
        papaParse              : '../bower_components/papaparse/papaparse',
        hbs                    : '../bower_components/require-handlebars-plugin/hbs',
        //hbs                    : 'libs/hbs',
        handlebars             : '../bower_components/handlebars/handlebars',
        flowType               : '../bower_components/Flowtype.js/flowtype'
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

