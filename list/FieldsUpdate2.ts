/**
 * Created by VladHome on 3/6/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
///<reference path="Service.ts"/>
///<reference path="BasicList.ts"/>
   ///<reference path="../typings/moment.d.ts"/>
    ///<reference path="../com/Registry.ts"/>


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
        url:string='http://front-desk.ca/mi/callcenter/rem/getStatus?date=';
        constructor(public $view:JQuery,opts){

            Registry.event.on(Registry.LOAD_DATA,(evt,date)=>{
              this.loadData(date);
            })
                opts.avTime='avTime',
                opts.agendsTotal='agendsTotal';


            this.collection['avTime'] = new TemplateCopm('#avTimeView','#AvTimeTempalte');
          //  this.collection['agendsTotal'] = new FieldComp('#agendsTotal');
           this.collection['inqueue'] = new FieldComp('#inqueue');
           this.collection['current'] = new FieldComp('#CurrentTime');
            this.collection['date'] = new FieldComp('#CurrntDate');
            this.collection['level'] = new FieldComp('#ServiceLevel');
            this.collection['answd'] = new FieldComp('#Answered');
          //  this.collection['TicketsCreated'] = new FieldComp('#TicketsCreated');
           // this.collection['TicketsClosedSameDay'] = new FieldComp('#TicketsClosed');

           // this.$TicketsCreated = $('#TicketsCreated');
          //  this.$TicketsClosed = $('#TicketsClosed');

           // service.Service.service.dispatcher.on( service.Service.service.ON_DATA,(evt,data)=>this.setData(data))
            //service.Service.service.dispatcher.on( service.Service.service.ON_HELP_DESK,(evt,data)=>this.onHelpDeskData(data));


           if(opts.auto){
               // this.loadData();
               // this.timer = setInterval(()=>{ this.loadData();},2000);
            }
        }

        timer:number;
        current = 1457586000+(60*60*7);
        currentDate:string;

        loadData(date:string):void{
            this.currentDate = date;
           // console.log('loadData '+date);
           // this.current+=(60*5);
            $.get(this.url+this.currentDate).done((res)=>{
              //  console.log(res);
                var obj = res.result.list[0];

                this.collection['level'].setData(obj.level);
                this.collection['inqueue'].setData(obj.queue);
                var t:any  = this.formattime(obj.AHT);
               this.collection['avTime'].setData(t);
                this.collection['answd'].setData(obj.answd);
                this.collection['current'].setData(moment(obj.t).format('MMM DD  h:mm'));

              //  this.collection['date'].setData(moment.unix(obj.stamp).format('LL'));

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
           // console.log('formattime  '+data);

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
                out.v3='0';
                out.v4='';
            }else {
                out.v3=s;
                out.v4='s';
            }

            return out;
        }

    }
}
