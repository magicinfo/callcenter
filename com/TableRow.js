/**
 * Created by VladHome on 4/5/2016.
 */
var table2;
(function (table2) {
    var ItemValue = table.ItemValue;
    var VOItem = (function () {
        function VOItem() {
        }
        return VOItem;
    })();
    var ListRow = (function () {
        function ListRow(item) {
            this.item = item;
            // $timeout:JQuery;
            this.current = '';
            this.timer = 0;
            this.stamp = item.stamp;
            this.id = item.id;
            this.key = item.key;
            this.order = -1;
        }
        ListRow.prototype.initView = function () {
            var $view = $(this.template);
            var $els = {};
            var values = {};
            $view.find('[data-id]').each(function (i, el) {
                _.map(el.getAttribute('data-id').split(','), function (ind) { values[ind] = new ItemValue(ind, el); });
            });
            this.values = values;
            $view.hide();
            this.$view = $view;
            var data = this.item;
        };
        ListRow.prototype.render = function () {
            var item = this.item;
            for (var str in item) {
                if (this.values[str])
                    var havechange = this.values[str].setValue(item[str]);
            }
            this.show();
        };
        ListRow.prototype.insertAt = function ($cont, i) {
            if (!this.$view)
                this.initView();
            var lastIndex = $cont.children().size();
            if (i < lastIndex)
                this.setOrder($cont, i);
            else
                $cont.append(this.$view);
            this.render();
            this.$view.fadeIn();
        };
        ListRow.prototype.appendTo = function ($cont) {
            if (!this.$view)
                this.initView();
            $cont.append(this.$view);
            this.render();
            this.$view.fadeIn();
        };
        ListRow.prototype.setOrder = function ($cont, i) {
            this.order = i;
            $cont.children().eq(i).before(this.$view);
        };
        ListRow.prototype.setData = function (item) {
            this.stamp = item.stamp;
            this.item = item;
            return this;
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
    table2.ListRow = ListRow;
})(table2 || (table2 = {}));
//# sourceMappingURL=TableRow.js.map