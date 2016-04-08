/**
 * Created by VladHome on 4/5/2016.
 */
var table;
(function (table) {
    var ItemValue = (function () {
        function ItemValue(index, el) {
            var _this = this;
            this.index = index;
            this.el = el;
            ItemValue.disp.on(index, function (evt, val) {
                if (val == -1)
                    val += _this.value;
                _this.setValue(val);
            });
            this.$view = $(el);
        }
        ItemValue.prototype.setValue = function (val) {
            if (this.value == val)
                return false;
            this.$view = ItemValue.format[this.index](this.$view, val);
            this.value = val;
            return true;
        };
        ItemValue.prototype.destroy = function () {
            ItemValue.disp.off(this.index);
        };
        ItemValue.disp = $({});
        ItemValue.format = {};
        return ItemValue;
    })();
    table.ItemValue = ItemValue;
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
})(table || (table = {}));
//# sourceMappingURL=ItemValue.js.map