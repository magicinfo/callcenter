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
var listU;
(function (listU) {
    // import ListItem = dash.ListItem;
    var VOItem = (function () {
        function VOItem(obj) {
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
    listU.List2 = List2;
    var ItemValue = (function () {
        function ItemValue(index, el, type) {
            var _this = this;
            this.index = index;
            this.el = el;
            this.type = type;
            if (index == 'fa') {
                this.setValue = function (val) {
                    var $old = _this.$view;
                    var $el = $old.clone();
                    setTimeout(function () {
                        $old.hide('slow', function () {
                            $old.remove();
                        });
                    }, 500);
                    $el.appendTo($old.parent());
                    $el.attr('class', val);
                    _this.$view = $el;
                };
            }
            if (index == 'aux') {
                this.setValue = function (val) {
                    var $old = _this.$view;
                    var $el = $old.clone();
                    setTimeout(function () {
                        $old.hide('slow', function () {
                            $old.remove();
                        });
                    }, 500);
                    $el.appendTo($old.parent());
                    $el.text(val);
                    _this.$view = $el;
                };
            }
            this.$view = $(el);
        }
        ItemValue.prototype.setValue = function (val) {
            switch (this.type) {
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
        };
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
            /*  this.$view.find('[data-id]').each(function (i, el:HTMLElement) {
                  var ind:string = String(el.getAttribute('data-id'));
                  var type:string = String(el.getAttribute('data-type'));
                  values[ind] = new ItemValue(ind,el,type);
              })
  */
            this.createCollection(values, 'data-text', 'text', $view);
            this.createCollection(values, 'data-vis', 'vis', $view);
            this.createCollection(values, 'data-img', 'img', $view);
            this.createCollection(values, 'data-chk', 'chk', $view);
            this.createCollection(values, 'data-class', 'class', $view);
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
        ListRow.prototype.createCollection = function (values, data_type, type, $view) {
            $view.find('[' + data_type + ']').each(function (i, el) {
                var ind = String(el.getAttribute(data_type));
                values[ind] = new ItemValue(ind, el, type);
            });
        };
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
                if (this.values[str] && item[str] != this.item[str]) {
                    if (this.values[str])
                        this.values[str].setValue(item[str]);
                }
            }
            this.item = item;
            //   this.rc.setData(item);
            this.show();
        };
        ListRow.prototype.remove = function () {
            var _this = this;
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
        return ListRow;
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