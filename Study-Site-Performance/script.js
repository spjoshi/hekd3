// set the dimensions and margins of the graph
var margin = {
            top: 80,
            right: 100,
            bottom: 80,
            left: 30
      },
      width = window.innerWidth - margin.left - margin.right,
      height = window.innerHeight / 1.1 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + (margin.left + 20) + "," + margin.top + ")");

var url = "https://raw.githubusercontent.com/spjoshi/hekd3/master/site_performance_data.csv"
//Read the data
d3.csv(url).then(function (data) {
      data.forEach(function (d) {
            d["Screen Failure Rate"] = +d["Screen Failure Rate"];
            d["Enrollment Rate"] = +d["Enrollment Rate"];
            d["Withdrawal Rate"] = +d["Withdrawal Rate"];
            d["Protocol Deviation Rate"] = +d["Protocol Deviation Rate"];
            d["Adverse Event Rate"] = +d["Adverse Event Rate"];
      })
      // List of groups (here I have one group per column)
      var allGroup = ["Screen Failure Rate", "Enrollment Rate", "Withdrawal Rate", "Protocol Deviation Rate", "Adverse Event Rate"]
      // add the options to the button
      d3.select("#selectStudyButton")
            .selectAll('myOptions')
            .data(allGroup)
            .enter()
            .append('option')
            .text(function (d) {
                  return d;
            }) // text showed in the menu
            .attr("class", "button")
            .attr("value", function (d) {
                  return d;
            }) // corresponding value returned by the button


      // A color scale: one color for each group
      var myColor = d3.scaleOrdinal()
            .domain(allGroup)
            .range(d3.schemeSet2);

      // Add X axis --> Ordinal Scale
      var x = d3
            .scaleBand()
            .rangeRound([0, width])
            .domain(
                  data.map(function (d) {
                        return d.Site;
                  })
            )
            .padding(0.2);
      svg
            .append("g")
            .attr("transform", "translate(0," + (height - 60) + ")")
            .call(d3.axisBottom(x).ticks().tickSize(-innerHeight))
            .attr("class", "axis axis-grid")
            .selectAll("text")
            .attr("transform", "translate(0, 0) rotate(-25)")
            .style("text-anchor", "end");

      // Add Y axis
      var y = d3.scaleLinear()
            .domain([-0.1, 1])
            .range([height, 0]);
      svg.append("g")
            .attr("transform", "translate(0," + (-60) + ")")
            .call(d3.axisLeft(y))
            .attr("class", "axis axis-grid");

      svg.append("line") // attach a line
            .style("stroke", "grey") // colour the line
            .attr("x1", 0)
            .attr("y1", height - margin.bottom)
            .attr("x2", width)
            .attr("y2", height - margin.bottom)
            .attr("opacity", 0.1)
            .transition()
            .duration(3000)
            // x1 position of the first end of the line
            .attr("y1", function (d) {
                  return y(.8)
            }) // y1 position of the first end of the line
            .attr("transform", "translate(0," + (-60) + ")")
            .attr("x2", width)
            .attr("y2", function (d) {
                  return y(.8)
            }) // y1 position of the first end of the line
            .attr("opacity", 1)

      svg
            .selectAll("circle")
            .exit()
            .data(data)
            .enter()
            .append("circle")
            .attr("transform",
                  "translate(" + (margin.left + 20) + ", " + (-60) + ")")
            .attr("cx", function (d, i) {
                  return x(d.Site);
            })
            .attr("cy", function (d) {
                  // return y(d["Enrollment Rate"]);
                  return y(0);
                  // return y(d["Screen Failure Rate"]);
            })
            .transition()
            .duration(2000)
            .attr("cy", function (d) {
                  // return y(d["Enrollment Rate"]);
                  return y(d["Screen Failure Rate"]);
                  // return y(d["Screen Failure Rate"]);
            })
            .attr("r", 10)
            .attr("transform",
                  "translate(" + (margin.left + 20) + ", " + (-60) + ")")
            // .attr("transform", "translate(10," + (height - 60) + ")")
            .style("fill", function (d) {
                  if (d["Query Resolution"] == "Open") {
                        return "#27ae60"
                  } else {
                        return "#9b59b6"
                  }
            })
            .style("opacity", 1.5)

      svg
            .selectAll("circle")
            .on("mouseover", function (d, i) {

                  tooltip.style("opacity", 1);
                  tooltip.html("<span style = 'font-size: 12pt'>" + d.Site + "</span>" + "<br/>" + "Screen Failure Rate: " + d["Screen Failure Rate"])
                        .style("left", d3.event.pageX + "px")
                        .style("top", (d3.event.pageY - 38) + "px")
                        .style("fill", "blue")
                  console.log("here too")
            })
            .on("mouseout", function (d) {
                  tooltip.style("opacity", 0);
            })

      var tooltip = d3.select("body")
            .append('div')
            .attr("class", "tooltip")
            .style("opacity", 0)


      // A function that update the chart
      function update(selectedGroup) {

            // Create new data with the selection?
            var dataFilter = data.map(function (d) {
                  return {
                        Site: d.Site,
                        value: +d[selectedGroup]
                  }
            })
            // console.log(selectedGroup)
            console.log(dataFilter)
            // Give these new data to update scatter plot
            svg
                  .selectAll("circle")
                  .datum(dataFilter)
                  .transition()
                  .duration(1000)
                  .attr("cx", function (d, i) {
                        return x(d[i].Site);
                  })
                  .attr("cy", function (d, i) {
                        console.log("cy" + d[i].value)
                        return y(+d[i].value);
                  })
            svg
                  .selectAll("circle")
                  .on("mouseover", function (d, i) {
                        tooltip.style("opacity", 1);
                        tooltip.html("<span style = 'font-size: 12pt'>" + d[i].Site + "</span>" + "</br>" + selectedGroup + ": " + d[i].value)
                              .style("left", d3.event.pageX + "px")
                              .style("top", (d3.event.pageY - 38) + "px")
                              .style("fill", "blue")
                  })
                  .on("mouseout", function (d) {
                        tooltip.style("opacity", 0);
                  })
      }

      // When the button is changed, run the updateChart function
      d3.select("#selectStudyButton").on("change", function (d) {
            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
            console.log(selectedOption)
            // run the updateChart function with this selected option
            update(selectedOption)
      })

})