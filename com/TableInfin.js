/**
 * Created by VladHome on 3/19/2016.
 */
///<reference path="base.ts"/>
///<reference path="Collection.ts"/>
var table;
(function (table) {
    var CellValue = table.ItemValue;
    /////////////////////////////////////////////////////////////////////////////////////////////
    setInterval(function () { CellValue.disp.triggerHandler('time', -1); }, 1000);
    var TableInfin = (function () {
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
        function TableInfin(listid, options) {
            var _this = this;
            this.listid = listid;
            this.options = options;
            this.ON_SCROLL_FULL = 'ON_SCROLL_FULL';
            this.ON_SCROLL_0 = 'ON_SCROLL_0';
            this.onData = function (data) {
                console.log(data);
            };
            this.$disp = $({});
            this.toprow = 0;
            this.currentScroll = 0;
            this.timer = 0;
            this.getparams = '2016-03-15T7:58:34';
            this.collection = {};
            this.geturl = 'http://front-desk.ca/mi/callcenter/rem/getagents?date=';
            for (var str in options)
                this[str] = options[str];
            this.data = new table.DataCollection();
            // setInterval(()=>{this.scrollOneUp()},1000);
            this.$disp.on(this.ON_SCROLL_FULL, function (evt) {
                // this.scrollFullUp();
            });
            this.$disp.on(this.ON_SCROLL_0, function (evt) {
                _this.toprow = 0;
                _this.currentScroll = 0;
            });
        }
        TableInfin.prototype.scrollStart = function () {
            var _this = this;
            if (this.timer !== 0)
                return;
            this.timer = setInterval(function () { return _this.scrollNext(); }, 2000);
        };
        TableInfin.prototype.scrollstop = function (reason) {
            console.log('stop scroll ' + reason);
            clearInterval(this.timer);
            this.timer = 0;
        };
        TableInfin.prototype.scrollNext = function () {
            if (this.rows.length >= this.data.length) {
                this.current = 0;
                this.scrollstop(' not enogh data');
                return;
            }
            this.current++;
            if (this.current >= this.data.length)
                this.current = 0;
            if (this.current >= this.rows.length) {
                this.rows.push();
            }
            this.rows[this.current];
            var item = this.data.data[this.current];
            console.log(item);
        };
        TableInfin.prototype.init = function () {
            this.$view = $(this.listid);
            this.$tbody = this.$view.find('[data-id=list]:first');
            this.$nano = this.$view.find('.nano:first');
            this.template = this.$view.find('[data-id=template]').html();
        };
        TableInfin.prototype.loadData = function () {
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
        TableInfin.prototype.setDataDone = function () {
            // this.removeItems();
            this.scrollStart();
            console.log('setdatadone');
        };
        TableInfin.prototype.setData = function (data) {
            this.data.setData(data);
            if (!this.$nanoContent) {
                this.rows = [];
                this.current = -1;
                this.renderData();
            }
        };
        TableInfin.prototype.setStamp = function (stamp) {
        };
        TableInfin.prototype.renderData = function () {
            var _this = this;
            this.$nanoContent = this.$nano.find('.nano-content');
            this.height = this.$nanoContent.height();
            console.log('this.height ' + this.height);
            this.current++;
            if (this.current >= this.data.length) {
                this.setDataDone();
                return;
            }
            var ar = this.data.data;
            var row = this.data.data[this.current];
            row.template = this.template;
            row.appendTo(this.$tbody);
            this.rows.push(row);
            if (this.$tbody.height() > this.height)
                this.setDataDone();
            else
                setTimeout(function () { _this.renderData(); }, 20);
        };
        return TableInfin;
    })();
    table.TableInfin = TableInfin;
})(table || (table = {}));
//# sourceMappingURL=TableInfin.js.map