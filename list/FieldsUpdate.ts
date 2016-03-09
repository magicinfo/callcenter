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

    export class TemplateCopm{
        $view:JQuery;
        template:any;

        constructor(view:string,template:string){
            this.template = _.template($(template).html());
            this.$view= $(view);
        }
        setData(data):void{
            this.$view.html(this.template(data));
        }

    }

    export class FieldComp{
        $view:JQuery;
        constructor(private strId:string){
            this.$view = $(strId);
        }
        setData(str:string):void{
            this.$view.text(str);
        }
    }

    export class FieldsUpdate{
        $TicketsCreated:JQuery;
        $TicketsClosed:JQuery;
        private collection:any={}
        constructor(){
            var opts={
                avTime:'avTime',
                agendsTotal:'agendsTotal'
            }
            this.collection['avTime'] = new TemplateCopm('#avTimeView','#AvTimeTempalte');
            this.collection['agendsTotal'] = new FieldComp('#agendsTotal');
            this.collection['inqueue'] = new FieldComp('#inqueue');
            this.collection['answered'] = new FieldComp('#calsHandled');
            this.collection['level'] = new FieldComp('#ServiceLevel');
            this.collection['TicketsCreated'] = new FieldComp('#TicketsCreated');
            this.collection['TicketsClosedSameDay'] = new FieldComp('#TicketsClosed');

           // this.$TicketsCreated = $('#TicketsCreated');
            this.$TicketsClosed = $('#TicketsClosed');
            service.Service.service.dispatcher.on( service.Service.service.ON_DATA,(evt,data)=>this.setData(data))
            service.Service.service.dispatcher.on( service.Service.service.ON_HELP_DESK,(evt,data)=>this.onHelpDeskData(data));
        }

        onHelpDeskData(data):void{
            console.log(data);
            this._setData(data);
        }

       private  _setData(data):void{
            for(var str in data) if( this.collection[str])this.collection[str].setData(data[str]);
        }
        setData(data){
            var q:any = this.formatData(data);
           // console.log(q);
            this._setData(q);

        }

        formatData(data):void{
            var q = data.queue[0];
            q.agendsTotal=data.agents.length;
            q.avTime = this.formattime(q.handlingtime);

            return q;
        }

        private formattime(data):any{
            console.log(data);
            var out:any={}
            var ht = data.split(':');
            var s:number = Number(ht[2]);
            var m:number = Number(ht[1]);
            if(m==0){
                out.v1='';
                out.v2='';
            }else{
                out.v1=m;
                out.v2='m';
            }
            if(s==0){
                out.v3='';
                out.v4='';
            }else {
                out.v3=s;
                out.v4='s';
            }
            console.log(out);
            return out;
        }

    }
}
