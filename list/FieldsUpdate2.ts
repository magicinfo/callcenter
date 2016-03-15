/**
 * Created by VladHome on 3/6/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
///<reference path="Service.ts"/>
///<reference path="BasicList.ts"/>
   ///<reference path="../typings/moment.d.ts"/>

module callcente2{
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
        constructor(public $view:JQuery,opts){

                opts.avTime='avTime',
                opts.agendsTotal='agendsTotal';

            this.collection['avTime'] = new TemplateCopm('#avTimeView','#AvTimeTempalte');
          //  this.collection['agendsTotal'] = new FieldComp('#agendsTotal');
           this.collection['inqueue'] = new FieldComp('#inqueue');
           this.collection['current'] = new FieldComp('#CurrntTime');
            this.collection['date'] = new FieldComp('#CurrntDate');
            this.collection['level'] = new FieldComp('#ServiceLevel');
          //  this.collection['TicketsCreated'] = new FieldComp('#TicketsCreated');
           // this.collection['TicketsClosedSameDay'] = new FieldComp('#TicketsClosed');

           // this.$TicketsCreated = $('#TicketsCreated');
          //  this.$TicketsClosed = $('#TicketsClosed');

           // service.Service.service.dispatcher.on( service.Service.service.ON_DATA,(evt,data)=>this.setData(data))
            //service.Service.service.dispatcher.on( service.Service.service.ON_HELP_DESK,(evt,data)=>this.onHelpDeskData(data));


           if(opts.auto){
                this.loadData();
                this.timer = setInterval(()=>{ this.loadData();},2000);
            }
        }

        timer:number;
        current = 1457586000+(60*60*7);
        loadData():void{
            this.current+=(60*5);
            $.get('rem/getCurrent?stamp='+this.current).done((res)=>{
                console.log(res);
                var obj = res.result[0];
                this.collection['level'].setData(obj.level);
                this.collection['inqueue'].setData(obj.inqueue);
                var t:any  = this.formattime(obj.htime);
                this.collection['avTime'].setData(t)

                this.collection['current'].setData(moment.unix(this.current).format('LT'));

                this.collection['date'].setData(moment.unix(obj.stamp).format('LL'));

            })
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
            var out:any={};
            var m:number;
            var s:number;

            var num = Number(data);
            if(!isNaN(num)){
                m=Math.floor(num/60);
                s= num%60;
                 out.v1=m?m:'';
                out.v2=m?'m':'';
                out.v3=s;
                out.v4='s';
                return out;
            }
            console.log(data);
            var out:any={}
            var ht = data.split(':');
            s = Number(ht[2]);
            m= Number(ht[1]);
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
