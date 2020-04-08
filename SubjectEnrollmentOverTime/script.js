// set the dimensions and margins of the graph
var margin = {
        top: 20,
        right: 20,
        bottom: 100,
        left: 50
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time - define how we want to define the date format
var parseTime = d3.timeParse("%d-%b-%y");

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#enrollment_timeline_div").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("enrollment_timeline_data.csv").then(function (data) {

    // format the data
    data.forEach(function (d) {
        d.date = parseTime(d.date);
        d.planned = +d.planned;
    });

    // define the line
    var targetline = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.target);
        });

    // define the line
    var plannedline = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.planned);
        })
        .curve(d3.curveBasis);

    // define the line
    var actualline = d3.line()
        .defined(d => !isNaN(d.actual))
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.actual);
        })
        .curve(d3.curveBasis);

    // define the line
    var forecastline = d3.line()
        .defined(d => !isNaN(d.forecast))
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.forecast);
        })
        .curve(d3.curveBasis);

    var forecastLegendLine = d3.line()
        .defined(d => !isNaN(d.forecastLegend))
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.forecastLegend);
        })
        .curve(d3.curveBasis);

    var plannedLegendLine = d3.line()
        .defined(d => !isNaN(d.plannedLegend))
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.plannedLegend);
        })
        .curve(d3.curveBasis);

    var actualLegendLine = d3.line()
        .defined(d => !isNaN(d.actualLegend))
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.actualLegend);
        })
        .curve(d3.curveBasis);

    var targetLegendLine = d3.line()
        .defined(d => !isNaN(d.targetLegend))
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.targetLegend);
        })
        .curve(d3.curveBasis);

    var x = d3.scaleTime()
        .range([0, width])
        .domain(d3.extent(data, function (d) {
            return d.date;
        }));

    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, function (d) {
            return d.planned;
        }) * 1.1]);

    // Add the actualline path.
    actualPath = svg.append("svg:path")
        .data([data])
        .attr("class", "actualline")
        .attr("d", actualline)
        .on("mouseout", function () {
            d3.select(this)
                .transition()
                .duration(250)
                .attr("stroke", "red");
        });

    // Add the plannedline path.
    svg.append("path")
        .data([data])
        .attr("class", "targetline")
        .attr("d", targetline);

    // Add the plannedline path.
    svg.append("path")
        .data([data])
        .attr("class", "plannedline")
        .attr("d", plannedline);

    svg.append("path")
        .data([data])
        .attr("class", "forecastline")
        .attr("d", forecastline);

    var legendNames = ["planned", "actual", "forecast", "target"]

    svg.selectAll('text')
        .data(legendNames)
        .enter()
        .append('text')
        .attr("class", "legend")
        .text(function (d) {
            return d;
        })
        .attr('x', 80)
        .attr('y', function (d, i) {
            return 73 + 34 * i
        });

    var legendLines = [forecastLegendLine, plannedLegendLine, actualLegendLine, targetLegendLine]
    svg.append("path")
        .data([data])
        .attr("class", "forecastline")
        .attr("d", forecastLegendLine);
    svg.append("path")
        .data([data])
        .attr("class", "plannedline")
        .attr("d", plannedLegendLine);
    svg.append("path")
        .data([data])
        .attr("class", "actualline")
        .attr("d", actualLegendLine);
    svg.append("path")
        .data([data])
        .attr("class", "targetline")
        .attr("d", targetLegendLine);

    // Add the X Axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .tickFormat(d3.timeFormat("%b-%y")))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    // Add the Y Axis
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));

    yLabel = svg.append("svg:g")
        .append("text")
        // .attr("class", "credit")
        .attr("transform", "rotate(-90)")
        .attr("class", "legend")
        .attr("y", -40)
        .attr("x", -height / 2)
        .attr("dy", ".05em")
        .style("text-anchor", "middle")
        .text("Subject Count");


    var tooltip = d3.select('body')
        .append('div')
        .attr("class", "tooltip")

    var m_over = function (line) {
        line.on("mouseover", function () {
            d3.select(this)
                .attr("stroke", "orange");
        });
    }
    // Hover over line : mouse out
    var m_out = function (line, stroke_color) {
        line.on("mouseout", function () {
            d3.select(this)
                .transition()
                .duration(250)
                .attr("stroke", stroke_color);
        });
    }
});