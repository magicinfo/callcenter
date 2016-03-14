/**
 * Created by VladHome on 3/6/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
///<reference path="Service.ts"/>
///<reference path="BasicList.ts"/>
///<reference path="../typings/moment.d.ts"/>
var callcente2;
(function (callcente2) {
    var TemplateCopm = (function () {
        function TemplateCopm(view, template) {
            this.template = _.template($(template).html());
            this.$view = $(view);
        }
        TemplateCopm.prototype.setData = function (data) {
            this.$view.html(this.template(data));
        };
        return TemplateCopm;
    })();
    callcente2.TemplateCopm = TemplateCopm;
    var FieldComp = (function () {
        function FieldComp(strId) {
            this.strId = strId;
            this.$view = $(strId);
        }
        FieldComp.prototype.setData = function (str) {
            this.$view.text(str);
        };
        return FieldComp;
    })();
    callcente2.FieldComp = FieldComp;
    var FieldsUpdate = (function () {
        function FieldsUpdate($view) {
            var _this = this;
            this.$view = $view;
            this.collection = {};
            this.current = 1457586000 + (60 * 60 * 7);
            var opts = {
                avTime: 'avTime',
                agendsTotal: 'agendsTotal'
            };
            this.collection['avTime'] = new TemplateCopm('#avTimeView', '#AvTimeTempalte');
            //  this.collection['agendsTotal'] = new FieldComp('#agendsTotal');
            this.collection['inqueue'] = new FieldComp('#inqueue');
            this.collection['current'] = new FieldComp('#CurrntTime');
            this.collection['date'] = new FieldComp('#CurrntDate');
            this.collection['level'] = new FieldComp('#ServiceLevel');
            //  this.collection['TicketsCreated'] = new FieldComp('#TicketsCreated');
            // this.collection['TicketsClosedSameDay'] = new FieldComp('#TicketsClosed');
            // this.$TicketsCreated = $('#TicketsCreated');
            //  this.$TicketsClosed = $('#TicketsClosed');
            // service.Service.service.dispatcher.on( service.Service.service.ON_DATA,(evt,data)=>this.setData(data))
            //service.Service.service.dispatcher.on( service.Service.service.ON_HELP_DESK,(evt,data)=>this.onHelpDeskData(data));
            this.loadData();
            this.timer = setInterval(function () { _this.loadData(); }, 2000);
        }
        FieldsUpdate.prototype.loadData = function () {
            var _this = this;
            this.current += (60 * 5);
            $.get('rem/getCurrent?stamp=' + this.current).done(function (res) {
                console.log(res);
                var obj = res.result[0];
                _this.collection['level'].setData(obj.level);
                _this.collection['inqueue'].setData(obj.inqueue);
                var t = _this.formattime(obj.htime);
                _this.collection['avTime'].setData(t);
                _this.collection['current'].setData(moment.unix(_this.current).format('LT'));
                _this.collection['date'].setData(moment.unix(obj.stamp).format('LL'));
            });
        };
        FieldsUpdate.prototype.onHelpDeskData = function (data) {
            console.log(data);
            this._setData(data);
        };
        FieldsUpdate.prototype._setData = function (data) {
            for (var str in data)
                if (this.collection[str])
                    this.collection[str].setData(data[str]);
        };
        FieldsUpdate.prototype.setData = function (data) {
            var q = this.formatData(data);
            // console.log(q);
            this._setData(q);
        };
        FieldsUpdate.prototype.formatData = function (data) {
            var q = data.queue[0];
            q.agendsTotal = data.agents.length;
            q.avTime = this.formattime(q.handlingtime);
            return q;
        };
        FieldsUpdate.prototype.formattime = function (data) {
            var out = {};
            var m;
            var s;
            var num = Number(data);
            if (!isNaN(num)) {
                m = Math.floor(num / 60);
                s = num % 60;
                out.v1 = m ? m : '';
                out.v2 = m ? 'm' : '';
                out.v3 = s;
                out.v4 = 's';
                return out;
            }
            console.log(data);
            var out = {};
            var ht = data.split(':');
            s = Number(ht[2]);
            m = Number(ht[1]);
            if (m == 0) {
                out.v1 = '';
                out.v2 = '';
            }
            else {
                out.v1 = m;
                out.v2 = 'm';
            }
            if (s == 0) {
                out.v3 = '';
                out.v4 = '';
            }
            else {
                out.v3 = s;
                out.v4 = 's';
            }
            console.log(out);
            return out;
        };
        return FieldsUpdate;
    })();
    callcente2.FieldsUpdate = FieldsUpdate;
})(callcente2 || (callcente2 = {}));
//# sourceMappingURL=FieldsUpdate2.js.map