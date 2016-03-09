/**
 * Created by VladHome on 3/5/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
///<reference path="../typings/papaparse.d.ts"/>
///<reference path="../typings/underscore.d.ts"/>
var service;
(function (service) {
    var Service = (function () {
        function Service() {
            this.ON_DATA = 'ON_DATA';
            this.ON_HELP_DESK = 'ON_HELP_DESK';
            this.dispatcher = $({});
        }
        Service.prototype.loadData = function () {
            var _this = this;
            $.get('rem/agents').done(function (data) {
                _this.dispatcher.triggerHandler(_this.ON_DATA, data);
            }).fail(function (reason) {
                console.log(reason);
            });
        };
        Service.prototype.start = function () {
            var _this = this;
            this.loadData();
            this.loadHelpDesk();
            this.interval = setInterval(function () { _this.loadData(); }, 60000);
        };
        Service.prototype.loadHelpDesk = function () {
            var _this = this;
            $.get('rem/getCsv').done(function (resp) {
                var res = Papa.parse(resp).data;
                var ar = _.zip(res[0], res[1]);
                // console.log(ar);
                var data = _this.formatData(ar);
                _this.dispatcher.triggerHandler(_this.ON_HELP_DESK, [data]);
            }).fail(function (reason) {
                console.log(reason);
            });
        };
        Service.prototype.formatData = function (ar) {
            var out = {};
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i];
                switch (item[0]) {
                    case '# of Tickets Created Today':
                        out.TicketsCreated = item[1];
                        break;
                    case 'Today\'s Same Day Closed':
                        out.TicketsClosedSameDay = item[1];
                        break;
                    case 'Tickets Created This Year':
                        out.TicketsCreatedYear = item[1];
                        break;
                    case 'Tickets Closed within 24 Hours This Year':
                        out.TicketsClosed24HYear = item[1];
                        break;
                    case '% of Calls Closed within 24 Hours This Year':
                        out.CallsClosed24HYear = item[1];
                        break;
                    case '# of Tickets Opened Last Year':
                        out.TicketsOpenedLastYear = item[1];
                        break;
                    case '# of Tickets Closed Same Day Last Year':
                        out.TicketsClosedLastYear = item[1];
                        break;
                }
            }
            return out;
        };
        Service.service = new Service();
        return Service;
    })();
    service.Service = Service;
})(service || (service = {}));
//# sourceMappingURL=Service.js.map