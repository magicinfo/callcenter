/**
 * Created by VladHome on 3/19/2016.
 */
///<reference path="base.ts"/>
var R_C = (function () {
    function R_C($view) {
        this.$texts = this.createCollection('data-text', $view);
        this.$visible = this.createCollection('data-vis', $view);
        this.$imgs = this.createCollection('data-img', $view);
        this.$chk = this.createCollection('data-chk', $view);
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
    };
    return R_C;
})();
var ListItem2 = (function () {
    function ListItem2(item, template) {
        this.current = '';
        this.timer = 0;
        this.id = item.id;
        this.$view = $(template);
        this.rc = new R_C(this.$view);
        this.setData(item);
    }
    ListItem2.prototype.setData = function (item) {
        this.rc.setData(item);
    };
    ListItem2.prototype.remove = function () {
        var _this = this;
        this.$view.fadeOut(function () { _this.$view.remove(); });
    };
    return ListItem2;
})();
//# sourceMappingURL=ListItem2.js.map