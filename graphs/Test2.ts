/**
 * Created by VladHome on 3/9/2016.
 */
    ///<reference path="../typings/jquery.d.ts"/>
    ///<reference path="../typings/chartist.d.ts"/>
///<reference path="../typings/moment.d.ts"/>
    ///<reference path="../typings/underscore.d.ts"/>
///<reference path="../typings/bootstrap.v3.datetimepicker.d.ts"/>

    ///<reference path="../com/Registry.ts"/>

module graphs{

    import DP = BootstrapV3DatetimePicker;
   // import interpolateNumber = d3.interpolateNumber;
   // import stream = d3.geo.stream;
   // import text = d3.text;
    var emmiter:JQuery=$({});
    var ON_DATE_CAHGED:string='ON_DATA_CAHGED';
    export class DatesPicker{
        from:number;
        to:number;
        FromDP:DP.Datetimepicker;
        ToDP:DP.Datetimepicker;
        $From:JQuery;
        $To:JQuery;

        constructor(options){

           this.$From =  $('#datetimepicker6').datetimepicker();
            this.FromDP =  this.$From.data('DateTimePicker');
            this.$To = $("#datetimepicker7").datetimepicker({
                useCurrent: false //Important! See issue #1075
            });

            if(!options.datePicker){
                this.$From.hide();
                this.$To.hide();
                return
            }
            this.ToDP =  this.$To.data('DateTimePicker');


            this.$From.on("dp.change", function (e:DP.DatetimepickerEventObject) {
               // this.from = e.date.format('X');
                $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
               // console.log(this.from);
                //emmiter.triggerHandler()
            });

            this.$To.on("dp.change", function (e) {

                $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);

            });


            this.$From.on("dp.hide",(evt)=>{
                var val:number = Number(this.FromDP.date().format('X'));
                if(this.from!==val && this.to){
                    this.from = val;
                    emmiter.trigger(ON_DATE_CAHGED,[this.from,this.to]);
                }
                this.from = val;
            })

            this.$To.on("dp.hide",()=>{

                var val:number = Number(this.ToDP.date().format('X'));
                console.log(val);
                if(this.to!==val && this.from){
                    this.to = val;
                    emmiter.triggerHandler(ON_DATE_CAHGED,[this.from,this.to])
                }
                this.to = val;
            })
        }
    }

    export class LineChart {

        private chart:Chartist.IChartistLineChart;

        addVerticalLines():void{
           this.options.plugins= [
                Chartist.plugins.verticalLine({
                    position: 'v'
                })
               ]
        }

        loadData(from:string,to:string):void {
           var loading:string = moment(from).calendar()+' to: '+ moment(to).calendar();

            var url = _.template(this.url)({from:from,to:to});
           // console.log(url);
            $('#DateRange').text(loading);
            $.get(url).done((res)=> {
               // console.log(res);
                this.addVerticalLines();
                var labels=[];
                var series=[]
                var htime=[];
                var service=[];
                var inqueue=[];
                var ar = res.result;
                var count=0;
                ar.map(function(v){
                    count++;
                    if(count%10){
                      //  console.log(v.stamp);
                       // if(!(count%9)) labels.push('v');
                      /// else
                        labels.push('');

                    }else {
                        var d = new Date(v.stamp*1000);
                      //  var dd = d.toLocaleString();

                      // moment(d).format('LT');

                        labels.push(moment(d).format('DD')+' '+ moment(d).format('LT'));
                    }
                    service.push(v.level);
                    htime.push(v.AHT/3);
                    inqueue.push(v.queue*35);
                })
                let data={
                    labels:labels,
                    series:[htime,service,inqueue]
                }
                this.drawChart(data);
$('#RangeTotal').text(count);
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


        url:string='http://front-desk.ca/mi/callcenter/rem/getstatusgraph?from=<%=from%>&to=<%=to%>';

        constructor(private selector:string,options:any){


            Registry.event.on(Registry.LOAD_DATA,(evt,date:string)=>{
                date = date.replace(' ','T');
                var ar = date.split('T');
                ar[1]=Registry.data[Registry.WORK_START_TIME];
               var start:string = ar.join('T');
                this.loadData(start,date)

            })
                var p:DatesPicker = new DatesPicker(options || {});


            emmiter.on(ON_DATE_CAHGED,(evt,val1,val2)=>{
                console.log(val1,val2);
              //  this.loadData(val1,val2);
            })




          //  this.loadData(0,Number(moment().format('X')));

        }


    }
}

