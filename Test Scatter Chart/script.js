var m = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 25
  },
  WIDTH = 900 - m.left - m.right,
  HEIGHT = 400 - m.top - m.bottom;

// ====================================================================================

var svg = d3.select("VNContent").append("svg")
  .attr("width", WIDTH + m.left + m.right)
  .attr("height", HEIGHT + m.top + m.bottom)
  .append("g")
  .attr("transform", "translate(" + (m.left) + "," + 0 + ")");


data = d3.json('https://raw.githubusercontent.com/spjoshi/d3hekma/master/D3/city_enrollment.json').then(function (data) {
  //======================================================
  //Create scale functions
  xScale = d3.scaleLinear().range([m.left, WIDTH - m.right]).domain([0, 100]);
  yScale = d3.scaleLinear().range([HEIGHT - m.top, m.bottom]).domain([0, 300]);
  // .rangeRoundBands([m.top, HEIGHT- m.bottom]);

  //Define X axis
  svg.append("g")
    .attr("transform", "translate(0, " + HEIGHT + ")")
    .call(d3.axisBottom(xScale).tickFormat(d3.format(".2f")))
    .append("text")
    .attr("x", WIDTH / 2)
    .attr("y", HEIGHT + 30)
    .text("X-Label");
  // ====================================================================================
  //Define Y axis
  svg.append("g")
    .attr("transform", "translate(" + (m.left) + "," + (m.top) + ")")
    .call(d3.axisLeft(yScale));
  // ====================================================================================


  // Add title text
  title = svg.append("text")
    .attr("class", "title")
    // .attr("class", "x axis")
    .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate(" + (WIDTH / 2) + ", .5)") // centre below axis
    .attr("dy", ".5em")
    .style("background-color", "white")
  // .text("Time to Unreversed 2-Point Decline in Motor Score (Unmatched)");

  xLabel = svg.append("svg:g")
    .append("text")
    .attr("class", "label")

    // .attr("class", "x axis credit")
    .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate(" + (WIDTH / 2) + "," + (HEIGHT + 10) + ")") // centre below axis
    .attr("dy", "1.95em")
    .text("X Label");

  yLabel = svg.append("svg:g")
    .append("text")
    // .attr("class", "credit")
    .attr("transform", "rotate(-90)")
    .attr("class", "label")
    .attr("y", -15)
    .attr("x", -HEIGHT / 2)
    .attr("dy", ".05em")
    .style("text-anchor", "middle")
    .text("Y Label");
  // ====================================================================================

  transition_duration = 1000


  var vn = svg.selectAll("dot")
  // svg.selectAll("dot")
  vn.data(data)
    .enter()
    .append("circle")
    //   console.log(d.coverage)
    .attr("cx", function (d) {
      return xScale(0);
    })
    .attr("cy", function (d) {
      return yScale(0);
    })
    .attr("r", function (d) {
      return (4 + (d.population * .1));
    })
    .attr("fill", "#fff")
    .attr("opacity", 0)
    .attr("stroke", "skyblue")
    .attr("stroke-width", 12);
  vn.transition()
    .duration(function (d, i) {
      return i * 2
    })
    .attr("r", function (d) {
      return (4 + (d.population * .4));
    });
  // .style("fill", "none");

  var t = d3.transition()
    .duration(1000)
    .ease(d3.easeLinear);

  svg.selectAll("circle")
    .transition(t)
    .delay(1000) // First fade to green.
    .style("fill", function (d) {
      if (d.product == " Product 1 ") {
        return "#AF1280"
      } else {
        return "skyblue"
      }
    })
    .attr("opacity", .8)
    .attr("stroke", "gray")
    .attr("stroke-width", 2)
    .attr("cx", function (d) {
      return xScale(d.coverage);
    })
    .attr("cy", function (d) {
      return yScale(d.population);
    });
  var populationThreshold = 200;

  svg.selectAll("circle")
    .transition(t)
    .on("start", function repeat() {
      d3.active(this)
        .attr("r", function (d) {
          if (d.population > populationThreshold) {
            return 0
          } else {
            return (4 + (d.population * .1))
          }
        })
        .attr("cx", function (d) {
          if (d.product == "Product 2") {
            return xScale(d.coverage)
          } else {
            return xScale(d.coverage)
          }
        })
        .transition(t)
        .attr("cx", function (d) {
          return xScale(d.coverage);
        })
        .attr("r", function (d) {
          return (4 + (d.population * .1));
        })
        .transition(t)
        .on("start", repeat);
    });

  svg.selectAll("circle").on("mouseover", function (d, i) {

      tooltip.style("opacity", 1);
      tooltip.html("Country: " + d.location + "<br/>" + " Annual Enrollment Potential: " + d.range + "<br/>" + "# of Patients: " + d.population)
        .style("left", d3.event.pageX + "px")
        .style("top", (d3.event.pageY - 38) + "px")

    })

    .on("mouseout", function (d) {
      tooltip.style("opacity", 0);
    })

  var tooltip = d3.select('body')
    .append('div')
    .attr("class", "tooltip")
    .style("opacity", 0);
}) // end of city enrollment data