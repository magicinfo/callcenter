/**
 * Created by VladHome on 3/19/2016.
 */
    ///<reference path="base.ts"/>
    ///<reference path="ListItem2.ts"/>



class List2{
    $view:JQuery;
    $tbody:JQuery;
    $nano:JQuery;
    private template:string;
    constructor(listid:string,options:any){
        for(var str in options)this[str] = options[str];

        this.$view = $(listid);
        this.$tbody =  this.$view.find('[data-id=list]:first');
       this.$nano = this.$view.find('.nano:first');
        require(['base','ListItem','nano'],()=>{
            this.loadData(this.getparams);
        })


       this.template = this.$view.find('[data-id=template]').html();

    }

    getparams:string = '2016-03-15T7:58:34';

    collection:_.Dictionary<ListItem2> ={};
    stamp:number;
    url:string = 'http://front-desk.ca/mi/callcenter/rem/getagents?date=';
    private loadData(date:string):void{
        this.getparams = date;
       console.log(this.url);
        $.get(this.url+date).done((data)=>{
            //   console.log(data);
            this.getparams = data.stamp;
            Registry.event.triggerHandler(Registry.LIST_NEW_DATE,data.stamp)
            Registry.event.triggerHandler(Registry.LIST_NEW_DATA,data);
            var agents = data.result.list;

            console.log(agents);
          this.setData(this.parseData(agents));

            if(this.$nano.length)this.$nano.nanoScroller();
           // $("#AgentsScroll").nanoScroller();
        }).fail((reason)=>{
            console.log(reason);
        })
    }

    parseData(data:any[]):VOAgent[]{
       var ar = data
        var out:VOAgent[] = [];
        var stamp = Date.now();
       for(var i=0,n=ar.length;i<n;i++)out.push(new VOAgent(ar[i],stamp))
        this.stamp= stamp;
         return out;

    }

    setData(data:VOAgent[]){
        var stamp:number = this.stamp;
        var ar = data
        var coll = this.collection;
        for(var i=0,n=ar.length;i<n;i++) {
            var item = ar[i];
            if(coll[item.id]) coll[item.id].setData(item);
            else{
                coll[item.id] = new ListItem2(item,this.template);
                coll[item.id].$view.appendTo(this.$tbody)
               // console.log(coll[item.id].$view);
            }
           // ;
            if(item.stamp!==stamp){
                this.collection[item.id].remove();
                this.collection[item.id]=null;
            }
        }

        console.log(i);
    }



}


class List3 extends List2{
    constructor(listId:string,options){
        super(listId,options);
    }
}
