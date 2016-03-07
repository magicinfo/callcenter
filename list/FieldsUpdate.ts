/**
 * Created by VladHome on 3/6/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
///<reference path="Service.ts"/>
///<reference path="BasicList.ts"/>
module callcenter{
    interface VOData{
        avitmeM:number;
        avtimeS:number;
        inqeue:number;
        agends:number;

    }

    export class FieldsUpdate{
        $avTimeMin:JQuery;
        $avTimeSec:JQuery;
        $avTimeMinW:JQuery;
        $avTimeSecW:JQuery;
        $inqueue:JQuery;
        $agendsTotal:JQuery;
        $calsHandled:JQuery;
        $ServiceLevel:JQuery;
        $TicketsCreated:JQuery;
        $TicketsClosed:JQuery;
        $Acd:JQuery;
        $OffLine:JQuery;
        $Busy:JQuery;
        $Idele:JQuery;

        constructor(){
            this.$avTimeMin= $('#avTimeMin');
            this.$avTimeSec=$('#avTimeSec');
            this.$avTimeMinW= $('#avTimeMinW');
            this.$avTimeSecW=$('#avTimeSecW');
            this.$inqueue = $('#inqueue');

            this.$agendsTotal = $('#agendsTotal');
            this.$calsHandled = $('#calsHandled');
            this.$ServiceLevel = $('#ServiceLevel');
            this.$TicketsCreated = $('#TicketsCreated');
            this.$TicketsClosed = $('#TicketsClosed');
            this.$Acd = $('#Acd');
            this.$OffLine= $('#Offline');
            this.$Busy = $('#Busy');
            this.$Idele = $('#Idle');
            service.Service.service.dispatcher.on( service.Service.service.ON_DATA,(evt,data)=>{
                this.setData(data);
            })


        }

        setData(data){
            var q=data.queue[0];
           // console.log(q);

            this.$ServiceLevel.text(q.level);
            this.$calsHandled.text(q.answered);
            this.$agendsTotal.text(data.agents.length);
            this.$inqueue.text(q.inqueue);
           this.setHtime(q.handlingtime);


          // console.log(data);


        }

        private setHtime(data):void{
            var ht = data.split(':');
            var s:number = Number(ht[2]);
            var m:number = Number(ht[1]);
            if(m==0){
                this.$avTimeMinW.hide();
                this.$avTimeMin.hide();
            }else{
                this.$avTimeMinW.show();
                this.$avTimeMin.show();
                this.$avTimeMin.text(m);
            }

            if(s==0){
                this.$avTimeSecW.hide();
            }else  this.$avTimeSecW.show();
            this.$avTimeSec.text(s);

        }


    }
}
