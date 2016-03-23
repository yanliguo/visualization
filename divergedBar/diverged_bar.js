/**
 * Usage:
    var divergedData = [
        {
            name: 'question1',
            data1: -20,
            data2: 30
        },
        {
            name: 'question2',
            data1: -15,
            data2: 53
        },
        {
            name: 'question3',
            data1: -43,
            data2: 70
        },
        {
            name: 'question4',
            data1: -12,
            data2: 64
        },
        {
            name: 'question5',
            data1: -27,
            data2: 48
        }];

var chart = new SimpleDivergedChart(divergedData);
chart.drawChart('#paint');
*/

    function SimpleDivergedChart(data) {
        this.jsonData = data;

        this.drawChart = function(containerId) {
            var margin = {top: 50, right: 30, bottom: 40, left: 130};
            var width = 960 - margin.left - margin.right;
            var height = 500 - margin.top - margin.bottom;

            var x = d3.scale.linear().range([0, width]);
            var y = d3.scale.ordinal().rangeRoundBands([0, height], 0.1);
            var xMin = d3.min(data, function(d) { return d.data1; });
            var xMax = d3.max(data, function(d) { return d.data2; });
            var leftMost = Math.abs(xMin) * width / (Math.abs(xMin) + xMax);

            var xAxis = d3.svg.axis().scale(x).orient("top");
            var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0).tickPadding(leftMost + 20);

            var svg = d3.select(containerId).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.domain([xMin, xMax]).nice();
            y.domain(data.map(function(d) { return d.name; }));

            var flatData = [];
            data.forEach(function (ele, idx, arr) {
                flatData.push({name: ele.name, value: ele.data1});
                flatData.push({name: ele.name, value: ele.data2});
            });

            svg.selectAll(".bar").data(flatData).enter().append("rect")
                .attr("class", function(d) { return "bar bar--" + (d.value< 0 ? "negative" : "positive"); })
                .attr("x", function(d) { return x(Math.min(0, d.value)); })
                .attr("y", function(d) { return y(d.name); })
                .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
                .attr("height", y.rangeBand());

            svg.append("g").attr("class", "x axis")
                //.attr("transform", "translate(0," + height + ")")
                .call(xAxis);
            svg.append("g").attr("class", "y axis")
                .attr("transform", "translate(" + x(0) + ",0)")
                .call(yAxis);
            // todo draw boxes
            var boxWidth = 40, boxHeight = 18;
            var middleX = width - leftMost;
            var yExpand = -30;
            var boxLeftTopY = 0 - (margin.top / 2 - boxHeight / 2) + yExpand;
            svg.append("g").append("rect")
                .attr("class", "bar bar--positive")
                .attr("x", leftMost / 2 - boxWidth / 2)
                .attr("y", boxLeftTopY)
                .attr("width", boxWidth)
                .attr("height", boxHeight);
            svg.append("g").append("rect")
                .attr("class", "bar bar--negative")
                .attr("x", (leftMost + width) / 2 - boxWidth / 2)
                .attr("y", boxLeftTopY)
                .attr("width", boxWidth)
                .attr("height", boxHeight);
        };
    }
