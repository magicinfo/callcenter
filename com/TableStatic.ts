/**
 * Created by VladHome on 3/19/2016.
 */
    ///<reference path="base.ts"/>

module table4 {

   // import CellValue = tableInfin.CellValue;
    import TableRow = table2.ListRow
    declare var Formatter:any;

  interface  VOItem{
        key:string
        id:number;
       stamp:number;
        t:number;
        icon:string;
        sort:number;
        msg:string;
    }

   export class Table {
        $view:JQuery;
        $tbody:JQuery;
        $nano:JQuery;
       ON_SCROLL_FULL:string='ON_SCROLL_FULL';
       ON_SCROLL_0:string='ON_SCROLL_0';

        onData = function (data) {
            console.log(data);
        }
        private template:string;

       isUp:boolean;
       $nanoContent:JQuery;
       $disp:JQuery=$({});

       toprow:number= 0;
       currentScroll:number=0;

       scrollOneUp():void{
           if(!this.$nanoContent) this.$nanoContent = this.$nano.find('.nano-content');
           if(this.$nanoContent.length ===0){
               console.log('error no nanocontent ');
               return;
           }
          var len =  this.$tbody.children().length;

          var h:number = this.$tbody.children(this.toprow++).height();
           this.currentScroll+=h;

            var max = this.$nanoContent[0].scrollHeight-this.$nanoContent.height();
           console.log('this.currentScroll   '+this.currentScroll + ' max  '+max);
            if(this.currentScroll > max) this.$disp.triggerHandler(this.ON_SCROLL_FULL);
            else this.$nanoContent.animate({'scrollTop':this.currentScroll},500);
        //  console.log(this.$nanoContent[0].scrollHeight-this.$nanoContent.height());
       }

       scrollFullUp():void{
           //jQuery.fx.interval = 50;
           if(!this.$nanoContent) this.$nanoContent = this.$nano.find('.nano-content');
           this.$nanoContent.animate({'scrollTop':0},1000,null,()=>{
               this.$disp.triggerHandler(this.ON_SCROLL_0);
           });

       }

        constructor(private listid:string, private options:any) {
            for (var str in options)this[str] = options[str];
            setInterval(()=>{this.scrollOneUp()},1000);

            this.$disp.on(this.ON_SCROLL_FULL,(evt)=>{
                this.scrollFullUp();
            });
            this.$disp.on(this.ON_SCROLL_0,(evt)=>{
                this.toprow = 0;
                this.currentScroll = 0;
            });
        }

       init():void{
           this.$view = $(this.listid);
           this.$tbody = this.$view.find('[data-id=list]:first');
           this.$nano = this.$view.find('.nano:first');

           this.template = this.$view.find('[data-id=template]').html();
       }

        getparams:string = '2016-03-15T7:58:34';

        collection:_.Dictionary<TableRow> = {};
        stamp:number;
        geturl:string = 'http://front-desk.ca/mi/callcenter/rem/getagents?date=';

        loadData():void {
            this.getparams;
            var url = this.geturl + this.getparams

            $.get(url).done((data)=> {
                //   console.log(data);
                this.onData(data);
               // this.setData(data);


            }).fail((reason)=> {
                console.log(reason);
            })
        }

       rows:TableRow[];
       private data:VOItem[];
       setDataDone():void{
        // this.removeItems();
       }

       currentStamp:number;

        setData(data:VOItem[]) {
            this.data = data;
            this.current = Date.now();
            this.rows = [];
            this.current = -1;
            this.renderData();
        }

       renderData():void{
           this.current++;
           if(this.current >= this.data.length){
               this.setDataDone();
               return;
           }
           // console.log(this);
            var ar = this.data;
            var coll = this.collection;
           // for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[this.current];
                item.stamp = this.current;

                if (coll[item.key])coll[item.key].setData(item);
                else  {
                    coll[item.key] = new TableRow(item);
                    coll[item.key].template =  this.template;
                    coll[item.key].appendTo(this.$tbody);
                }

                this.rows.push(coll[item.key]);
                setTimeout(()=>{this.renderData()},20);
           //coll[item.key].insertAt(this.$tbody, this.current) ;
           // }




        }


       private removeItemsDone():void{
           this.current = -1;
           this.sortOrder();
       }
       private sortOrderDone():void{


       }
       private current:number;
       sortOrder():void{
           this.current ++;
           if(this.current >= this.rows.length){
               this.sortOrderDone();
               return;
           }
          // this.views;
           var ar = this.rows;
               var item = ar[ this.current];
               if(item.order != this.current){
                   item.insertAt(this.$tbody, this.current) ;
                   setTimeout(()=>this.sortOrder(),2);
               }
       }

       removeItems():void{
           var ar = this.data
           var coll = this.collection;
           // console.log(coll);
           for(var str in coll){
               if(coll[str] && coll[str].stamp !== this.stamp){
                   coll[str].remove();
                 //this.collection[str] = null;
               }
           }

           this.removeItemsDone();
       }

    }


////////////////////////////////////////////////////////////////////////

    export class CellValue extends table.ItemValue{

        setValue(val:string):boolean{
            if(val == this.value) return false;
            this.$view = Formatter[this.index](this.$view,val);
            this.value = val;
            return true;
        }


    }



/////////////////////////////////////////////////////////////////////////////////////////////
    setInterval(function(){ CellValue.disp.triggerHandler('time',-1)},1000);

}