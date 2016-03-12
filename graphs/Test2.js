/**
 * Created by VladHome on 3/9/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
///<reference path="../typings/chartist.d.ts"/>
var graphs;
(function (graphs) {
    var Test2 = (function () {
        function Test2() {
            new Chartist.Line('#Chart2', {
                labels: [1, 2, 3, 4, 5, 6, 7, 8],
                series: [
                    [1, 2, 3, 1, -2, 0, 1, 0],
                    [-2, -1, -2, -1, -2.5, -1, -2, -1],
                    [0, 0, 0, 1, 2, 2.5, 2, 1],
                    [2.5, 2, 1, 0.5, 1, 0.5, -1, -2.5]
                ]
            }, {
                showArea: true,
                showLine: true,
                showPoint: true,
                // fullWidth: true,
                axisX: {
                    showLabel: false,
                    showGrid: false
                },
                axisY: {
                    showLabel: true
                }
            });
        }
        return Test2;
    })();
    graphs.Test2 = Test2;
})(graphs || (graphs = {}));
$(document).ready(function () {
    var test = new graphs.Test2();
});
//# sourceMappingURL=Test2.js.map