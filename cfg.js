'use strict';

require.config({
    baseUrl: "",
    paths: {
        jquery                 : 'libs/jquery-2.1.4.min',
        underscore             : 'libs/underscore-min',
        moment             : 'libs/moment.min',
        ListItem:'apps/ListItem2',
        Reg:'com/Registry'
    },
    /*hbs: {
        handlebarsPath: "handlebars"
    },*/
  /*  shim : {
     mjs: {
     exports: 'moment'
     }
     }*/
});

require([
    'jquery',
    'underscore',
    'moment',
    'Reg',
    'apps/App2'
], function($,App) {

    console.log(App);
    var app = new App2();
});

