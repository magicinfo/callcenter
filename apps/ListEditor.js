/**
 * Created by VladHome on 3/19/2016.
 */
///<reference path="base.ts"/>
///<reference path="ListItem2.ts"/>
var R_C5 = (function () {
    function R_C5($view) {
        this.$texts = this.createCollection('data-text', $view);
        this.$visible = this.createCollection('data-vis', $view);
        this.$imgs = this.createCollection('data-img', $view);
        this.$chk = this.createCollection('data-chk', $view);
    }
    R_C5.prototype.createCollection = function (type, $view) {
        var obj = {};
        $view.find('[' + type + ']').each(function (i, el) {
            obj[String(el.getAttribute(type))] = $(el);
        });
        return obj;
    };
    R_C5.prototype.getObject = function (str) {
        return this.$texts[str] || this.$visible[str] || this.$imgs[str] || this.$chk[str];
    };
    R_C5.prototype.getData = function () {
        var item = {};
        for (var str in this.$texts)
            item[str] = this.$texts[str].text();
        //for (var str in this.$visible)item[str] = this.$visible[str].visible();
        // for (var str in this.$imgs)this.$imgs[str].css('background-image','url('+item[str]+')');
        for (var str in this.$chk)
            item[str] = this.$chk[str].prop('checked');
        return item;
    };
    R_C5.prototype.setData = function (item) {
        //  console.log(item);
        for (var str in this.$texts)
            this.$texts[str].text(item[str]);
        for (var str in this.$visible)
            item[str] ? this.$visible[str].show() : this.$visible[str].hide();
        for (var str in this.$imgs)
            this.$imgs[str].css('background-image', 'url(' + item[str] + ')');
        for (var str in this.$chk)
            this.$chk[str].prop('checked', item[str]);
    };
    return R_C5;
})();
var ListItem5 = (function () {
    function ListItem5(item, template, del) {
        var _this = this;
        this.current = '';
        this.timer = 0;
        this.id = item.id;
        this.$view = $(template);
        this.rc = new R_C5(this.$view);
        if (del)
            this.$view.find(del).click(function (evt) {
                ListItem5.onDelete(_this);
            });
        this.setData(item);
    }
    ListItem5.prototype.setData = function (item) {
        this.rc.setData(item);
    };
    ListItem5.prototype.getDaata = function () {
        return this.rc.getData();
    };
    ListItem5.prototype.appendTo = function ($cont) {
        $cont.append(this.$view);
    };
    ListItem5.prototype.remove = function () {
        var _this = this;
        this.$view.fadeOut(function () { _this.$view.remove(); });
    };
    ListItem5.onDelete = function (itrm) { };
    return ListItem5;
})();
var ListEditor = (function () {
    function ListEditor(listid, options) {
        this.listid = listid;
        this.options = options;
        this.getparams = '2016-03-15T7:58:34';
        this.postparams = '';
        this.geturl = '';
        this.saveurl = '';
        for (var str in options)
            this[str] = options[str];
    }
    ListEditor.prototype.init = function () {
        var _this = this;
        require(['base', 'ListItem', 'nano'], function () {
            _this.loadData(_this.getparams);
        });
        this.$view = $(this.listid);
        this.$tbody = this.$view.find('[data-id=list]:first');
        this.$nano = this.$view.find('.nano:first');
        this.template = this.$view.find('[data-id=template]').html();
        if (this.options.btnSave)
            $(this.options.btnSave).click(function () {
                // console.log(this.getData());
                var ar = _this.getData();
                _this.saveData(ar);
            });
        if (this.options.btnAdd) {
            this.$view.find(this.options.btnAdd).click(function () {
                console.log('adding');
                var item = new ListItem5({ msg: '', active: true }, _this.template, _this.options.btnDelete);
                _this.data.push(item);
                item.appendTo(_this.$tbody);
            });
        }
        ListItem5.onDelete = function (item) {
            var isdelete = confirm('You want to delete Item');
            if (isdelete) {
                console.log(item);
                _this.deleteItem(item);
            }
        };
    };
    ListEditor.prototype.deleteItem = function (li) {
        var ar = this.data;
        for (var i = 0, n = ar.length; i < n; i++) {
            var item = ar[i];
            if (item == li) {
                li.remove();
                var res = this.data.splice(i, 1);
                console.log('Deleted ', res);
                break;
            }
        }
    };
    ListEditor.prototype.loadData = function (date) {
        var _this = this;
        this.getparams = date;
        $.get(this.geturl + this.getparams).done(function (data) {
            console.log(data);
            _this.getparams = data.stamp;
            Registry.event.triggerHandler(Registry.LIST_NEW_DATE, data.stamp);
            Registry.event.triggerHandler(Registry.LIST_NEW_DATA, data);
            // if(data.result) data = data.result;
            var list = data.data;
            _this.setData(list);
            if (_this.$nano.length)
                _this.$nano.nanoScroller();
            // $("#AgentsScroll").nanoScroller();
        }).fail(function (reason) {
            console.log(reason);
        });
    };
    ListEditor.prototype.setData = function (data) {
        var out = [];
        var ar = data;
        this.$tbody.empty();
        for (var i = 0, n = ar.length; i < n; i++) {
            var item = new ListItem5(ar[i], this.template, this.options.btnDelete);
            item.appendTo(this.$tbody);
            out.push(item);
        }
        this.data = out;
        //console.log(i);
    };
    ListEditor.prototype.getData = function () {
        var out = [];
        var ar = this.data;
        for (var i = 0, n = ar.length; i < n; i++) {
            out.push(ar[i].getDaata());
        }
        return out;
    };
    ListEditor.prototype.saveData = function (data) {
        var out = {};
        out.data = data;
        console.log(data);
        var user = {};
        user.user = this.$view.find('[data-id=user]:first').val();
        user.pass = this.$view.find('[data-id=pass]:first').val();
        out.user = user;
        var url = this.saveurl + this.postparams;
        console.log(url);
        $.post(url, JSON.stringify(out)).done(function (res) {
            console.log(res);
            if (res.result == 'SAVED')
                alert('Data saved on server');
            else
                alert('Error ' + res.result);
        }).fail(function (fail) {
            console.log(fail);
            alert('Error ' + fail);
        });
    };
    return ListEditor;
})();
//# sourceMappingURL=ListEditor.js.map