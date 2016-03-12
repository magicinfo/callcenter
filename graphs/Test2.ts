/**
 * Created by VladHome on 3/9/2016.
 */
    ///<reference path="../typings/jquery.d.ts"/>
    ///<reference path="../typings/chartist.d.ts"/>
///<reference path="../typings/moment.d.ts"/>
    
module graphs{

    export class Test2 {

        private chart:Chartist.IChartistLineChart;
        loadData():void {
            $.get('rem/statistics').done((res)=> {
                console.log(res);
                var labels=[];
                var series=[]
                var graph1=[]
                var ar = res.result;
                var count=0;

                ar.map(function(v){
                    count++;
                    if(count%10){
                      //  console.log(v.stamp);

                        labels.push('');

                    }else {
                        var d = new Date(v.stamp*1000);
                      //  var dd = d.toLocaleString();

                      // moment(d).format('LT');
                        labels.push(moment(d).format('DD/MM')+' '+ moment(d).format('LT'));
                    }

                    graph1.push(v.htime)
                })
                let data={
                    labels:labels,
                    series:[graph1]
                }
                this.drawChart(data);

            })
        }
        private options:any =  {
            showArea: true,
            showLine: true,
            showPoint: false,
            ticks: ['One', 'Two', 'Three'],
            stretch: true,
            // fullWidth: true,
            axisX: {
                showLabel: true,
                showGrid: false
            },
            axisY:{
                showLabel:true
            }
        };

        drawChart(data):void {
            this.chart =  new Chartist.Line(this.selector,data,this.options);
        }




        constructor(private selector:string){
            this.loadData();

            let data:any={};
            data.labels=[1, 2, 3, 4, 5, 6, 7, 8];
            data.series= [
                [1, 2, 3, 1, -2, 0, 1, 0],
            [-2, -1, -2, -1, -2.5, -1, -2, -1],
                [0, 0, 0, 1, 2, 2.5, 2, 1],
                [2.5, 2, 1, 0.5, 1, 0.5, -1, -2.5]
        ];

            this.drawChart(data)


        }

    }
}

