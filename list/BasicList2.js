/**
 * Created by VladHome on 3/5/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
///<reference path="../typings/underscore.d.ts"/>
///<reference path="Service.ts"/>
///<reference path="../com/Registry.ts"/>
var dash;
(function (dash) {
    var ListItem = (function () {
        function ListItem(item) {
            this.current = '';
            this.timer = 0;
            this.id = item.id;
            this.$view = $('<tr>');
            this.$icon = $('<span>').addClass('fa').appendTo($('<td>').appendTo(this.$view));
            this.$id = $('<td>').appendTo(this.$view);
            this.$timeout = $('<td>').appendTo(this.$view);
            this.setData(item);
        }
        ListItem.prototype.setData = function (item) {
            this.stamp = item.stamp;
            this.$id.text(item.id);
            this.$icon.removeClass(this.current);
            this.current = this.getClass(item.icon);
            this.$icon.addClass(this.current);
            this.setTime(item.t);
        };
        ListItem.prototype.showTime = function () {
            var h;
            var m;
            var s;
            var t = this.currentTime;
            var d;
            //console.log('showtime  '+t);
            var out = '';
            if (t > 60 * 60) {
                //  console.log(t);
                if (t > 24 * 60 * 60) {
                    d = Math.floor(t / (24 * 60 * 60));
                    h = t - (d * 24 * 60 * 60);
                    h = Math.floor(h / (60 * 60));
                    if (d)
                        this.$timeout.text(d + 'day ' + h + 'hour');
                    else
                        this.$timeout.text(s + 'sec');
                }
                else {
                    h = Math.floor(t / (60 * 60));
                    m = t - (h * 60 * 60);
                    m = Math.floor(m / 60);
                    if (h)
                        this.$timeout.text(h + 'H ' + m + 'm');
                    else
                        this.$timeout.text(m + 'm');
                }
            }
            else {
                m = Math.floor(t / 60);
                s = t - (m * 60);
                if (m)
                    this.$timeout.text(m + 'min ' + s + 'sec');
                else
                    this.$timeout.text(s + 'sec');
            }
        };
        ListItem.prototype.setTime = function (timeout) {
            var _this = this;
            var time = Number(timeout);
            if (isNaN(time) || time < 0) {
                clearInterval(this.timer);
                this.timer = 0;
                this.$timeout.text('');
                return;
            }
            if (this.lastTime == time)
                return;
            this.lastTime = time;
            this.currentTime = time;
            this.showTime();
            if (this.timer == 0)
                this.timer = setInterval(function () {
                    _this.currentTime++;
                    _this.showTime();
                }, 1000);
        };
        ListItem.prototype.remove = function () {
            var _this = this;
            this.$view.fadeOut(function () { _this.$view.remove(); });
        };
        ListItem.prototype.getClass = function (stat) {
            switch (stat) {
                case 'busy': return 'fa-minus-circle';
                case 'offline': return 'fa-times-circle';
                case 'lunch': return 'fa-clock-o';
                case 'acd': return 'fa-phone-square';
                case 'nonACD': return 'fa-phone';
                case 'idle': return 'fa-hourglass-half';
                case 'outbound': return 'fa-hashtag';
                default:
                    console.log(' no icon for ' + stat);
                    return 'fa-question ';
            }
        };
        return ListItem;
    })();
    dash.ListItem = ListItem;
    var BasicList = (function () {
        function BasicList($view, opt) {
            var _this = this;
            this.$view = $view;
            this.collection = {};
            this.currentDate = '2016-03-15T7:58:34';
            this.url = 'http://front-desk.ca/mi/callcenter/rem/getagents?date=';
            this.$LounchCount = $('#LounchCount');
            this.$BusyCount = $('#BusyCount');
            this.$OfflineCount = $('#OfflineCount');
            this.$AcdCount = $('#AcdCount');
            this.$tbody = $('#AgentsList');
            if (Registry.data[Registry.CURRENT_DATE]) {
                this.currentDate = Registry.data[Registry.CURRENT_DATE];
                Registry.event.on(Registry.LOAD_DATA, function (evt, date) {
                    //  console.log(Registry.LOAD_DATA,date);
                    _this.loadData(date);
                });
            }
            else {
                setInterval(function () { _this.loadData(_this.currentDate); }, 5000);
            }
            this.loadData(this.currentDate);
        }
        BasicList.prototype.setStats = function () {
            this.$BusyCount.text(this.busyCount);
            this.$OfflineCount.text(this.offlineCount);
            this.$LounchCount.text(this.lunchCount);
            this.$AcdCount.text(this.acdCount);
        };
        BasicList.prototype.loadData = function (date) {
            var _this = this;
            this.currentDate = date;
            // console.log(this.currentDate);
            $.get(this.url + date).done(function (data) {
                //   console.log(data);
                _this.currentDate = data.stamp;
                Registry.event.triggerHandler(Registry.LIST_NEW_DATE, data.stamp);
                Registry.event.triggerHandler(Registry.LIST_NEW_DATA, data);
                var agents = data.result.list;
                _this.setData(agents);
                $("#AgentsScroll").nanoScroller();
            }).fail(function (reason) {
                console.log(reason);
            });
        };
        BasicList.prototype.setData = function (data) {
            this.busyCount = 0;
            this.offlineCount = 0;
            this.lunchCount = 0;
            this.acdCount = 0;
            //console.log(data);
            var ar = data;
            if (!data)
                return;
            var stamp = new Date().getSeconds();
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i];
                item.stamp = stamp;
            }
            var ar2 = _.sortBy(ar, 'sort');
            for (var i = 0, n = ar2.length; i < n; i++) {
                var item = ar2[i];
                if (this.collection[item.id])
                    this.collection[item.id].setData(item);
                else
                    this.collection[item.id] = new ListItem(item);
                this.collection[item.id].$view.appendTo(this.$tbody);
                if (item.stamp !== stamp) {
                    this.collection[item.id].remove();
                    this.collection[item.id] = null;
                }
            }
            this.setStats();
        };
        return BasicList;
    })();
    dash.BasicList = BasicList;
})(dash || (dash = {}));
//# sourceMappingURL=BasicList2.js.map