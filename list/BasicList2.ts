/**
 * Created by VladHome on 3/5/2016.
 */
    ///<reference path="../typings/jquery.d.ts"/>
    ///<reference path="../typings/underscore.d.ts"/>
    ///<reference path="Service.ts"/>

interface JQuery{
    nanoScroller():JQuery
}

module dash{

    interface VOState{
        code:string;
        icon:string;
        msg:string;
        status:string
    }
    interface VOCode{
        code:number;
        icon:string;
        msg:string;
    }
    interface VOAgent{
        id:number;
        b_r:number;
        t:number;
        icon:string;
        sort:number;
        stamp:number;
    }



    export class ListItem{
        $icon:JQuery;
        $view:JQuery;
        $id:JQuery;
        id:number;
        stamp:number;
        $timeout:JQuery;

        current:string='';
        timer:number=0;
        constructor(item:any){
            this.id = item.id;
            this.$view=$('<tr>');
            this.$icon = $('<td>').addClass('fa').appendTo(this.$view);
            this.$id = $('<td>').appendTo(this.$view);
            this.$timeout = $('<td>').appendTo(this.$view);
            this.setData(item);
        }

        setData(item:VOAgent):void{
            this.stamp = item.stamp;
            this.$id.text(item.id);
            this.$icon.removeClass(this.current);
            this.current = this.getClass(item.icon);
            this.$icon.addClass(this.current);
            this.setTime(item.t);
        }

        lastTime:number;
        currentTime:number;

        showTime():void{
            var h:number;
            var m:number;
            var s:number;
            var t :number = this.currentTime;
            var d:number;
//console.log('showtime  '+t);

            var out:string ='';
            if(t>60*60){
              //  console.log(t);
                if(t>24*60*60){
                    d=Math.floor(t/(24*60*60));
                    h = t - (d*24*60*60);
                    h = Math.floor(h/(60*60));
                    if(d) this.$timeout.text(d+'day '+h+'hour');
                    else this.$timeout.text(s+'sec');

                }else{
                    h=Math.floor(t/(60*60));
                    m = t - (h*60*60);
                    m = Math.floor(m/60);
                    if(h) this.$timeout.text(h+'H '+m+'m');
                    else this.$timeout.text(m+'m');
                }
            }else {
                m = Math.floor(t/60);
                s= t-(m*60);
                if(m) this.$timeout.text(m+'min '+s+'sec');
                else this.$timeout.text(s+'sec');
            }
        }
        setTime(timeout:any):void{
            var time:number = Number(timeout);
            if(isNaN(time) || time<0){
                clearInterval(this.timer);
                this.timer = 0;
                this.$timeout.text('');
                return;
            }
            if(this.lastTime == time) return;
            this.lastTime = time;
            this.currentTime = time;
            this.showTime();
            if(this.timer == 0)this.timer = setInterval(()=>{
                this.currentTime++;
                this.showTime();
            },1000)

        }
        remove():void{
            this.$view.fadeOut(()=>{this.$view.remove()})
        }

        private getClass(stat:string):string{
            switch(stat){
                case 'busy': return 'fa-minus-circle';
                case 'offline': return 'fa-times-circle';
                case 'lunch': return 'fa-clock-o';
                case 'acd': return 'fa-phone-square';
                case 'notAcd': return 'fa-phone';
                case 'idle': return 'fa-hourglass-half';
                case 'outbound': return 'fa-phone';
                default: console.log(' no icon for '+stat);
                    return stat;
            }
        }

    }

    export class BasicList {
        collection:_.Dictionary<ListItem>={};
        $table:JQuery;
        $tbody:JQuery;
        $BusyCount:JQuery;
        $OfflineCount:JQuery
        $LounchCount:JQuery;
        $AcdCount:JQuery;

        constructor(public $view:JQuery) {
            this.$LounchCount = $('#LounchCount');
            this.$BusyCount = $('#BusyCount');
            this.$OfflineCount = $('#OfflineCount');
            this.$AcdCount = $('#AcdCount');
            this.$tbody = $('#AgentsList');
           this.loadData();
        }

        busyCount:number;
        offlineCount:number;
        lunchCount:number;
        acdCount:number;
        setStats(){
            this.$BusyCount.text(this.busyCount);
            this.$OfflineCount.text(this.offlineCount);
            this.$LounchCount.text(this.lunchCount);
            this.$AcdCount.text(this.acdCount);
        }

        currentDate:string = '2016-03-15T10:58:34';

        url:string = 'http://front-desk.ca/mi/callcenter/rem/getagents.php?date=';
        private loadData():void{
            $.get(this.url+this.currentDate).done((data)=>{
              console.log(data);
                this.currentDate = data.stamp;
                var agents = data.result.list;
                this.setData(agents);
                $("#AgentsScroll").nanoScroller();
            }).fail((reason)=>{
                console.log(reason);
            })
        }


        
        setData(data:VOAgent[]){
            this.busyCount = 0;
            this.offlineCount = 0;
            this.lunchCount =0;
            this.acdCount=0;
           console.log(data);
            var ar = data;
            if(!data) return;
            var stamp:number = new Date().getSeconds();
            for(var i=0,n=ar.length;i<n;i++){
                var item = ar[i];
                item.stamp = stamp;
               // console.log(item.state.code);
               // item.pos = this.getPosition(item.state.icon);
               // console.log( item.pos);
            }

            var ar2 = _.sortBy(ar,'sort');
            for(var i=0,n=ar2.length;i<n;i++) {
                var item = ar2[i];
                if(this.collection[item.id]) this.collection[item.id].setData(item);
                else this.collection[item.id] = new ListItem(item);
                this.collection[item.id].$view.appendTo(this.$tbody);
                if(item.stamp!==stamp){
                    this.collection[item.id].remove();
                    this.collection[item.id]=null;
                }
            }

            this.setStats();

        }




    }
}