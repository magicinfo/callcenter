/**
 * Created by VladHome on 3/6/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
///<reference path="Service.ts"/>
///<reference path="BasicList.ts"/>
var callcenter;
(function (callcenter) {
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
    callcenter.TemplateCopm = TemplateCopm;
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
    callcenter.FieldComp = FieldComp;
    var FieldsUpdate = (function () {
        function FieldsUpdate() {
            var _this = this;
            this.collection = {};
            var opts = {
                avTime: 'avTime',
                agendsTotal: 'agendsTotal'
            };
            this.collection['avTime'] = new TemplateCopm('#avTimeView', '#AvTimeTempalte');
            this.collection['agendsTotal'] = new FieldComp('#agendsTotal');
            this.collection['inqueue'] = new FieldComp('#inqueue');
            this.collection['answered'] = new FieldComp('#calsHandled');
            this.collection['level'] = new FieldComp('#ServiceLevel');
            this.collection['TicketsCreated'] = new FieldComp('#TicketsCreated');
            this.collection['TicketsClosedSameDay'] = new FieldComp('#TicketsClosed');
            // this.$TicketsCreated = $('#TicketsCreated');
            this.$TicketsClosed = $('#TicketsClosed');
            service.Service.service.dispatcher.on(service.Service.service.ON_DATA, function (evt, data) { return _this.setData(data); });
            service.Service.service.dispatcher.on(service.Service.service.ON_HELP_DESK, function (evt, data) { return _this.onHelpDeskData(data); });
        }
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
            console.log(data);
            var out = {};
            var ht = data.split(':');
            var s = Number(ht[2]);
            var m = Number(ht[1]);
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
    callcenter.FieldsUpdate = FieldsUpdate;
})(callcenter || (callcenter = {}));
//# sourceMappingURL=FieldsUpdate.js.map