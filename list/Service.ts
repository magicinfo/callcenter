/**
 * Created by VladHome on 3/5/2016.
 */
    ///<reference path="../typings/jquery.d.ts"/>
    ///<reference path="../typings/papaparse.d.ts"/>
    ///<reference path="../typings/underscore.d.ts"/>



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
            this.interval = setInterval(()=>{ this.loadData();},  60000);

        }
        loadHelpDesk():void{
            $.get('rem/getCsv').done((resp)=>{
                var res = Papa.parse(resp).data;
                var ar = _.zip(res[0], res[1]);
               // console.log(ar);
                var data:any = this.formatData(ar);

                this.dispatcher.triggerHandler(this. ON_HELP_DESK,[data]);
            }).fail((reason)=>{
                console.log(reason);
            })
        }


        formatData(ar):any{

            var out:any={}
            for(var i=0,n=ar.length;i<n;i++){
                var item = ar[i];
                switch(item[0]){
                    case '# of Tickets Created Today':
                        out.TicketsCreated = item[1];
                        break;
                    case 'Today\'s Same Day Closed':
                        out.TicketsClosedSameDay= item[1];
                        break;
                    case 'Tickets Created This Year':
                        out.TicketsCreatedYear =  item[1];
                        break
                    case 'Tickets Closed within 24 Hours This Year':
                        out.TicketsClosed24HYear =  item[1];
                        break
                    case '% of Calls Closed within 24 Hours This Year':
                        out.CallsClosed24HYear =  item[1];
                        break;
                    case '# of Tickets Opened Last Year':
                        out.TicketsOpenedLastYear =  item[1];
                        break;
                    case '# of Tickets Closed Same Day Last Year':
                        out.TicketsClosedLastYear =  item[1];
                        break;


                }

            }
            return out;
        }

    }
}