/**
 * Usage:
    var divergedData = [
        {
            name: 'question1',
            x: -20,
            y: 30
        },
        {
            name: 'question2',
            x: -15,
            y: 53
        },
        {
            name: 'question3',
            x: -43,
            y: 70
        },
        {
            name: 'question4',
            x: -12,
            y: 64
        },
        {
            name: 'question5',
            x: -27,
            y: 48
        }];

var chart = new Axes(divergedData);
chart.xMax = 10;
chart.xMin = -1;
chart.yMax = 10;
chart.yMin = -2;
chart.drawChart('#paint');
*/

    function Axes(data) {
        this.jsonData = data;
	this.xMax = undefined;
	this.xMin = undefined;
	this.yMax = undefined;
	this.yMin = undefined;
	this.xAxisName = "X Axis";
	this.yAxisName = "Y Axis";
	this.minRadius = 10;

	this.calculateRadius = function (x, y) {
            var calR = Math.sqrt(Math.abs(450 - (x-15)*(x-15) - (y-15)*(y-15))); 
            if (calR < this.minRadius) {
                return this.minRadius;
            } else {
	        return calR;
	    }
        };

	this.drawChart = function(containerId) {

	    var color = d3.scale.category10();
            var margin = {top: 50, right: 30, bottom: 40, left: 130};
            var width = 960 - margin.left - margin.right;
            var height = 500 - margin.top - margin.bottom;

            var x = d3.scale.linear().range([0, width]);
	    var y = d3.scale.linear().range([height, 0]);
            // var y = d3.scale.ordinal().rangeRoundBands([0, height], 0.1);
	    if (this.xMax == undefined) {
                this.xMax = d3.max(this.jsonData, function(d) { return d.x; });
	    }
	    if (this.xMin == undefined) {
	        this.xMin = d3.min(this.jsonData, function(d) { return d.x; });
	    }
	    if (this.yMax == undefined) {
                this.yMax = d3.max(this.jsonData, function(d) { return d.y; });
	    }
	    if (this.yMin == undefined) {
	        this.yMin = d3.min(this.jsonData, function(d) { return d.y; });
	    }

            var xAxis = d3.svg.axis().scale(x).orient("bottom");
            var yAxis = d3.svg.axis().scale(y).orient("left").tickPadding(6);

            var svg = d3.select(containerId).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.domain([this.xMin, this.xMax]).nice();
            y.domain([this.yMin, this.yMax]).nice();

	    for (var idx in this.jsonData) {
	        var d = this.jsonData[idx];
	        d.cx = x(d.x);
		d.cy = y(d.y);
		d.r = this.calculateRadius(d.x, d.y);
		d.color = color(idx % 9);
	    }
	    
	    // calculate circle cx, cy & color
	    this.jsonData.forEach(function (d, idx, arr) {
	    });


            // circles
            svg.selectAll(".axes").data(this.jsonData).enter().append("circle")
	        .attr("r", function(d) { return d.r; })
		.attr("cx", function(d) { return d.cx; })
		.attr("cy", function(d) { return d.cy; })
		.on("mouseover", function(d) { 
	            d3.select("#circle-text-" + d.name).style("visibility", "visible");
		})
		.on("mouseout", function(d) { 
	            d3.select("#circle-text-" + d.name).style("visibility", "hidden");
		})
		.style("fill", function(d) { return d.color; }); 

            // circle names
	    this.jsonData.forEach(function (d, idx, arr) {
	        svg.append("text")
		    .attr("x", d.cx)
		    .attr("y", d.cy + d.r + 15)
		    .attr("text-anchor", "middle")
		    .text(d.name);
	    });
	    // circle values
	    this.jsonData.forEach(function (d, idx, arr) {
	        svg.append("text").attr("id", "circle-text-" + d.name)
		    .attr("x", d.cx + d.r + 5)
		    .attr("y", d.cy + d.r - 5)
		    //.attr("text-anchor", "middle")
		    .style("fill", d.color)
		    .style("visibility", "hidden")
		    .text("(" + d.x + ", " + d.y + ")");
	    });



            svg.append("g").attr("class", "x axis")
                .attr("transform", "translate(0," + y(0) + ")")
                .call(xAxis);
            svg.append("g").attr("class", "y axis")
                .attr("transform", "translate(" + x(0) + ",0)")
                .call(yAxis);
	    svg.append("g").append("text")
	        .attr("x", width / 2)
		.attr("y", y(0) + 40)
		.attr("text-anchor", "middle")
		.text(this.xAxisName);
	    var yLabelLeftX = x(0) - 40;
	    var yLabelLeftBottom = height / 2;
	    svg.append("g").append("text")
		.attr("transform", "translate(" + (0 - yLabelLeftBottom + 30) + "," + yLabelLeftBottom + ")" + " rotate(-90)")
	        .attr("x", yLabelLeftX)
		.attr("y", yLabelLeftBottom)
		.attr("text-anchor", "middle")
		.text(this.yAxisName);
        };

    };


