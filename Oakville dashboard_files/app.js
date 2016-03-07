define([
    'jquery',
    'backbone',
    'marionette',
    'layout/layout'
], function($, Backbone, Marionette, Layout) {
    'use strict';

    var app = new Marionette.Application();

    app.refreshInterval = 60 * 1000;

    // Main Region
    app.addRegions({
        mainRegion: '#main'
    });

    app.mainRegion.show(new Layout({app: app}));

    return app;
});


