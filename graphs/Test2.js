/**
 * Created by VladHome on 3/9/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
///<reference path="../typings/chartist.d.ts"/>
///<reference path="../typings/moment.d.ts"/>
///<reference path="../typings/underscore.d.ts"/>
///<reference path="../typings/bootstrap.v3.datetimepicker.d.ts"/>
///<reference path="../com/Registry.ts"/>
var graphs;
(function (graphs) {
    // import interpolateNumber = d3.interpolateNumber;
    // import stream = d3.geo.stream;
    // import text = d3.text;
    var emmiter = $({});
    var ON_DATE_CAHGED = 'ON_DATA_CAHGED';
    var DatesPicker2 = (function () {
        function DatesPicker2(options) {
            var _this = this;
            this.$From = $('#datetimepicker6').datetimepicker();
            this.FromDP = this.$From.data('DateTimePicker');
            this.$To = $("#datetimepicker7").datetimepicker({
                useCurrent: false //Important! See issue #1075
            });
            if (!options.datePicker) {
                this.$From.hide();
                this.$To.hide();
                return;
            }
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
        return DatesPicker2;
    })();
    graphs.DatesPicker2 = DatesPicker2;
    var LineChart = (function () {
        function LineChart(selector, options) {
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
            this.url = 'http://front-desk.ca/mi/callcenter/rem/getstatusgraph?from=<%=from%>&to=<%=to%>';
            Registry.event.on(Registry.LOAD_DATA, function (evt, date) {
                date = date.replace(' ', 'T');
                var ar = date.split('T');
                ar[1] = Registry.data[Registry.WORK_START_TIME];
                var start = ar.join('T');
                _this.loadData(start, date);
            });
            var p = new graphs.DatesPicker(options || {});
            emmiter.on(ON_DATE_CAHGED, function (evt, val1, val2) {
                console.log(val1, val2);
                //  this.loadData(val1,val2);
            });
            //  this.loadData(0,Number(moment().format('X')));
        }
        LineChart.prototype.addVerticalLines = function () {
            this.options.plugins = [
                Chartist.plugins.verticalLine({
                    position: 'v'
                })
            ];
        };
        LineChart.prototype.loadData = function (from, to) {
            var _this = this;
            var loading = moment(from).calendar() + ' to: ' + moment(to).calendar();
            var url = _.template(this.url)({ from: from, to: to });
            // console.log(url);
            $('#DateRange').text(loading);
            $.get(url).done(function (res) {
                // console.log(res);
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
                    htime.push(v.AHT / 3);
                    inqueue.push(v.queue * 35);
                });
                var data = {
                    labels: labels,
                    series: [htime, service, inqueue]
                };
                _this.drawChart(data);
                $('#RangeTotal').text(count);
            });
        };
        LineChart.prototype.drawChart = function (data) {
            this.chart = new Chartist.Line(this.selector, data, this.options);
        };
        return LineChart;
    })();
    graphs.LineChart = LineChart;
})(graphs || (graphs = {}));
//# sourceMappingURL=Test2.js.map