/**
 * Created by VladHome on 3/5/2016.
 */
    ///<reference path="../typings/jquery.d.ts"/>
    ///<reference path="../typings/underscore.d.ts"/>
    ///<reference path="Service.ts"/>


module desh{

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
    interface VOItem{
        id:number;
        name:string;
        code:VOCode;
        state:VOState;
        stamp:number;
        timeout:string;
        pos:number;
    }


    export class ListItem{
        $icon:JQuery;
        $view:JQuery;
        $id:JQuery;
        id:number;
        stamp:number;
        $timeout:JQuery;

        current:string='';
        constructor(item:any){
            this.id = item.id;
            this.$view=$('<tr>');
            this.$icon = $('<td>').addClass('fa').appendTo(this.$view);
            this.$id = $('<td>').appendTo(this.$view);
            this.$timeout = $('<td>').appendTo(this.$view);
            this.setData(item);
        }

        setData(item:VOItem):void{
            this.stamp = item.stamp;
            this.$id.text(item.id);
            this.$icon.removeClass(this.current);
            this.current = this.getClass(item.code.icon);
            this.$icon.addClass(this.current);
            this.$timeout.text(item.timeout);
        }
        remove():void{
            this.$view.fadeOut(()=>{this.$view.remove()})
        }

        private getClass(stat:string):string{
            switch(stat){
                case 'busy': return 'fa-minus-circle';
            }
        }

    }

    export class BasicList {
        collection:_.Dictionary<ListItem>={};
        $table:JQuery;
        $tbody:JQuery;
        $BusyCount:JQuery;

        constructor(public $view:JQuery) {

            this.$BusyCount = $('#BusyCount');
            this.$table = $('<table>').addClass('table').appendTo($view);
            this.$tbody = $('<tbody>').appendTo(this.$table);
            service.Service.service.dispatcher.on(service.Service.service.ON_DATA,(evt,data)=>{
                var agenss = data.agents;
                this.setData(agenss);
            })
        }
        busyCount:number;
        setStats(){
            this.$BusyCount.text(this.busyCount);
        }

        getPosition(stat:string):number{
            switch (stat){
                case 'busy':
                    this.busyCount++;
                    return 1;

                default : return 9;
            }
        }
        setData(data:VOItem[]){
            this.busyCount = 0
           // console.log(data);
            var ar = data;
            var stamp:number = new Date().getSeconds();
            for(var i=0,n=ar.length;i<n;i++){
                var item = ar[i];
                item.stamp = stamp;
                item.pos = this.getPosition(item.state.icon);
               // console.log( item.pos);
            }

            var ar2 = _.sortBy(ar,'pos');
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