/**
 * Created by VladHome on 3/5/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
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
            this.interval = setInterval(function () { _this.loadData(); }, 2000);
        };
        Service.prototype.loadHelpDesk = function () {
            var _this = this;
            $.get('rem/getCsv').done(function (data) {
                console.log(data);
                _this.dispatcher.triggerHandler(_this.ON_HELP_DESK, data);
            }).fail(function (reason) {
                console.log(reason);
            });
        };
        Service.service = new Service();
        return Service;
    })();
    service.Service = Service;
})(service || (service = {}));
//# sourceMappingURL=Service.js.map