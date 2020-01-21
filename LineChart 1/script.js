// set the dimensions and margins of the graph
var margin = {top : 10, right: 100, bottom: 30, left: 30},
            width = window.innerWidth/3 - margin.left - margin.right,
            height = window.innerHeight/2 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
var url = "https://raw.githubusercontent.com/spjoshi/hekd3/master/LineChart%201/protocol_deviation_rate2.csv"
//Read the data
d3.csv(url).then(function (data) {
      data.forEach(function (d) {
                        d.Week = +d.Week;
                        d["BI201301"] = +d["BI201301"];
                        d["BIO423"] = +d["BIO423"];
                        d["BI122"] = +d["BI122"];
      })
            // List of groups (here I have one group per column)
            var allGroup = ["BI201301", "BIO423", "BI122"]
            console.log(data)
            // add the options to the button
            d3.select("#selectStudyButton")
                  .selectAll('myOptions')
                  .data(allGroup)
                  .enter()
                  .append('option')
                  .text(function (d) {
                        console.log(d)
                        return d;
                  }) // text showed in the menu
                  .attr("value", function (d) {
                        console.log(d)
                        return d;
                  }) // corresponding value returned by the button
            // console.log(allGroup)
            // A color scale: one color for each group
            var myColor = d3.scaleOrdinal()
                  .domain(allGroup)
                  .range(d3.schemeSet2);

            // Add X axis --> it is a date format
            var x = d3.scaleLinear()
                  .domain([0, 10])
                  .range([0, width]);
            svg.append("g")
                  .attr("transform", "translate(0," + height + ")")
                  .call(d3.axisBottom(x));

            // Add Y axis
            var y = d3.scaleLinear()
                  .domain([0, 1])
                  .range([height, 0]);
            svg.append("g")
                  .call(d3.axisLeft(y));

            // Initialize line with group a
            var line = svg
                  .append('g')
                  .append("path")
                  .datum(data)
                  .attr("d", d3.line()
                        .x(function (d) {
                              // console.log(d)
                              // console.log(x(d.Week))
                              return x(d.Week)
                              
                        })
                        .y(function (d) {
                              // console.log(y(d.BI201301))
                              return y(d.BI201301)
                        })
                  )
                  .attr("stroke", function (d) {
                        return myColor("BI201301")
                  })
                  .style("stroke-width", 4)
                  .style("fill", "none")

            // A function that update the chart
            function update(selectedGroup) {

                  // Create new data with the selection?
                  var dataFilter = data.map(function (d) {
                        return {
                              Week: d.Week,
                              value: d[selectedGroup]
                        }
                  })

                  // Give these new data to update line
                  line
                        .datum(dataFilter)
                        .transition()
                        .duration(1000)
                        .attr("d", d3.line()
                              .x(function (d) {
                                    console.log(d.Week)
                                    return x(d.Week)

                              })
                              .y(function (d) {
                                    console.log(d.value)
                                    return y(d.value)
                              })
                        )
                        .attr("stroke", function (d) {
                              return myColor(selectedGroup)
                        })
            }

            // When the button is changed, run the updateChart function
            d3.select("#selectStudyButton").on("change", function (d) {
                  // recover the option that has been chosen
                  var selectedOption = d3.select(this).property("value")
                  // run the updateChart function with this selected option
                  update(selectedOption)
            })

      })