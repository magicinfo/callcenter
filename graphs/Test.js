/**
 * Created by VladHome on 3/9/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
///<reference path="../typings/d3.d.ts"/>
var graphs;
(function (graphs) {
    var Test = (function () {
        function Test() {
            var _this = this;
            var margin = { top: 30, right: 30, bottom: 40, left: 50 };
            this.width = 960 - margin.left - margin.right;
            this.height = 500 - margin.top - margin.bottom;
            this.setRanges();
            this.svg = d3.select("body").append("svg")
                .attr("width", this.width + margin.left + margin.right)
                .attr("height", this.height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            this.gX = this.svg.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + this.height + ")");
            this.gY = this.svg.append("g")
                .attr("class", "axis axis--y");
            this.gY.append("text")
                .attr("class", "axis-title")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .text("Change in Price");
            d3.tsv("data/data.tsv", function (error, data) {
                if (error)
                    throw error;
                _this.onData(data);
            });
        }
        Test.prototype.draw = function (data) {
            var defs = this.svg.append("defs");
            defs.append("clipPath")
                .attr("id", "clip-above")
                .append("rect")
                .attr("width", this.width)
                .attr("height", this.yRange(1));
            defs.append("clipPath")
                .attr("id", "clip-below")
                .append("rect")
                .attr("y", this.yRange(1))
                .attr("width", this.width)
                .attr("height", this.height - this.yRange(1));
            this.svg.append("path")
                .datum(data)
                .attr("clip-path", "url(#clip-above)")
                .attr("class", "area area--above")
                .attr("d", this.area);
            this.svg.append("path")
                .datum(data)
                .attr("clip-path", "url(#clip-below)")
                .attr("class", "area area--below")
                .attr("d", this.area);
            this.svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", this.line);
        };
        Test.prototype.createAxis = function () {
        };
        Test.prototype.setRanges = function () {
            var xRange = d3.time.scale()
                .range([0, this.width]);
            var yRange = d3.scale.log()
                .range([this.height, 0]);
            this.line = d3.svg.line()
                .x(function (d) { return xRange(d.date); })
                .y(function (d) { return yRange(d.ratio); });
            this.area = d3.svg.area()
                .x(function (d) { return xRange(d.date); })
                .y(function (d) { return yRange(d.ratio); });
            this.xRange = xRange;
            this.yRange = yRange;
        };
        Test.prototype.setAxisX = function (data) {
            this.xRange.domain(d3.extent(data, function (d) { return d.date; }));
            this.xAxis = d3.svg.axis()
                .scale(this.xRange)
                .orient("bottom");
            var gX = this.svg.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + this.height + ")");
            gX.call(this.xAxis);
        };
        Test.prototype.mapValues = function () {
            var data = this.data;
            var baseValue = +data[0].close;
            var parseDate = d3.time.format("%d-%b-%y").parse;
            data.forEach(function (d) {
                d.date = parseDate(d.date);
                d.ratio = d.close / baseValue;
            });
            this.yRange.domain(d3.extent(data, function (d) { return d.ratio; }));
        };
        Test.prototype.setArea = function () {
            this.area.y0(this.yRange(1));
        };
        Test.prototype.setAxisY = function (data) {
            this.setArea();
            // Use a second linear scale for ticks.
            var formatPercent = d3.format("+.0%");
            var formatChange = function (x) { return formatPercent(x - 1); };
            this.yAxis = d3.svg.axis()
                .scale(this.yRange)
                .orient("left")
                .tickSize(-this.width, 0)
                .tickFormat(formatChange);
            this.yAxis.tickValues(d3.scale.linear()
                .domain(this.yRange.domain())
                .ticks(20));
            this.gY.call(this.yAxis)
                .selectAll(".tick")
                .classed("tick--one", function (d) { return Math.abs(d - 1) < 1e-6; });
        };
        Test.prototype.onData = function (data) {
            this.data = data;
            this.mapValues();
            this.setAxisX(data);
            this.setAxisY(data);
            this.draw(data);
        };
        return Test;
    })();
    graphs.Test = Test;
})(graphs || (graphs = {}));
$(document).ready(function () {
    var test = new graphs.Test();
});
//# sourceMappingURL=Test.js.map