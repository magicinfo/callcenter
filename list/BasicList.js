/**
 * Created by VladHome on 3/5/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
///<reference path="../typings/underscore.d.ts"/>
///<reference path="Service.ts"/>
var desh;
(function (desh) {
    var ListItem = (function () {
        function ListItem(item) {
            this.id = item.id;
            this.$view = $('<tr>');
            this.$icon = $('<td>').appendTo(this.$view);
            this.$id = $('<td>').appendTo(this.$view);
            this.$timeout = $('<td>').appendTo(this.$view);
            this.setData(item);
        }
        ListItem.prototype.setData = function (item) {
            this.stamp = item.stamp;
            this.$id.text(item.id);
            this.$icon.text(item.code.icon);
            this.$timeout.text(item.timeout);
        };
        ListItem.prototype.remove = function () {
            var _this = this;
            this.$view.fadeOut(function () { _this.$view.remove(); });
        };
        return ListItem;
    })();
    desh.ListItem = ListItem;
    var BasicList = (function () {
        function BasicList($view) {
            var _this = this;
            this.$view = $view;
            this.collection = {};
            this.$table = $('<table>').addClass('table').appendTo($view);
            this.$tbody = $('<tbody>').appendTo(this.$table);
            service.Service.service.dispatcher.on(service.Service.service.ON_DATA, function (evt, data) {
                var agenss = data.agents;
                _this.setData(agenss);
            });
        }
        BasicList.prototype.setData = function (data) {
            console.log(data);
            var ar = data;
            var stamp = new Date().getSeconds();
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i];
                item.stamp = stamp;
                if (this.collection[item.id])
                    this.collection[item.id].setData(item);
                else
                    this.collection[item.id] = new ListItem(item);
                this.collection[item.id].$view.appendTo(this.$tbody);
            }
            for (var i = 0, n = ar.length; i < n; i++) {
                if (item.stamp !== stamp) {
                    this.collection[item.id].remove();
                    this.collection[item.id] = null;
                }
            }
        };
        return BasicList;
    })();
    desh.BasicList = BasicList;
})(desh || (desh = {}));
//# sourceMappingURL=BasicList.js.map