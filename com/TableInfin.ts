/**
 * Created by VladHome on 3/19/2016.
 */
    ///<reference path="base.ts"/>
    ///<reference path="Collection.ts"/>


module table {

    import ListRow = table2.ListRow;
    declare var Formatter:any;
    import TableRow = table2.ListRow;
    import CellValue = table.ItemValue;
/////////////////////////////////////////////////////////////////////////////////////////////
        setInterval(function(){ CellValue.disp.triggerHandler('time',-1)},1000);



   export class TableInfin {
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
       data:DataCollection;

       /*scrollOneUp():void{
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

       }*/

        constructor(private listid:string, private options:any) {
            for (var str in options)this[str] = options[str];
            this.data = new DataCollection();

           // setInterval(()=>{this.scrollOneUp()},1000);
            this.$disp.on(this.ON_SCROLL_FULL,(evt)=>{
               // this.scrollFullUp();
            });
            this.$disp.on(this.ON_SCROLL_0,(evt)=>{
                this.toprow = 0;
                this.currentScroll = 0;
            });
        }


       timer:number=0;

       scrollStart():void{
           if(this.timer !==0)return
           this.timer = setInterval(()=>this.scrollNext(),2000);

       }
       scrollstop(reason:string):void{
           console.log('stop scroll '+reason);
           clearInterval(this.timer);
           this.timer = 0;
       }

       scrollNext():void{
           if(this.rows.length>=this.data.length){
               this.current=0;
               this.scrollstop(' not enogh data');
               return;
           }
           this.current++;
           if(this.current>=this.data.length) this.current=0;
           if(this.current >= this.rows.length){
               this.rows.push()
           }

               this.rows[this.current];
           var item:TableRow = this.data.data[this.current];

           console.log(item);


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

       setDataDone():void{
        // this.removeItems();
           this.scrollStart();
           console.log('setdatadone');
       }



       current:number;
       height:number;
        setData(data:VOItem[]) {
            this.data.setData(data);
            if(!this.$nanoContent){
                this.rows=[];
                this.current=-1;
                this.renderData();
            }        }

       setStamp(stamp:number):void{


       }

       renderData():void{
           this.$nanoContent = this.$nano.find('.nano-content');
           this.height = this.$nanoContent.height();
           console.log('this.height '+this.height);
           this.current++;
           if(this.current >= this.data.length){
               this.setDataDone();
               return;
           }
            var ar = this.data.data;
         var row = this.data.data[this.current];
           row.template = this.template;
          row.appendTo(this.$tbody);
           this.rows.push(row);
           if(this.$tbody.height() > this.height) this.setDataDone();
           else setTimeout(()=>{this.renderData()},20);

        }
    }


  /*  class DataStore {
        data:VOItem[];
        dataInd:_.Dictionary<VOItem>;
        olddata:VOItem[];
        exists:VOItem[];
        newdata:VOItem[];
        length:number;

        sortData(data:VOItem[]):void {
            var newAr = [];
            var exists = [];
            var oldAr = [];
            var newInd = _.indexBy(data, 'key');
            if(this.data){
                _.map(this.data, function (val) {
                    if (!newInd[val.key])oldAr.push(val)
                });
                // console.log('old',oldAr);
                var dataInd = this.dataInd;
                _.map(data, function (val) {
                    if (dataInd[val.key]) exists.push(val);
                    else  newAr.push(val);
                });
            }
            // console.log('new',newAr);
            //
            this.length = data.length;
            this.data = data;
            this.olddata = oldAr;
            this.newdata = newAr
            this.exists = exists;
            this.dataInd = newInd;
        }
    }*/

////////////////////////////////////////////////////////////////////////




}