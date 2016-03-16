/**
 * Created by VladHome on 3/6/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
///<reference path="Service.ts"/>
///<reference path="BasicList.ts"/>
///<reference path="../typings/moment.d.ts"/>
///<reference path="../com/Registry.ts"/>
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
        function FieldsUpdate($view, opts) {
            var _this = this;
            this.$view = $view;
            this.collection = {};
            this.url = 'http://front-desk.ca/mi/callcenter/rem/getStatus?date=';
            this.current = 1457586000 + (60 * 60 * 7);
            Registry.event.on(Registry.LOAD_DATA, function (evt, date) {
                _this.loadData(date);
            });
            opts.avTime = 'avTime',
                opts.agendsTotal = 'agendsTotal';
            this.collection['avTime'] = new TemplateCopm('#avTimeView', '#AvTimeTempalte');
            this.collection['agendsTotal'] = new FieldComp('#AgendsTotal');
            this.collection['inqueue'] = new FieldComp('#inqueue');
            this.collection['current'] = new FieldComp('#CurrentTime');
            this.collection['date'] = new FieldComp('#CurrntDate');
            this.collection['level'] = new FieldComp('#ServiceLevel');
            this.collection['answd'] = new FieldComp('#Answered');
            Registry.event.on(Registry.LIST_NEW_DATA, function (evt, data) {
                _this.collection['agendsTotal'].setData(data.result.list.length);
            });
            this.collection['TicketsCreated'] = new FieldComp('#TicketsCreated');
            // this.collection['TicketsClosedSameDay'] = new FieldComp('#TicketsClosed');
            // this.$TicketsCreated = $('#TicketsCreated');
            //  this.$TicketsClosed = $('#TicketsClosed');
            // service.Service.service.dispatcher.on( service.Service.service.ON_DATA,(evt,data)=>this.setData(data))
            //service.Service.service.dispatcher.on( service.Service.service.ON_HELP_DESK,(evt,data)=>this.onHelpDeskData(data));
            if (opts.auto) {
            }
        }
        FieldsUpdate.prototype.loadData = function (date) {
            var _this = this;
            this.currentDate = date;
            // console.log('loadData '+date);
            // this.current+=(60*5);
            $.get(this.url + this.currentDate).done(function (res) {
                //  console.log(res);
                var obj = res.result.list[0];
                _this.collection['level'].setData(obj.level);
                _this.collection['inqueue'].setData(obj.queue);
                var t = _this.formattime(obj.AHT);
                _this.collection['avTime'].setData(t);
                _this.collection['answd'].setData(obj.answd);
                _this.collection['current'].setData(moment(obj.t).format('MMM DD  h:mm'));
                // this.collection['TicketsCreated']
                //  this.collection['date'].setData(moment.unix(obj.stamp).format('LL'));
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
            // console.log('formattime  '+data);
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
                out.v3 = '0';
                out.v4 = '';
            }
            else {
                out.v3 = s;
                out.v4 = 's';
            }
            return out;
        };
        return FieldsUpdate;
    })();
    callcente2.FieldsUpdate = FieldsUpdate;
})(callcente2 || (callcente2 = {}));
//# sourceMappingURL=FieldsUpdate2.js.map