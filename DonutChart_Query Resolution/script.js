// set the dimensions and margins of the graph
var widthQR = 650;
heightQR = 450;
marginQR = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(widthQR, heightQR) / 2 - marginQR;

// append the svg object to the div called 'my_dataviz'
var svgQR = d3
  .select("#QR_DonutViz")
  .append("svg")
  .attr("width", widthQR)
  .attr("height", heightQR)
  .append("g")
  .attr("transform", "translate(" + widthQR / 2 + "," + heightQR / 2 + ")");

// Create dummy data
var dataQR = {
  Open: 9,
  Closed: 20,
  Answered: 30,
  Cancelled: 8
};

// data2QR = {
//     All: {
//         Open: 9,
//         Closed: 20,
//         Answered: 30,
//         Cancelled: 8
//     },
//     UCSF: {
//         Open: 9,
//         Closed: 20,
//         Answered: 30,
//         Cancelled: 8
//     },
//     Kaiser: {
//         Open: 9,
//         Closed: 20,
//         Answered: 30,
//         Cancelled: 8
//     },
//     UCLA: {
//         Open: 9,
//         Closed: 20,
//         Answered: 30,
//         Cancelled: 8
//     },
// }

// set the color scale
var color = d3
  .scaleOrdinal()
  .domain(["a", "b", "c", "d", "e", "f", "g", "h"])
  .range(d3.schemeDark2);

// Compute the position of each group on the pie:
var pie = d3
  .pie()
  .sort(null) // Do not sort group by size
  .value(function(d) {
    return d.value;
  });
var data_ready = pie(d3.entries(dataQR));

// The arc generator
var arc = d3
  .arc()
  .innerRadius(radius * 0.5) // This is the size of the donut hole
  .outerRadius(radius * 0.8);

// Another arc that won't be drawn. Just for labels positioning
var outerArc = d3
  .arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9);

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svgQR
  .selectAll("allSlices")
  .data(data_ready)
  .enter()
  .append("path")
  .attr("d", arc)
  .attr("fill", function(d) {
    return color(d.data.key);
  })
  .attr("stroke", "white")
  .style("stroke-width", "2px")
  .style("opacity", 0.7);

// Add the polylines between chart and labels:
svgQR
  .selectAll("allPolylines")
  .data(data_ready)
  .enter()
  .append("polyline")
  .attr("stroke", "black")
  .style("fill", "none")
  .attr("stroke-width", 1)
  .attr("points", function(d) {
    var posA = arc.centroid(d); // line insertion in the slice
    var posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
    var posC = outerArc.centroid(d); // Label position = almost the same as posB
    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
    posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
    // return [posA, posB, posC]
  });

// Add the polylines between chart and labels:
svgQR
  .selectAll("allLabels")
  .data(data_ready)
  .enter()
  .append("text")
  .text(function(d) {
    console.log(d.data.key);
    return d.data.key + " (" + d.data.value + ")";
  })
  .attr("transform", function(d) {
    var pos = outerArc.centroid(d);
    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
    pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
    return "translate(" + outerArc.centroid(d) + ")";
  })
  .style("text-anchor", function(d) {
    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
    return midangle < Math.PI ? "start" : "end";
  })
  .style("font-size", ".8em");

svgQR
  .append("text")
  .attr("class", "toolCircle")
  .attr("dy", 0) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
  .html("Query Resolution") // add text to the circle.
  .style("font-size", "1.2em")
  .style("text-anchor", "middle");
