/**
 * Created by VladHome on 3/19/2016.
 */
///<reference path="base.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var table4;
(function (table4) {
    // import CellValue = tableInfin.CellValue;
    var TableRow = table2.ListRow;
    var Table = (function () {
        function Table(listid, options) {
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
            this.getparams = '2016-03-15T7:58:34';
            this.collection = {};
            this.geturl = 'http://front-desk.ca/mi/callcenter/rem/getagents?date=';
            for (var str in options)
                this[str] = options[str];
            setInterval(function () { _this.scrollOneUp(); }, 1000);
            this.$disp.on(this.ON_SCROLL_FULL, function (evt) {
                _this.scrollFullUp();
            });
            this.$disp.on(this.ON_SCROLL_0, function (evt) {
                _this.toprow = 0;
                _this.currentScroll = 0;
            });
        }
        Table.prototype.scrollOneUp = function () {
            if (!this.$nanoContent)
                this.$nanoContent = this.$nano.find('.nano-content');
            if (this.$nanoContent.length === 0) {
                console.log('error no nanocontent ');
                return;
            }
            var len = this.$tbody.children().length;
            var h = this.$tbody.children(this.toprow++).height();
            this.currentScroll += h;
            var max = this.$nanoContent[0].scrollHeight - this.$nanoContent.height();
            console.log('this.currentScroll   ' + this.currentScroll + ' max  ' + max);
            if (this.currentScroll > max)
                this.$disp.triggerHandler(this.ON_SCROLL_FULL);
            else
                this.$nanoContent.animate({ 'scrollTop': this.currentScroll }, 500);
            //  console.log(this.$nanoContent[0].scrollHeight-this.$nanoContent.height());
        };
        Table.prototype.scrollFullUp = function () {
            var _this = this;
            //jQuery.fx.interval = 50;
            if (!this.$nanoContent)
                this.$nanoContent = this.$nano.find('.nano-content');
            this.$nanoContent.animate({ 'scrollTop': 0 }, 1000, null, function () {
                _this.$disp.triggerHandler(_this.ON_SCROLL_0);
            });
        };
        Table.prototype.init = function () {
            this.$view = $(this.listid);
            this.$tbody = this.$view.find('[data-id=list]:first');
            this.$nano = this.$view.find('.nano:first');
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
                coll[item.key] = new TableRow(item);
                coll[item.key].template = this.template;
                coll[item.key].appendTo(this.$tbody);
            }
            this.rows.push(coll[item.key]);
            setTimeout(function () { _this.renderData(); }, 20);
            //coll[item.key].insertAt(this.$tbody, this.current) ;
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
    table4.Table = Table;
    ////////////////////////////////////////////////////////////////////////
    var CellValue = (function (_super) {
        __extends(CellValue, _super);
        function CellValue() {
            _super.apply(this, arguments);
        }
        CellValue.prototype.setValue = function (val) {
            if (val == this.value)
                return false;
            this.$view = Formatter[this.index](this.$view, val);
            this.value = val;
            return true;
        };
        return CellValue;
    })(table.ItemValue);
    table4.CellValue = CellValue;
    /////////////////////////////////////////////////////////////////////////////////////////////
    setInterval(function () { CellValue.disp.triggerHandler('time', -1); }, 1000);
})(table4 || (table4 = {}));
//# sourceMappingURL=TableStatic.js.map