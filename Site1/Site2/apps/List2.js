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
var listU;
(function (listU) {
    var VOItem = (function () {
        function VOItem(obj, stamp) {
            this.stamp = stamp;
            for (var str in obj)
                this[str] = obj[str];
        }
        return VOItem;
    })();
    var List2 = (function () {
        function List2(listid, options) {
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
        List2.prototype.init = function () {
            this.$view = $(this.listid);
            this.$tbody = this.$view.find('[data-id=list]:first');
            this.$nano = this.$view.find('.nano:first');
            //require(['nano'], ()=> {
            //  this.loadData(this.getparams);
            // })
            this.template = this.$view.find('[data-id=template]').html();
        };
        List2.prototype.loadData = function () {
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
        /*parseData(data:any[]):VOAgent[] {
            var ar = data
            var out:VOAgent[] = [];
            var stamp = Date.now();
            for (var i = 0, n = ar.length; i < n; i++)out.push(new VOAgent(ar[i], stamp))
            this.stamp = stamp;
            return out;

        }*/
        List2.prototype.setData = function (data) {
            // console.log(this);
            var stamp = Date.now();
            var ar = data;
            var coll = this.collection;
            // console.log(coll);
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i];
                item.stamp = stamp;
                if (coll[item.key])
                    coll[item.key].setData(item);
                else {
                    coll[item.key] = new ListItem(item, this.template);
                    coll[item.key].$view.appendTo(this.$tbody);
                }
                // ;
                if (item.stamp !== stamp) {
                    this.collection[item.key].remove();
                    this.collection[item.key] = null;
                }
            }
            if (this.$nano.length)
                this.$nano.nanoScroller();
            //console.log(this.$nano.length);
        };
        return List2;
    })();
    listU.List2 = List2;
    var R_C = (function () {
        function R_C($view) {
            this.$texts = this.createCollection('data-text', $view);
            this.$visible = this.createCollection('data-vis', $view);
            this.$imgs = this.createCollection('data-img', $view);
            this.$chk = this.createCollection('data-chk', $view);
            this.$class = this.createCollection('data-class', $view);
        }
        R_C.prototype.createCollection = function (type, $view) {
            var obj = {};
            $view.find('[' + type + ']').each(function (i, el) {
                obj[String(el.getAttribute(type))] = $(el);
            });
            return obj;
        };
        R_C.prototype.getObject = function (str) {
            return this.$texts[str] || this.$visible[str] || this.$imgs[str] || this.$chk[str];
        };
        R_C.prototype.setData = function (item) {
            //  console.log(item);
            for (var str in this.$texts)
                this.$texts[str].text(item[str]);
            for (var str in this.$visible)
                item[str] ? this.$visible[str].show() : this.$visible[str].hide();
            for (var str in this.$imgs)
                this.$imgs[str].css('background-image', 'url(' + item[str] + ')');
            for (var str in this.$chk)
                this.$chk[str].prop('checked', item[str]);
            for (var str in this.$class)
                this.$class[str].attr('class', item[str]);
        };
        return R_C;
    })();
    var ListItem = (function () {
        function ListItem(item, template) {
            this.current = '';
            this.timer = 0;
            this.id = item.id;
            this.$view = $(template);
            this.rc = new R_C(this.$view);
            this.setData(item);
        }
        ListItem.prototype.setData = function (item) {
            this.stamp = item.stamp;
            this.rc.setData(item);
        };
        ListItem.prototype.remove = function () {
            var _this = this;
            this.$view.fadeOut(function () {
                _this.$view.remove();
            });
        };
        return ListItem;
    })();
    var List3 = (function (_super) {
        __extends(List3, _super);
        function List3(listId, options) {
            _super.call(this, listId, options);
        }
        return List3;
    })(List2);
})(listU || (listU = {}));
//# sourceMappingURL=List2.js.map