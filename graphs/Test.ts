/**
 * Created by VladHome on 3/9/2016.
 */
    ///<reference path="../typings/jquery.d.ts"/>
    ///<reference path="../typings/d3.d.ts"/>

module graphs{
    import Scale = d3.time.Scale;
    export class Test{
       // margin:any
      width:number;
      height:number;

        line:any;
        area:any;


        xRange
        yRange;
        svg;

        yAxis;
        xAxis;

        gX:any;
        gY:any;
        draw(data):void{

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
        }

        createAxis():void{

        }

        setRanges(){
            var xRange = d3.time.scale()
                .range([0, this.width]);

            var yRange = d3.scale.log()
                .range([this.height, 0]);

            this.line = d3.svg.line()
                .x(function(d:any) { return xRange(d.date); })
                .y(function(d:any) { return yRange(d.ratio); });

            this.area = d3.svg.area()
                .x(function(d:any) { return xRange(d.date); })
                .y(function(d:any) { return yRange(d.ratio); });

            this.xRange = xRange;
            this.yRange = yRange;
        }


        constructor(){
               var margin = {top: 30, right: 30, bottom: 40, left: 50}
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

            d3.tsv("data/data.tsv", (error, data) =>{
                if (error) throw error;
                this.onData(data);

            });
        }


        setAxisX(data){
            this.xRange.domain(d3.extent(data, function(d:any) { return d.date; }));
            this.xAxis =  d3.svg.axis()
                .scale(this.xRange)
                .orient("bottom");

            var gX =   this.svg.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + this.height + ")");

            gX.call(this.xAxis);
        }
        mapValues(){
            var data = this.data;
            var baseValue = +data[0].close;
            var parseDate = d3.time.format("%d-%b-%y").parse;
            data.forEach(function(d) {
                d.date = parseDate(d.date);
                d.ratio = d.close / baseValue;
            });

            this.yRange.domain(d3.extent(data, function(d:any) { return d.ratio; }));
        }

        data:any;

        setArea():void{
            this.area.y0(this.yRange(1));
        }

        setAxisY(data){
         this.setArea();
            // Use a second linear scale for ticks.
            var formatPercent = d3.format("+.0%");
            var  formatChange = function(x) { return formatPercent(x - 1); };
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
                .classed("tick--one", function(d) { return Math.abs(d - 1) < 1e-6; });

        }

        onData(data):void{
            this.data = data;
            this.mapValues();
            this.setAxisX(data);
            this.setAxisY(data);
            this.draw(data)
        }


    }
}

$(document).ready(function(){
    var test:graphs.Test = new graphs.Test();
})