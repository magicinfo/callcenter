define([
    'jquery',
    'underscore',
    'handlebars'
], function($, _, Handlebars) {
    'use strict';

    return function(container) {

        var currentTallest = 0,
            currentRowStart = 0,
            rowDivs = new Array(),
            $el,
            //topPosition = 0,
            currentDiv;
        $(container).each(function() {

            $el = $(this);
            $($el).height('auto');

            //topPosition = $el.position().top;

            ////if (currentRowStart != topPosition) {
            //    for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
            //        rowDivs[currentDiv].height(currentTallest);
            //    }
            //    rowDivs.length = 0; // empty the array
            //    currentRowStart = topPosition;
            //    currentTallest = $el.height();
            //    rowDivs.push($el);
            //} else {
                rowDivs.push($el);
                currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
            //}
            for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
                rowDivs[currentDiv].height(currentTallest);
            }
            //$(container).css('height', '100%');
            // $(container).parent().height(currentTallest);
        });
    };
});