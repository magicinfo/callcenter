/**
 * Created by VladHome on 3/9/2016.
 */
    ///<reference path="../typings/jquery.d.ts"/>
    ///<reference path="../typings/chartist.d.ts"/>

    
module graphs{

    export class Test2{
        constructor(){
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
               axisY:{
                  showLabel:true
               }
            });

        }

    }
}

$(document).ready(function(){
    var test:graphs.Test2 = new graphs.Test2();
})