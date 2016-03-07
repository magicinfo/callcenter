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
    }


    export class ListItem{
        $icon:JQuery;
        $view:JQuery;
        $id:JQuery;
        id:number;
        stamp:number;
        $timeout:JQuery;

        constructor(item:any){
            this.id = item.id;
            this.$view=$('<tr>');
            this.$icon = $('<td>').appendTo(this.$view);
            this.$id = $('<td>').appendTo(this.$view);
            this.$timeout = $('<td>').appendTo(this.$view);
            this.setData(item);

        }

        setData(item:VOItem):void{
            this.stamp = item.stamp;
            this.$id.text(item.id);
            this.$icon.text(item.code.icon)
            this.$timeout.text(item.timeout);
        }
        remove():void{
            this.$view.fadeOut(()=>{this.$view.remove()})
        }

    }

    export class BasicList {
        collection:_.Dictionary<ListItem>={};
        $table:JQuery;
        $tbody:JQuery;

        constructor(public $view:JQuery) {

            this.$table = $('<table>').addClass('table').appendTo($view);
            this.$tbody = $('<tbody>').appendTo(this.$table);
            service.Service.service.dispatcher.on(service.Service.service.ON_DATA,(evt,data)=>{
                var agenss = data.agents;
                this.setData(agenss);
            })
        }

        setData(data:VOItem[]){
            console.log(data);
            var ar = data;
            var stamp:number = new Date().getSeconds();
            for(var i=0,n=ar.length;i<n;i++){
                var item = ar[i];
                item.stamp = stamp;
                if(this.collection[item.id]) this.collection[item.id].setData(item);
                else this.collection[item.id] = new ListItem(item);
                this.collection[item.id].$view.appendTo(this.$tbody);
            }

            for(var i=0,n=ar.length;i<n;i++) {
                if(item.stamp!==stamp){
                    this.collection[item.id].remove();
                    this.collection[item.id]=null;
                }
            }
        }




    }
}