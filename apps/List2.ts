/**
 * Created by VladHome on 3/19/2016.
 */
    ///<reference path="base.ts"/>
    ///<reference path="ListItem2.ts"/>
    ///<reference path="../typings/greensock.d.ts"/>



module listU {

   // import ListItem = dash.ListItem;
    class VOItem{
        key:number
        id:number;
       stamp:number;
        t:number;
        icon:string;
        sort:number;
        msg:string;
        constructor(obj:any){
            for(var str in obj)this[str]=obj[str];
        }
    }

   export class List2 {
        $view:JQuery;
        $tbody:JQuery;
        $nano:JQuery;
        onData = function (data) {
            console.log(data);
        }
        private template:string;

       isUp:boolean;
       $nanoContent:JQuery;

       scrollUp():void{
           //jQuery.fx.interval = 50;

           if(!this.$nanoContent) this.$nanoContent = this.$nano.find('.nano-content');
           var h:number = this.$nanoContent[0].scrollHeight-this.$nanoContent.height();
           if(this.isUp){
              // TweenMax.to(this.$nanoContent.children(0),3,{y:0});
             this.$nanoContent.animate({'scrollTop':0},2000);
               this.isUp= false;
           }
           else{
              // TweenMax.to(this.$nanoContent.children(0),3,{y:-h});
              // console.log(h);
               this.$nanoContent.animate({'scrollTop':h},2000);
               this.isUp= true;
           }
       }

        constructor(private listid:string, private options:any) {
            for (var str in options)this[str] = options[str];
        }

       init():void{
           this.$view = $(this.listid);
           this.$tbody = this.$view.find('[data-id=list]:first');
           this.$nano = this.$view.find('.nano:first');

           //require(['nano'], ()=> {
           //  this.loadData(this.getparams);
           // })


           this.template = this.$view.find('[data-id=template]').html();
       }

        getparams:string = '2016-03-15T7:58:34';

        collection:_.Dictionary<ListRow> = {};
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



       rows:ListRow[];



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
                else  coll[item.key] = new ListRow(item, this.template);

                this.rows.push(coll[item.key]);
                setTimeout(()=>{this.renderData()},20);
           coll[item.key].insertAt(this.$tbody, this.current) ;
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



    class ItemValue {
        $view:JQuery;
        setValue(val:string):void{
            switch(this.type){
                case 'text':
                    this.$view.text(val);
                    break;
                case 'img':
                  //  return $oldEl.css('background-image', 'url(' + val + ')');
                    break;
                case 'class':
                  this.$view.attr('class', val);
                    break;
            }

        }

        constructor(public index:string, public el:HTMLElement, public type:string){
            if(index=='fa'){
                this.setValue = (val)=>{
                    var $old = this.$view;
                    var $el =  $old.clone();
                    setTimeout(()=>{
                        $old.hide('slow',()=>{
                            $old.remove();
                        });
                    },500);
                    $el.appendTo($old.parent());
                    $el.attr('class', val);
                    this.$view = $el;
                }
            }
            if(index=='aux'){
                this.setValue = (val)=>{
                    var $old = this.$view;
                    var $el =  $old.clone();
                    setTimeout(()=>{
                        $old.hide('slow',()=>{
                            $old.remove();
                        });
                    },500);
                    $el.appendTo($old.parent());
                    $el.text(val);
                    this.$view = $el;
                }
            }
            this.$view = $(el);
        }
    }


    class ListRow {
        $view:JQuery;
        id:number;
        stamp:number;
        $timeout:JQuery;
        current:string = '';
        timer:number = 0;
        rc:R_C;
        order:number;
       // data:VOItem;
        private item:VOItem;
        //$els:_.Dictionary<JQuery>;

        values:_.Dictionary<ItemValue>

        constructor(item:any, template:string) {
            this.stamp = item.stamp;
            this.id = item.id;
            var $view = $(template);
            var $els:any  = {};

            var values:any ={};



          /*  this.$view.find('[data-id]').each(function (i, el:HTMLElement) {
                var ind:string = String(el.getAttribute('data-id'));
                var type:string = String(el.getAttribute('data-type'));
                values[ind] = new ItemValue(ind,el,type);
            })
*/
            this.createCollection(values,'data-text','text', $view);
            this.createCollection(values,'data-vis','vis', $view);
           this.createCollection(values,'data-img','img', $view);
            this.createCollection(values,'data-chk','chk', $view);
            this.createCollection(values,'data-class','class',$view);

            $view.hide();
            this.$view = $view;
            this.values = values;
            this.item = new VOItem({});

           // this.rc = new R_C(this.$view);
         //   this.rc.addListener('fa',(res)=>{
          //      console.log('this.onIconChanged '+res);
          //  })
            this.setData(item);
            this.order = -1;

        }

        createCollection( values:any,data_type:string,type:string, $view:JQuery):void {
            $view.find('[' + data_type + ']').each(function (i, el:HTMLElement) {
                var ind:string = String(el.getAttribute(data_type));
                values[ind] =  new ItemValue(ind,el,type);
            })

        }


        insertAt($cont,i:number):void{
            var lastIndex = $cont.children().size();
            if(i < lastIndex)this.setOrder($cont,i);
             else  $cont.append(this.$view);
            this.$view.fadeIn();
        }

        setOrder($cont,i:number):void{
            this.order = i;
            $cont.children().eq(i).before(this.$view);
        }



        setData(item:VOItem):void {
            this.stamp = item.stamp;
            for(var str in item){
                if(this.values[str] && item[str] != this.item[str]){
                   if(this.values[str]) this.values[str].setValue(item[str]);
                   // if(this.$els[str])  this.$els[str] = this.setNewValue(this.$els[str],item[str]);
                   // else console.log(' no display '+str);
                }

            }
            this.item = item;
         //   this.rc.setData(item);
            this.show();
        }

        lastTime:number;
        remove():void {
            this.$view.fadeOut(()=> {
                this.order = -1;
                this.$view.remove()
            })
        }

        hide():void{
            this.$view.fadeOut();
        }
        show():void{
            this.$view.fadeIn();
        }


    }


    class List3 extends List2 {
        constructor(listId:string, options) {
            super(listId, options);
        }
    }
}