/**
 * Created by VladHome on 3/9/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
///<reference path="../typings/chartist.d.ts"/>
///<reference path="../typings/moment.d.ts"/>
///<reference path="../typings/bootstrap.v3.datetimepicker.d.ts"/>
var graphs;
(function (graphs) {
    // import text = d3.text;
    var emmiter = $({});
    var ON_DATE_CAHGED = 'ON_DATA_CAHGED';
    var DatesPicker = (function () {
        function DatesPicker() {
            var _this = this;
            this.$From = $('#datetimepicker6').datetimepicker();
            this.FromDP = this.$From.data('DateTimePicker');
            this.$To = $("#datetimepicker7").datetimepicker({
                useCurrent: false //Important! See issue #1075
            });
            this.ToDP = this.$To.data('DateTimePicker');
            this.$From.on("dp.change", function (e) {
                // this.from = e.date.format('X');
                $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
                // console.log(this.from);
                //emmiter.triggerHandler()
            });
            this.$To.on("dp.change", function (e) {
                $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
            });
            this.$From.on("dp.hide", function (evt) {
                var val = Number(_this.FromDP.date().format('X'));
                if (_this.from !== val && _this.to) {
                    _this.from = val;
                    emmiter.trigger(ON_DATE_CAHGED, [_this.from, _this.to]);
                }
                _this.from = val;
            });
            this.$To.on("dp.hide", function () {
                var val = Number(_this.ToDP.date().format('X'));
                console.log(val);
                if (_this.to !== val && _this.from) {
                    _this.to = val;
                    emmiter.triggerHandler(ON_DATE_CAHGED, [_this.from, _this.to]);
                }
                _this.to = val;
            });
        }
        return DatesPicker;
    })();
    graphs.DatesPicker = DatesPicker;
    var Test2 = (function () {
        function Test2(selector) {
            var _this = this;
            this.selector = selector;
            this.options = {
                showArea: true,
                showLine: true,
                showPoint: false,
                ticks: ['One', 'Two', 'Three'],
                stretch: true,
                // fullWidth: true,
                axisX: {
                    showLabel: true,
                    showGrid: false
                },
                axisY: {
                    showLabel: true
                }
            };
            var p = new DatesPicker();
            emmiter.on(ON_DATE_CAHGED, function (evt, val1, val2) {
                console.log(val1, val2);
                _this.loadData(val1, val2);
            });
            this.loadData(0, Number(moment().format('X')));
        }
        Test2.prototype.addVerticalLines = function () {
            this.options.plugins = [
                Chartist.plugins.verticalLine({
                    position: 'v'
                })
            ];
        };
        Test2.prototype.loadData = function (from, to) {
            var _this = this;
            var loading = moment.unix(from).calendar() + ' to: ' + moment.unix(to).calendar();
            $('#DateRange').text(loading);
            $.get('rem/statistics?from=' + from + '&to=' + to).done(function (res) {
                console.log(res);
                _this.addVerticalLines();
                var labels = [];
                var series = [];
                var htime = [];
                var service = [];
                var inqueue = [];
                var ar = res.result;
                var count = 0;
                ar.map(function (v) {
                    count++;
                    if (count % 10) {
                        //  console.log(v.stamp);
                        // if(!(count%9)) labels.push('v');
                        /// else
                        labels.push('');
                    }
                    else {
                        var d = new Date(v.stamp * 1000);
                        //  var dd = d.toLocaleString();
                        // moment(d).format('LT');
                        labels.push(moment(d).format('DD') + ' ' + moment(d).format('LT'));
                    }
                    service.push(v.level);
                    htime.push(v.htime);
                    inqueue.push(v.inqueue * 35);
                });
                var data = {
                    labels: labels,
                    series: [htime, service, inqueue]
                };
                _this.drawChart(data);
                $('#RangeTotal').text(count);
            });
        };
        Test2.prototype.drawChart = function (data) {
            this.chart = new Chartist.Line(this.selector, data, this.options);
        };
        return Test2;
    })();
    graphs.Test2 = Test2;
})(graphs || (graphs = {}));
//# sourceMappingURL=Test2.js.map