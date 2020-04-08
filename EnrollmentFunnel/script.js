// set the dimensions and margins of the graph
var margin = {
    top: 10,
    right: 30,
    bottom: 190,
    left: 100
  },
  width = window.innerWidth - margin.left - margin.right,
  height = window.innerHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#chart_div")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

//Parse the Data
d3.csv(
  "https://raw.githubusercontent.com/spjoshi/d3hekma/master/D3/EnrollmentFunnelData.csv").then(function (data) {

  data = data.filter(function (d, i) {
    return i < 5 || i == 7
  })
  console.log(data);
  // X axis
  var x = d3
    .scaleBand()
    .range([0, width])
    .domain(
      data.map(function (d) {
        return d.Stage;
      })
    )
    .padding(0.2);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    // .attr("transform", "translate(-10, 0) rotate(-45)")
    .style("text-anchor", "middle");

  // Y axis
  var y = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, 3000]);
  svg.append("g").call(d3.axisLeft(y));

  svg
    .selectAll()
    .data(data)
    .enter()
    .append("text")
    .text(function (d, i) {
      console.log(i);
      return d.Value;
    })
    .attr("text-anchor", "middle")
    .attr("x", function (d, i) {
      console.log(i);
      // return x(i);
      return x(d.Stage) + x.bandwidth() / 2;
      // return i * (width / d["Value"].length);
    })
    .attr("y", function (d, i) {
      return y(d.Value) - 5;
      // return h - y(d.Value);
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "navy");
  // Bars
  svg
    .selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
      return x(d.Stage);
    })
    .attr("width", x.bandwidth())
    .attr("fill", function (d) {
      if ((d.Stage === "Withdrawn") | (d.Stage === "Failed Screen")) {
        return "#EC1C23";
      } else {
        return "#69b3a2";
      }
    })
    // no bar at the beginning thus:
    .attr("height", function (d) {
      return height - y(0);
    })
    .attr("y", function (d) {
      return y(0);
    });

  // Animation
  svg
    .selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function (d, i) {
      console.log(i * 10);
      return y(d.Value);
    })
    .attr("height", function (d) {
      return height - y(d.Value);
    })
    .delay(function (d, i) {
      console.log(i * 2);
      return i * 101;
    });

}); // data closure