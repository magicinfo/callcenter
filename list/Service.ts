/**
 * Created by VladHome on 3/5/2016.
 */
    ///<reference path="../typings/jquery.d.ts"/>

module service{
    export class Service{
       private listeners:any;
        ON_DATA:string='ON_DATA';
        ON_HELP_DESK:string='ON_HELP_DESK';
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
            this.loadData();
            this.loadHelpDesk();
            this.interval = setInterval(()=>{ this.loadData();},  2000);

        }
        loadHelpDesk():void{
            $.get('rem/getCsv').done((data)=>{
                console.log(data);
                this.dispatcher.triggerHandler(this. ON_HELP_DESK,data);
            }).fail((reason)=>{
                console.log(reason);
            })
        }


    }
}