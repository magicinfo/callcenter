/**
 * Created by VladHome on 3/19/2016.
 */
///<reference path="base.ts"/>
///<reference path="ListItem2.ts"/>
///<reference path="../typings/greensock.d.ts"/>
var table3;
(function (table3) {
    var ItemValue = table.ItemValue;
    var ListRow = table2.ListRow;
    var VOItem = (function () {
        function VOItem() {
        }
        return VOItem;
    })();
    var Table = (function () {
        function Table(listid, options) {
            this.listid = listid;
            this.options = options;
            this.onData = function (data) {
                console.log(data);
            };
            this.getparams = '2016-03-15T7:58:34';
            this.collection = {};
            this.geturl = 'http://front-desk.ca/mi/callcenter/rem/getagents?date=';
            for (var str in options)
                this[str] = options[str];
        }
        Table.prototype.scrollUp = function () {
            //jQuery.fx.interval = 50;
            if (!this.$nanoContent)
                this.$nanoContent = this.$nano.find('.nano-content');
            var h = this.$nanoContent[0].scrollHeight - this.$nanoContent.height();
            if (this.isUp) {
                // TweenMax.to(this.$nanoContent.children(0),3,{y:0});
                this.$nanoContent.animate({ 'scrollTop': 0 }, 2000);
                this.isUp = false;
            }
            else {
                // TweenMax.to(this.$nanoContent.children(0),3,{y:-h});
                // console.log(h);
                this.$nanoContent.animate({ 'scrollTop': h }, 2000);
                this.isUp = true;
            }
        };
        Table.prototype.init = function () {
            this.$view = $(this.listid);
            this.$tbody = this.$view.find('[data-id=list]:first');
            this.$nano = this.$view.find('.nano:first');
            //require(['nano'], ()=> {
            //  this.loadData(this.getparams);
            // })
            this.template = this.$view.find('[data-id=template]').html();
        };
        Table.prototype.loadData = function () {
            var _this = this;
            this.getparams;
            var url = this.geturl + this.getparams;
            $.get(url).done(function (data) {
                //   console.log(data);
                _this.onData(data);
                // this.setData(data);
            }).fail(function (reason) {
                console.log(reason);
            });
        };
        Table.prototype.setDataDone = function () {
            // this.removeItems();
        };
        Table.prototype.setData = function (data) {
            this.data = data;
            this.current = Date.now();
            this.rows = [];
            this.current = -1;
            this.renderData();
        };
        Table.prototype.renderData = function () {
            var _this = this;
            this.current++;
            if (this.current >= this.data.length) {
                this.setDataDone();
                return;
            }
            // console.log(this);
            var ar = this.data;
            var coll = this.collection;
            // for (var i = 0, n = ar.length; i < n; i++) {
            var item = ar[this.current];
            item.stamp = this.current;
            if (coll[item.key])
                coll[item.key].setData(item);
            else {
                coll[item.key] = new ListRow(item);
                coll[item.key].template = this.template;
            }
            this.rows.push(coll[item.key]);
            setTimeout(function () { _this.renderData(); }, 20);
            coll[item.key].insertAt(this.$tbody, this.current);
            // }
        };
        Table.prototype.removeItemsDone = function () {
            this.current = -1;
            this.sortOrder();
        };
        Table.prototype.sortOrderDone = function () {
        };
        Table.prototype.sortOrder = function () {
            var _this = this;
            this.current++;
            if (this.current >= this.rows.length) {
                this.sortOrderDone();
                return;
            }
            // this.views;
            var ar = this.rows;
            var item = ar[this.current];
            if (item.order != this.current) {
                item.insertAt(this.$tbody, this.current);
                setTimeout(function () { return _this.sortOrder(); }, 2);
            }
        };
        Table.prototype.removeItems = function () {
            var ar = this.data;
            var coll = this.collection;
            // console.log(coll);
            for (var str in coll) {
                if (coll[str] && coll[str].stamp !== this.stamp) {
                    coll[str].remove();
                }
            }
            this.removeItemsDone();
        };
        return Table;
    })();
    table3.Table = Table;
    /*  import ItemValue = table.ItemValue
   
       class ListRow {
           $view:JQuery;
           id:number;
           stamp:number;
           $timeout:JQuery;
           current:string = '';
           timer:number = 0;
           order:number;
          // data:VOItem;
   
   
           //$els:_.Dictionary<JQuery>;
   
           values:_.Dictionary<ItemValue>;
   
           static  disp:JQuery = $({})
   
           constructor(private item:any,private  template:string){
               this.stamp = item.stamp;
               this.id = item.id;
               this.order = -1;
   
           }
           initView(){
               var $view = $(this.template);
               var $els:any  = {};
               var values:any ={};
               $view.find('[data-id]').each(function (i, el:HTMLElement) {
                   _.map(el.getAttribute('data-id').split(','),function(ind){ values[ind] = new ItemValue(ind,el);});
   
               })
               this.values = values;
               $view.hide();
               this.$view = $view;
               var data =  this.item;
   
           }
           render(){
              var item = this.item;
               for(var str in item){
                   if(this.values[str]) var havechange =  this.values[str].setValue(item[str]);
               }
               this.show();
           }
   
           insertAt($cont,i:number):void{
               if(!this.$view)this.initView();
               var lastIndex = $cont.children().size();
               if(i < lastIndex)this.setOrder($cont,i);
                else  $cont.append(this.$view);
               this.render();
               this.$view.fadeIn();
   
           }
   
           setOrder($cont,i:number):void{
               this.order = i;
               $cont.children().eq(i).before(this.$view);
           }
   
           setData(item:VOItem):ListRow {
               this.stamp = item.stamp;
               this.item = item;
               return this;
           }
   
           lastTime:number;
           remove():void {
               for(var str in this.values)this.values[str].destroy();
   
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
   
   
       }*/
    /////////////////////////////////////////////////////////////////////////////////////////////
    setInterval(function () { ItemValue.disp.triggerHandler('time', -1); }, 1000);
})(table3 || (table3 = {}));
//# sourceMappingURL=List3.js.map