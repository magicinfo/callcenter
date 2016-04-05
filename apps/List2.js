/**
 * Created by VladHome on 3/19/2016.
 */
///<reference path="base.ts"/>
///<reference path="ListItem2.ts"/>
///<reference path="../typings/greensock.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var uplight;
(function (uplight) {
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
        List2.prototype.scrollUp = function () {
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
        List2.prototype.setDataDone = function () {
            // this.removeItems();
        };
        List2.prototype.setData = function (data) {
            this.data = data;
            this.current = Date.now();
            this.rows = [];
            this.current = -1;
            this.renderData();
        };
        List2.prototype.renderData = function () {
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
            else
                coll[item.key] = new ListRow(item, this.template);
            this.rows.push(coll[item.key]);
            setTimeout(function () { _this.renderData(); }, 20);
            coll[item.key].insertAt(this.$tbody, this.current);
            // }
        };
        List2.prototype.removeItemsDone = function () {
            this.current = -1;
            this.sortOrder();
        };
        List2.prototype.sortOrderDone = function () {
        };
        List2.prototype.sortOrder = function () {
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
        List2.prototype.removeItems = function () {
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
        return List2;
    })();
    uplight.List2 = List2;
    var ItemValue = (function () {
        function ItemValue(index, el) {
            var _this = this;
            this.index = index;
            this.el = el;
            ItemValue.disp.on(index, function (evt, val) {
                if (val == -1)
                    val += _this.oldValue;
                _this.setValue(val);
            });
            this.$view = $(el);
        }
        ItemValue.prototype.setValue = function (val) {
            this.$view = ItemValue.format[this.index](this.$view, val);
            this.oldValue = val;
        };
        ItemValue.prototype.destroy = function () {
            ItemValue.disp.off(this.index);
        };
        ItemValue.disp = $({});
        ItemValue.format = {};
        return ItemValue;
    })();
    var ListRow = (function () {
        function ListRow(item, template) {
            this.current = '';
            this.timer = 0;
            this.stamp = item.stamp;
            this.id = item.id;
            var $view = $(template);
            var $els = {};
            var values = {};
            $view.find('[data-id]').each(function (i, el) {
                _.map(el.getAttribute('data-id').split(','), function (ind) { values[ind] = new ItemValue(ind, el); });
            });
            //  this.createValues(values,'data-text','text', $view);
            //  this.createValues(values,'data-vis','vis', $view);
            // this.createValues(values,'data-img','img', $view);
            // this.createValues(values,'data-chk','chk', $view);
            // this.createValues(values,'data-class','class',$view);
            $view.hide();
            this.$view = $view;
            this.values = values;
            this.item = { key: 0, id: 0, stamp: 0, t: 0, icon: '', sort: 0, msg: '' };
            this.setData(item);
            this.order = -1;
        }
        /*  createValues(values:any,data_type:string,type:string, $view:JQuery):void {
              $view.find('[' + data_type + ']').each(function (i, el:HTMLElement) {
                  var ind:string = String(el.getAttribute(data_type));
                  values[ind] =  new ItemValue(ind,el,type);
              })
  
          }
  */
        ListRow.prototype.insertAt = function ($cont, i) {
            var lastIndex = $cont.children().size();
            if (i < lastIndex)
                this.setOrder($cont, i);
            else
                $cont.append(this.$view);
            this.$view.fadeIn();
        };
        ListRow.prototype.setOrder = function ($cont, i) {
            this.order = i;
            $cont.children().eq(i).before(this.$view);
        };
        ListRow.prototype.setData = function (item) {
            this.stamp = item.stamp;
            for (var str in item) {
                if (this.values[str] && item[str] != this.item[str])
                    this.values[str].setValue(item[str]);
            }
            this.item = item;
            //   this.rc.setData(item);
            this.show();
        };
        ListRow.prototype.remove = function () {
            var _this = this;
            for (var str in this.values)
                this.values[str].destroy();
            this.$view.fadeOut(function () {
                _this.order = -1;
                _this.$view.remove();
            });
        };
        ListRow.prototype.hide = function () {
            this.$view.fadeOut();
        };
        ListRow.prototype.show = function () {
            this.$view.fadeIn();
        };
        ListRow.disp = $({});
        return ListRow;
    })();
    /////////////////////////////////////////////////////////////////////////////////////////////
    setInterval(function () { ItemValue.disp.triggerHandler('time', -1); }, 1000);
    var formatTime = function (num) {
        if (isNaN(num))
            return '';
        var h = Math.floor(num / 60 / 60);
        var min = Math.floor(num / 60);
        var sec = num - (min * 60);
        return h + ':' + (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);
    };
    ItemValue.format['time'] = function ($view, val) {
        return $view.text(formatTime(val));
    };
    ItemValue.format['name'] = function ($view, val) {
        return $view.text(val);
    };
    ItemValue.format['aux'] = function ($view, val) {
        var $old = $view;
        var $el = $old.clone();
        setTimeout(function () {
            $old.hide('slow', function () {
                $old.remove();
            });
        }, 500);
        $el.appendTo($old.parent());
        $el.text(val);
        return $el;
    };
    ItemValue.format['icon'] = function ($view, val) {
        var $old = $view;
        var $el = $old.clone();
        setTimeout(function () {
            $old.hide('slow', function () {
                $old.remove();
            });
        }, 500);
        $el.appendTo($old.parent());
        $el.attr('class', val);
        return $el;
    };
    ItemValue.format['time_color'] = function ($view, val) {
        return $view.attr('class', val);
    };
    ItemValue.format['aux_color'] = function ($view, val) {
        return $view.attr('class', val);
    };
    var List3 = (function (_super) {
        __extends(List3, _super);
        function List3(listId, options) {
            _super.call(this, listId, options);
        }
        return List3;
    })(List2);
})(uplight || (uplight = {}));
//# sourceMappingURL=List2.js.map