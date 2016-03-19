/**
 * Created by VladHome on 3/19/2016.
 */
///<reference path="base.ts"/>
///<reference path="ListItem2.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var List2 = (function () {
    function List2(listid) {
        var _this = this;
        this.currentDate = '2016-03-15T7:58:34';
        this.collection = {};
        this.url = 'http://front-desk.ca/mi/callcenter/rem/getagents?date=';
        this.$view = $(listid);
        this.$tbody = this.$view.find('[data-id=list]:first');
        this.$nano = this.$view.find('.nano:first');
        require(['base', 'ListItem', 'nano'], function () {
            _this.loadData(_this.currentDate);
        });
        this.template = this.$view.find('[data-id=template]').html();
    }
    List2.prototype.loadData = function (date) {
        var _this = this;
        this.currentDate = date;
        // console.log(this.currentDate);
        $.get(this.url + date).done(function (data) {
            //   console.log(data);
            _this.currentDate = data.stamp;
            Registry.event.triggerHandler(Registry.LIST_NEW_DATE, data.stamp);
            Registry.event.triggerHandler(Registry.LIST_NEW_DATA, data);
            var agents = data.result.list;
            console.log(agents);
            _this.setData(_this.parseData(agents));
            if (_this.$nano.length)
                _this.$nano.nanoScroller();
            // $("#AgentsScroll").nanoScroller();
        }).fail(function (reason) {
            console.log(reason);
        });
    };
    List2.prototype.parseData = function (data) {
        var ar = data;
        var out = [];
        var stamp = Date.now();
        for (var i = 0, n = ar.length; i < n; i++)
            out.push(new VOAgent(ar[i], stamp));
        this.stamp = stamp;
        return out;
    };
    List2.prototype.setData = function (data) {
        var stamp = this.stamp;
        var ar = data;
        var coll = this.collection;
        for (var i = 0, n = ar.length; i < n; i++) {
            var item = ar[i];
            if (coll[item.id])
                coll[item.id].setData(item);
            else {
                coll[item.id] = new ListItem2(item, this.template);
                coll[item.id].$view.appendTo(this.$tbody);
            }
            // ;
            if (item.stamp !== stamp) {
                this.collection[item.id].remove();
                this.collection[item.id] = null;
            }
        }
        console.log(i);
    };
    return List2;
})();
var List3 = (function (_super) {
    __extends(List3, _super);
    function List3(listId) {
        _super.call(this, listId);
    }
    return List3;
})(List2);
//# sourceMappingURL=List2.js.map