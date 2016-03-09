/**
 * Created by VladHome on 3/7/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
///<reference path="Service.ts"/>
///<reference path="BasicList.ts"/>
    ///<reference path="../typings/chart.d.ts"/>

    
module callcenter{
    export class Graphs{
        $avTime1:JQuery;
        $avTime2:JQuery;
        $callsHabdled1:JQuery;
        $callsHabdled2:JQuery;
        $ticetsCreated1:JQuery;
        $ticetsCreated2:JQuery;
        $ticketsClosed1:JQuery;
        $ticketsClosed2:JQuery;

        constructor(){
            service.Service.service.dispatcher.on( service.Service.service.ON_HELP_DESK,(evt,data)=>{
                this.setData(data);

                
            })
        }

        private setData(data){
            console.log(data);
                this.setAvTime(data);
        }

        setAvTime(data):void{


        }
    }
}