/**
 * Created by VladHome on 3/6/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
///<reference path="Service.ts"/>
///<reference path="BasicList.ts"/>
var callcenter;
(function (callcenter) {
    var FieldsUpdate = (function () {
        function FieldsUpdate() {
            var _this = this;
            this.$avTimeMin = $('#avTimeMin');
            this.$avTimeSec = $('#avTimeSec');
            this.$avTimeMinW = $('#avTimeMinW');
            this.$avTimeSecW = $('#avTimeSecW');
            this.$inqueue = $('#inqueue');
            this.$agendsTotal = $('#agendsTotal');
            this.$calsHandled = $('#calsHandled');
            this.$ServiceLevel = $('#ServiceLevel');
            this.$TicketsCreated = $('#TicketsCreated');
            this.$TicketsClosed = $('#TicketsClosed');
            this.$Acd = $('#Acd');
            this.$OffLine = $('#Offline');
            this.$Busy = $('#Busy');
            this.$Idele = $('#Idle');
            service.Service.service.dispatcher.on(service.Service.service.ON_DATA, function (evt, data) {
                _this.setData(data);
            });
        }
        FieldsUpdate.prototype.setData = function (data) {
            var q = data.queue[0];
            // console.log(q);
            this.$ServiceLevel.text(q.level);
            this.$calsHandled.text(q.answered);
            this.$agendsTotal.text(data.agents.length);
            this.$inqueue.text(q.inqueue);
            this.setHtime(q.handlingtime);
            // console.log(data);
        };
        FieldsUpdate.prototype.setHtime = function (data) {
            var ht = data.split(':');
            var s = Number(ht[2]);
            var m = Number(ht[1]);
            if (m == 0) {
                this.$avTimeMinW.hide();
                this.$avTimeMin.hide();
            }
            else {
                this.$avTimeMinW.show();
                this.$avTimeMin.show();
                this.$avTimeMin.text(m);
            }
            if (s == 0) {
                this.$avTimeSecW.hide();
            }
            else
                this.$avTimeSecW.show();
            this.$avTimeSec.text(s);
        };
        return FieldsUpdate;
    })();
    callcenter.FieldsUpdate = FieldsUpdate;
})(callcenter || (callcenter = {}));
//# sourceMappingURL=FieldsUpdate.js.map