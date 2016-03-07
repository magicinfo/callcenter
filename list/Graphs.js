/**
 * Created by VladHome on 3/7/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
///<reference path="Service.ts"/>
///<reference path="BasicList.ts"/>
var callcenter;
(function (callcenter) {
    var Graphs = (function () {
        function Graphs() {
            var _this = this;
            service.Service.service.dispatcher.on(service.Service.service.ON_HELP_DESK, function (evt, data) {
                _this.setData(data);
            });
        }
        Graphs.prototype.setData = function (data) {
        };
        return Graphs;
    })();
    callcenter.Graphs = Graphs;
})(callcenter || (callcenter = {}));
//# sourceMappingURL=Graphs.js.map