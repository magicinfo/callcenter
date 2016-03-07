/**
 * Created by VladHome on 3/5/2016.
 */
    ///<reference path="../typings/jquery.d.ts"/>

module service{
    export class Service{
       private listeners:any;
        ON_DATA:string='ON_DATA';
        private agents:any[];
        private queue:any[];
        dispatcher:JQuery=$({});
        static service:Service = new Service();
        private loadData():void{
            $.get('rem/agents').done((data)=>{
                this.dispatcher.triggerHandler(this.ON_DATA,data);
            }).fail((reason)=>{
                console.log(reason);
            })
        }
        interval:number;
        start():void{
            this.interval = setInterval(()=>{ this.loadData();},  2000);

        }

    }
}