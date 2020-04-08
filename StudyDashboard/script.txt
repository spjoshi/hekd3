// ================= START Enrollment BAR ==========================
var selectedPerformanceOption2
var currentStudy
var selectedStudy
// set the dimensions and margins of the graph
var margin = {
    top: 30,
    right: 30,
    bottom: 90,
    left: 50
  },
  // width = window.innerWidth - margin.left - margin.right,
  // height = window.innerHeight - margin.top - margin.bottom;
  width = 500,
  height = 300;

// append the svg1 object to the body of the page
var svg1 = d3
  .select("#bar_div")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

//Parse the Data
d3.csv(
"https://raw.githubusercontent.com/spjoshi/hekd3/master/enrollmentFunnelData.csv"
).then(function (data1) {
  data1 = data1.filter(function (d, i) {
    return i < 6;
  });

  data1.forEach(function (d) {
    d.Stage = d.Stage;
    d["BI201301"] = +d["BI201301"];
    d["BIO423"] = +d["BIO423"];
    d["BI122"] = +d["BI122"];
  });

  var allGroup = ["BI201301", "BIO423", "BI122"];
  // add the options to the button
  d3.select("#selectStudyButton")
    .selectAll("myOptions")
    .data(allGroup)
    .enter()
    .append("option")
    .text(function (d) {
      return d;
    }) // text showed in the menu
    .attr("value", function (d) {
      return d;
    }); // corresponding value returned by the button

  // A color scale: one color for each group
  var myColor = d3
    .scaleOrdinal()
    .domain(allGroup)
    .range(d3.schemeSet2);
  // X axis
  var x = d3
    .scaleBand()
    .range([0, width])
    .domain(
      data1.map(function (d) {
        return d.Stage;
      })
    )
    .padding(0.2);

  svg1
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10, 0) rotate(-45)")
    .style("text-anchor", "end");

  // Y axis
  var y = d3
    .scaleLinear()
    .range([height, 0])
    .domain([
      0,
      d3.max(data1, function (d) {
        return d.BI201301;
      })
    ]);
  svg1
    .append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y));

  svg1
    .selectAll()
    .data(data1)
    .enter()
    .append("text")
    .text(function (d, i) {
      console.log(i);

      return d.Value;
    })
    .attr("text-anchor", "middle")
    .attr("x", function (d, i) {
      console.log(i);
      return x(d.Stage) + x.bandwidth() / 2;
    })
    .attr("y", function (d, i) {
      return y(d.BI201301);
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "navy");
  // Bars
  var bar = svg1
    .selectAll("mybar")
    .data(data1)
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
      return x(d.Stage);
    })
    .attr("width", x.bandwidth())
    .attr("fill", function (d) {
      if ((d.Stage === "Withdrawn") | (d.Stage === "Failed Screen")) {
        return "#EC1C23";
        console.log("====" + height);
      } else {
        return "#69b3a2";
      }
    })
    // no bar at the beginning thus:
    .attr("height", function (d) {
      return height - y(0);
      console.log("====" + height);
    })
    .attr("y", function (d) {
      return y(0);
    });

  // Animation
  svg1
    .selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function (d, i) {
      console.log(i * 10);
      return y(d.BI201301);
    })
    .attr("height", function (d) {
      return height - y(d.BI201301);
    })
    .delay(function (d, i) {
      console.log(i * 2);
      return i * 101;
    });

  // A function that update the chart
  function updateBar(selectedGroup) {
    // Create new data with the selection?
    var dataFilter = data1.map(function (d) {
      return {
        Stage: d.Stage,
        Value: d[selectedGroup]
      };
    });

    var y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([
        0,
        d3.max(dataFilter, function (d) {
          return d.Value;
        })
      ])
      .nice();
    svg1
      .selectAll(".y")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(y));

    // Animation
    bar
      .data(dataFilter)
      .transition()
      .duration(800)
      .attr("height", function (d) {
        return height - y(d.Value);
        console.log(d.Value);
      })
      .attr("y", function (d, i) {
        console.log(i * 10);
        return y(d.Value);
      })
      .delay(function (d, i) {
        console.log(i * 2);
        return i * 101;
      });
  }

  // ===================== END Enrollment BAR =======================

  // ===================== START Protocol Deviation =======================

  // append the svg object to the body of the page
  var svg2 = d3
    .select("#pd_div")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr(
      "transform",
      "translate(" + (margin.left + 85) + "," + margin.top + ")"
    );

  var url =
    "https://raw.githubusercontent.com/spjoshi/hekd3/master/LineChart%201/protocol_deviation_rate2.csv";
  //Read the data
  d3.csv(url).then(function (data2) {
      data2.forEach(function (d) {
        d.Week = +d.Week;
        d["BI201301"] = +d["BI201301"];
        d["BIO423"] = +d["BIO423"];
        d["BI122"] = +d["BI122"];
        console.log(data2);
      });
      // List of groups (here I have one group per column)
      var allGroup = ["BI201301", "BIO423", "BI122"];

      var myColor = d3
        .scaleOrdinal()
        .domain(allGroup)
        .range(d3.schemeSet1);

      // Add X axis --> it is a date format
      var x2 = d3
        .scaleLinear()
        .domain([0, 10])
        .range([0, width]);
      svg2
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x2 axis")
        .call(d3.axisBottom(x2));

      // Add Y axis
      var y2 = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data2, function (d) {
            return d.BI201301;
          })
        ])
        .range([height, 0]);
      svg2
        .append("g")
        .attr("class", "y2 axis")
        .call(d3.axisLeft(y2));

      // Initialize line
      var line = svg2
        .append("g")
        .append("path")
        .datum(data2)
        .attr(
          "d",
          d3
          .line()
          .x(function (d) {
            // console.log(d)
            // console.log(x(d.Week))
            return x2(d.Week);
          })
          .y(function (d) {
            // console.log(y(d.BI201301))
            return y2(d.BI201301);
          })
        )
        .attr("stroke", function (d) {
          return myColor("BI201301");
        })
        .style("stroke-width", 4)
        .style("fill", "none");
      yLabel = svg2.append("svg:g")
        .append("text")
        // .attr("class", "credit")
        // .attr("transform", "rotate(-90)")
        // .attr("class", "legend")
        .attr("y", height + margin.bottom / 2)
        .attr("x", width / 2)
        .attr("dy", ".05em")
        .style("text-anchor", "middle")
        .text("Protocol Deviation Rate");

      // A function that update the chart
      function updatePD(selectedGroup) {
        // Create new data with the selection?
        var dataFilter2 = data2.map(function (d) {
          return {
            Week: d.Week,
            value: d[selectedGroup] * 3
          };
        });

        var y2 = d3
          .scaleLinear()
          .range([height, 0])
          .domain([
            d3.min(dataFilter2, function (d) {
              return d.value / 1.5;
            }),
            d3.max(dataFilter2, function (d) {
              return d.value;
            })
          ])
          .nice();
        svg2
          .selectAll(".y2")
          .transition()
          .duration(500)
          .call(d3.axisLeft(y2));


        // Give these new data to update line
        line
          .datum(dataFilter2)
          .transition()
          .duration(1000)
          .attr(
            "d",
            d3
            .line()
            .x(function (d) {
              return x2(d.Week);
            })
            .y(function (d) {
              return y2(d.value);
            })
          )
          .attr("stroke", function (d) {
            return myColor(selectedGroup);
          });
      }

      // ====================== END Protocol Deviation ==========================

      // ====================== START QUERY RESOLUTION ==========================

      // set the dimensions and margins of the graph
      var widthQR = 580;
      var heightQR = 420;
      var marginQR = 40;

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

      // Create data
      var dataQR2 = {
        BI201301: {
          // Status: { Yes: 10, No: 20 },
          Open: 9,
          Closed: 20,
          Answered: 30,
          Cancelled: 8
        },
        BIO423: {
          Open: 20,
          Closed: 30,
          Answered: 40,
          Cancelled: 8
        },
        BI122: {
          Open: 19,
          Closed: 29,
          Answered: 10,
          Cancelled: 15
        }
      };

      // set the color scale
      var color = d3
        .scaleOrdinal()
        .domain(["a", "b", "c", "d", "e", "f", "g", "h"])
        .range(d3.schemeDark2);

      // Compute the position of each group on the pie:
      var pie = d3
        .pie()
        .sort(null) // Do not sort group by size
        .value(function (d) {
          return d.value;
        });
      var data_ready = pie(d3.entries(dataQR2["BI122"]));

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
      pieChart = svgQR
        .selectAll("allSlices")
        .data(data_ready)
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", function (d) {
          return color(d.data.key);
        })
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);

      // Add the polylines between chart and labels:
      polyLine = svgQR
        .selectAll("allPolylines")
        .data(data_ready)
        .enter()
        .append("polyline")
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr("points", function (d) {
          var posA = arc.centroid(d); // line insertion in the slice
          var posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
          var posC = outerArc.centroid(d); // Label position = almost the same as posB
          var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
          posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
          // return [posA, posB, posC]
        });

      // Add the polylines between chart and labels:
      label = svgQR
        .selectAll("allLabels")
        .data(data_ready)
        .enter()
        .append("text")
        .text(function (d) {
          console.log(d.data.key);
          return d.data.key + " (" + d.data.value + ")";
        })
        .attr("transform", function (d) {
          var pos = outerArc.centroid(d);
          var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
          return "translate(" + outerArc.centroid(d) + ")";
        })
        .style("text-anchor", function (d) {
          var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          return midangle < Math.PI ? "start" : "end";
        })
        .style("font-size", "1em");

      labelFormat = svgQR
        .append("text")
        .attr("class", "toolCircle")
        .attr("dy", 0) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
        .html("Query Resolution") // add text to the circle.
        .style("font-size", "1.4em")
        .style("text-anchor", "middle");

      function updateQR(selectedGroup) {
        var data_ready2 = pie(d3.entries(dataQR2[selectedGroup]));

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        pieChart
          .data(data_ready2)
          .attr("d", arc)
          .attr("fill", function (d) {
            return color(d.data.key);
          });

        // Add the polylines between chart and labels:
        polyLine
          .data(data_ready2)
          .transition()
          .duration(1000)
          .attr("points", function (d) {
            var posA = arc.centroid(d); // line insertion in the slice
            var posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
            var posC = outerArc.centroid(d); // Label position = almost the same as posB
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
            posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
            // return [posA, posB, posC]
          });

        // Add the polylines between chart and labels:
        label
          .data(data_ready2)
          .transition()
          .duration(100)
          .text(function (d) {
            console.log(d.data.key);
            return d.data.key + " (" + d.data.value + ")";
          })
          .attr("transform", function (d) {
            var pos = outerArc.centroid(d);
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return "translate(" + outerArc.centroid(d) + ")";
          })
          .style("text-anchor", function (d) {
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            return midangle < Math.PI ? "start" : "end";
          });
        // .style("font-size", "1em");
      }

      // ====================== END QR ==========================

      // ===================== START Adverse Event =======================

      // append the svg object to the body of the page
      var svg3 = d3
        .select("#ae_div")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr(
          "transform",
          "translate(" + (margin.left + 120) + "," + margin.top + ")"
        );

      var url =
        "https://raw.githubusercontent.com/spjoshi/hekd3/master/LineChart%201/protocol_deviation_rate2.csv";
      //Read the data
      d3.csv(url).then(function (data3) {
          data3.forEach(function (d) {
            d.Week = +d.Week;
            d["BI201301"] = +d["BI201301"] * 1.5;
            d["BIO423"] = +d["BIO423"] * 2;
            d["BI122"] = +d["BI122"] * .5;
            console.log(data2);
          });
          // List of groups (here I have one group per column)
          var allGroup = ["BI201301", "BIO423", "BI122"];

          var myColor = d3
            .scaleOrdinal()
            .domain(allGroup)
            .range(d3.schemeSet2);

          // Add X axis --> it is a date format
          var x3 = d3
            .scaleLinear()
            .domain([0, 10])
            .range([0, width]);
          svg3
            .append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "x3 axis")
            .call(d3.axisBottom(x3));

          // Add Y axis
          var y3 = d3
            .scaleLinear()
            .domain([
              0,
              d3.max(data2, function (d) {
                return d.BI201301;
              })
            ])
            .range([height, 0]);
          svg3
            .append("g")
            .attr("class", "y3 axis")
            .call(d3.axisLeft(y3));

          // Initialize line
          var line = svg3
            .append("g")
            .append("path")
            .datum(data2)
            .attr(
              "d",
              d3
              .line()
              .x(function (d) {
                // console.log(d)
                // console.log(x(d.Week))
                return x3(d.Week);
              })
              .y(function (d, i) {
                return y3(d.BI201301);
              })
            )
            .attr("stroke", function (d) {
              return myColor("BI201301");
            })
            .style("stroke-width", 4)
            .style("fill", "none");

          yLabel = svg3.append("svg:g")
            .append("text")
            .attr("y", height + margin.bottom / 2)
            .attr("x", width / 2)
            .attr("dy", ".05em")
            .style("text-anchor", "middle")
            .text("Adverse Event");

          // A function that update the chart
          function updateAE(selectedGroup) {
            // Create new data with the selection?
            var dataFilter3 = data2.map(function (d) {
              return {
                Week: d.Week,
                value: d[selectedGroup] * .8
              };
            });

            // Add Y axis
            var y3 = d3
              .scaleLinear()
              .range([height, 0])
              .domain([
                d3.min(dataFilter3, function (d) {
                  return d.value / 2;
                }),
                d3.max(dataFilter3, function (d) {
                  return d.value;
                })
              ])
              .nice();

            svg3
              .selectAll(".y3")
              .transition()
              .duration(500)
              .call(d3.axisLeft(y3));
            // Give these new data to update line
            line
              .datum(dataFilter3)
              .transition()
              .duration(1000)
              .attr(
                "d",
                d3
                .line()
                .x(function (d) {
                  return x3(d.Week);
                })
                .y(function (d, i) {
                  return y3(d.value) * .6;
                })
              )
              .attr("stroke", function (d) {
                return myColor(selectedGroup);
              });
          }

          // ====================== END Adverse Event ==========================

          // ====================== Start Pre-Study_Gauge ==========================

          let Dial = function (configuration) {
            let that = {}

            let config = {
              size: 100,
              arcInset: 100,
              arcWidth: 60,

              // pointerWidth: 8,
              // pointerOffset: 0,
              // pointerHeadLengthPercent: 0.9,

              minValue: 0,
              maxValue: 100,

              minAngle: -180,
              maxAngle: 180,

              transitionMs: 750,

              currentLabelFontSize: 25,
              currentLabelInset: 10,
              labelFont: "arial",
              labelFontSize: 16,
              labelText: "",

              arcColorFn: function (value) {
                let ticks = [{
                  tick: 0,
                  color: 'red'
                }, {
                  tick: 25,
                  color: 'orange'
                }, {
                  tick: 50,
                  color: 'yellow'
                }, {
                  tick: 75,
                  color: 'green'
                }]
                let ret;
                ticks.forEach(function (tick) {

                  if (value > tick.tick) {
                    ret = tick.color
                    return
                  }
                });
                return ret;
              }
            }

            function configure(configuration) {
              for (let prop in configuration) {
                config[prop] = configuration[prop]
              }
            }
            configure(configuration);

            let foreground, arc, svg, current;
            let cur_color;
            let new_color, hold;

            var oR = config.size - config.arcInset;
            var iR = config.size - oR - config.arcWidth;

            function deg2rad(deg) {
              return deg * Math.PI / 180
            }

            function render(value) {
              // Label Text
              labelText = config.labelText
              // Arc Defaults
              arc = d3.arc()
                .innerRadius(iR)
                .outerRadius(oR)
                .startAngle(deg2rad(-90))

              // Place svg element
              svg = d3.select("#pre_study_gauge").append("svg")
                .attr("width", config.size + 20)
                .attr("height", config.size)
                .append("g")
                .attr("transform", "translate(" + config.size / 2 + "," + config.size / 2 + ")")


              // Append background arc to svg
              var background = svg.append("path")
                .datum({
                  endAngle: deg2rad(90)
                })
                .attr("class", "gaugeBackground")
                .attr("d", arc)

              // Append foreground arc to svg
              foreground = svg.append("path")
                .datum({
                  endAngle: deg2rad(-90)
                })
                .attr("d", arc);

              // Display Max value
              var max = svg.append("text")
                .attr("transform", "translate(" + (iR + ((oR - iR) / 2)) + ",15)") // Set between inner and outer Radius
                .attr("text-anchor", "middle")
                .style("font-family", config.labelFont)
                .style("font-size", config.labelFontSize)
                .text(config.maxValue + "%")

              // Display Min value
              var min = svg.append("text")
                .attr("transform", "translate(" + -(iR + ((oR - iR) / 2)) + ",15)") // Set between inner and outer Radius
                .attr("text-anchor", "middle")
                .style("font-size", config.labelFontSize)
                .style("font-family", config.labelFont)
                .text(config.minValue + "%")

              // Display Label
              var min = svg.append("text")
                .attr("transform", "translate(0,35)")
                .attr("text-anchor", "middle")
                .style("font-size", config.labelFontSize)
                .style("font-family", config.labelFont)
                .text(labelText)

              // Display Current value
              current = svg.append("text")
                .attr("transform", "translate(0," + -(-config.currentLabelInset + iR / 4) + ")") // Push up from center 1/4 of innerRadius
                .attr("text-anchor", "middle")
                .style("font-size", config.currentLabelFontSize)
                .style("font-family", config.labelFont)
                .text(current)
            }

            // document.write("<br>");

            function update(value) {
              // Get new color
              new_color = config.arcColorFn(value)
              console.log(new_color)

              var numPi = deg2rad(Math.floor(value * 180 / config.maxValue - 90));

              // Display Current value
              current.transition()
                .text(value + "%")

              // Arc Transition
              foreground.transition()
                .duration(config.transitionMs)
                .styleTween("fill", function () {
                  return d3.interpolate(new_color, cur_color);
                })
                .call(arcTween, numPi);

              // Set colors for next transition
              hold = cur_color;
              cur_color = new_color;
              new_color = hold;
            }

            // Update animation
            function arcTween(transition, newAngle) {
              transition.attrTween("d", function (d) {
                var interpolate = d3.interpolate(d.endAngle, newAngle);
                return function (t) {
                  d.endAngle = interpolate(t);
                  return arc(d);
                };
              });
            }

            render();
            that.update = update;
            that.configuration = config;
            return that;
          }
          var gaugeSize = 180;

          let contract = new Dial({
            size: gaugeSize,
            labelText: "Contract Status"
          });

          let commitment = new Dial({
            size: gaugeSize,
            labelText: "Average Commitment"
          });
          let cda = new Dial({
            size: gaugeSize,
            labelText: "CDA Ready"
          });
          let budget = new Dial({
            size: gaugeSize,
            labelText: "Budget Done"
          });

          // Create data
          var dataGauge = {
            BI201301: {
              // Status: { Yes: 10, No: 20 },
              contract: 80,
              commitment: 20,
              cda: 10,
              budget: 30
            },
            BIO423: {
              contract: 70,
              commitment: 40,
              cda: 90,
              budget: 50
            },
            BI122: {
              contract: 20,
              commitment: 60,
              cda: 40,
              budget: 20
            }
          };
          contract.update(dataGauge.BI201301["contract"]);
          commitment.update(dataGauge.BI201301["commitment"]);
          cda.update(dataGauge.BI201301["cda"]);
          budget.update(dataGauge.BI201301["budget"]);

          function updateGauge(selectedGroup) {
            contract.update(dataGauge[selectedGroup].contract);
            commitment.update(dataGauge[selectedGroup].commitment);
            cda.update(dataGauge[selectedGroup].cda);
            budget.update(dataGauge[selectedGroup].budget);
          }

          // ====================== End Pre-Study_Gauge ==========================


          // ====================== Start Subject Enrollment Timeline ==========================

          // parse the date / time - define how we want to define the date format
          // var parseTime = d3.timeParse("%m/%d/%y");
          var parseTime = d3.timeParse("%Y-%m-%d");

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
          d3.csv("enrollment_timeline_data2.csv").then(function (enrollmentData) {

              // format the data
              enrollmentData.forEach(function (d) {
                  d.date = parseTime(d.date);
                  d.planned = +d.planned;
                  d.actual = +d.actual;
                  d.forecast = +d.forecast;
                  d.target = +d.target;
                  d.plannedLegend = +d.plannedLegend;
                  d.actualLegend = +d.actualLegend;
                  d.forecastLegend = +d.forecastLegend;
                  d.targetLegend = +d.targetLegend;
              });
            console.log("enrollmentData: ", enrollmentData)

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

            // ====== Forecast Line ==============

              var forecastLegendLine = d3.line()
                  .defined(d => !isNaN(d.forecastLegend))
                  .x(function (d) {
                      return x(d.date);
                  })
                  .y(function (d) {
                      return y(d.forecastLegend);
                  });

              var plannedLegendLine = d3.line()
                  .defined(d => !isNaN(d.plannedLegend))
                  .x(function (d) {
                      return x(d.date);
                  })
                  .y(function (d) {
                      return y(d.plannedLegend);
                  });

              var actualLegendLine = d3.line()
                  .defined(d => !isNaN(d.actualLegend))
                  .x(function (d) {
                    return x(d.date);

                  })
                  .y(function (d) {
                      return y(d.actualLegend);
                  });

              var targetLegendLine = d3.line()
                  .defined(d => !isNaN(d.targetLegend))
                  .x(function (d) {
                      return x(d.date);
                  })
                  .y(function (d) {
                      return y(d.targetLegend);
                  });

            var dataFilterEnrollment = enrollmentData.filter(function (d) {
              return d.Study == "BI201301";
            });

            console.log("data Filter Enrollment: ", dataFilterEnrollment)

              var x = d3.scaleTime()
                  .range([0, width])
                  .domain(d3.extent(dataFilterEnrollment, function (d) {
                      return d.date;
                  }));

              var y = d3.scaleLinear()
                  .range([height, 0])
                  .domain([0, d3.max(dataFilterEnrollment, function (d) {
                      return d.planned;
                  }) * 1.1]);

              // Add the actualline path.
            actualPath = svg.append("svg:path")
              .data([dataFilterEnrollment])
              .attr("class", "actualline")
              .attr("d", actualline);

              // Add the plannedline path.
              targetPath = svg.append("path")
                  .data([dataFilterEnrollment])
                  .attr("class", "targetline")
                  .attr("d", targetline);

              // Add the plannedline path.
              plannedPath = svg.append("path")
                  .data([dataFilterEnrollment])
                  .attr("class", "plannedline")
                  .attr("d", plannedline);

              forecastPath = svg.append("path")
                  .data([dataFilterEnrollment])
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
                  .attr('x', 100)
                  .attr('y', function (d, i) {
                      return 73 + 27 * i
                  });

              var legendLines = [forecastLegendLine, plannedLegendLine, actualLegendLine, targetLegendLine]
              svg.append("path")
                  .data([dataFilterEnrollment])
                  .attr("transform", "translate(15, 15)")
                  .attr("class", "forecastline")
                  .attr("d", forecastLegendLine);
              svg.append("path")
                  .data([dataFilterEnrollment])
                  .attr("transform", "translate(15, 15)")
                  .attr("class", "plannedline")
                  .attr("d", plannedLegendLine);
                  svg.append("path")
                  .data([dataFilterEnrollment])
                  .attr("transform", "translate(15, 15)")
                  .attr("class", "actualline")
                  .attr("d", actualLegendLine);
                  svg.append("path")
                  .data([dataFilterEnrollment])
                  .attr("transform", "translate(15, 15)")
                  // .attr("transform", "translate(110," + (height + 140) + ")")
                  .attr("class", "targetline")
                .attr("d", targetLegendLine);


              // Add the X Axis
              svg.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(d3.axisBottom(x)
                      .tickFormat(d3.timeFormat("%m-%y")))
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
                  .attr("class", "axis")
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

            function updateEnrollment(selectedGroup) {

                var dataFilterEnrollmentSelected = enrollmentData.filter(function (d) {
                  return d.Study == selectedGroup;
                });
 // Add the actualline path.
              // actualPath = svg.append("svg:path")
              actualPath.data([dataFilterEnrollmentSelected])
                .transition()
                .duration(500)
                .attr("class", "actualline")
                .attr("d", actualline);

              // Add the plannedline path.
              targetPath.data([dataFilterEnrollmentSelected])
                .transition()
                .duration(500)
                .attr("class", "targetline")
                .attr("d", targetline);

              // Add the plannedline path.
              plannedPath.data([dataFilterEnrollmentSelected])
                .transition()
                .duration(500)
                .attr("class", "plannedline")
                .attr("d", plannedline);

              forecastPath.data([dataFilterEnrollmentSelected])
                .transition()
                .duration(500)
                .attr("class", "forecastline")
                .attr("d", forecastline);
            }

              // ====================== End Subject Enrollment Timeline ==========================


              // ====================== Start Site Performance1 ==========================
              // append the svg object to the body of the page
              var svg_site = d3.select("#study_site_performance_div")
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
                  var allGroup2 = ["Screen Failure Rate", "Enrollment Rate", "Withdrawal Rate", "Protocol Deviation Rate", "Adverse Event Rate"]
                  // add the options to the button
                  d3.select("#selectPerformanceButton")
                    .selectAll('myOptions2')
                    .data(allGroup2)
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

                  svg_site.append("g")
                    .attr("transform", "translate(0," + (height) + ")")
                    .call(d3.axisBottom(x).ticks().tickSize(-innerHeight))
                    .attr("class", "axis axis-grid")
                    .selectAll("text")
                    .attr("transform", "translate(0, -10) rotate(-90)")
                    .style("text-anchor", "start")
                    .style("color", "gray");

                  // Add Y axis
                  var y = d3.scaleLinear()
                    .domain([-0.1, 1])
                    .range([height, 0]);
                  svg_site.append("g")
                    .attr("transform", "translate(0," + 27 + ")")
                    .call(d3.axisLeft(y))
                    .attr("class", "axis axis-grid");

                  svg_site.append("line") // attach a line
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
                    .attr("transform", "translate(0," + 27 + ")")
                    .attr("x2", width)
                    .attr("y2", function (d) {
                      // console.log("=====[[[[[ " + data["Site"])
                      return y(.8)
                    }) // y1 position of the first end of the line
                    .attr("opacity", 1)

                  svg_site
                    .selectAll("circle")
                    .exit()
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("transform",
                      "translate(" + (margin.left - 28) + ", " + (-100) + ")")
                    .attr("cx", function (d, i) {
                      return x(d.Site);
                    })
                    .attr("cy", function (d) {
                      // return y(d["Enrollment Rate"]);
                      return y(-0.5);
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
                      "translate(" + (margin.left - 28) + ", " + 27 + ")")
                    // .attr("transform", "translate(10," + (height - 60) + ")")
                    .style("fill", function (d) {
                      if (d["Query Resolution"] == "Open") {
                        return "#27ae60"
                      } else {
                        return "#9b59b6"
                      }
                    })
                    .style("opacity", 1)

                  svg_site
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
                    .style("opacity", 0);
                  // A function that update the chart
                  function updatePerformance1(selectedGroup) {
                    // selected Group is the name of the column (StudyName/Performance Category )

                    // Create new data with the selection?
                    var dataFilter = data.map(function (d) {
                      return {
                        Site: d.Site,
                        value: +d[selectedGroup],
                      }
                    })

                    // Give these new data to update scatter plot
                    svg_site
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

                    svg_site
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
                  d3.select("#selectPerformanceButton").on("change", function (d) {
                    // recover the option that has been chosen
                    var selectedOption = d3.select(this).property("value")
                    console.log(selectedOption)
                    // run the updateChart function with this selected option
                    updatePerformance1(selectedOption)
                  })

                  // ========================END Site Performance - 1 ===========================

                  // ====================== Site Performance - 2 ==============================
                  // append the svg object to the body of the page
                  var site_svg = d3.select("#study_site_performance_div2")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                      "translate(" + (margin.left + 20) + "," + margin.top + ")");

                  var url = "https://raw.githubusercontent.com/spjoshi/hekd3/master/data4.csv"
                  //Read the data
                  d3.csv(url).then(function (siteData) {
                      data.forEach(function (d) {
                        d["Screen_Failure_Rate"] = +d["Screen_Failure_Rate"];
                        d["Enrollment_Rate"] = +d["Enrollment_Rate"];
                        d["Withdrawal_Rate"] = +d["Withdrawal_Rate"];
                        d["PD_Rate"] = +d["Protocol_Deviation_Rate"];
                        d["AE_Rate"] = +d["Adverse_Event_Rate"];
                      })
                      // List of groups (here I have one group per column)
                      // siteData.forEach(function(d) { return console.log (d)})
                      var allGroup3 = ["Screen Failure Rate", "Enrollment Rate", "Withdrawal Rate", "Protocol Deviation Rate", "Adverse Event Rate"]
                      // add the options to the button
                    function studyDropDownValue() {
                      d3.select("#selectPerformanceButton2")
                        .selectAll('myOptions2')
                        .data(allGroup3)
                        // .exit()
                        .enter()
                        .append('option')
                        .text(function (d) {
                          return d;
                        }) // text showed in the menu
                        .attr("class", "button")
                        .attr("value", function (d) {
                          return d;
                        }) // corresponding value returned by the button
                    }
                    studyDropDownValue()

                      // A color scale: one color for each group
                      var myColor = d3.scaleOrdinal()
                        .domain(allGroup)
                        .range(d3.schemeSet2);

                      // Add X axis --> Ordinal Scale
                      var x3 = d3
                        .scaleBand()
                        .rangeRound([0, width])
                        .domain(
                          siteData.map(function (d) {
                            return d.Site;
                          })
                        )
                        .padding(0.2);
                      site_svg
                        .append("g")
                        .attr("transform", "translate(0," + (height) + ")")
                        .call(d3.axisBottom(x3).ticks().tickSize(-innerHeight))
                        .attr("class", "axis axis-grid")
                        .selectAll("text")
                        .attr("transform", "translate(0, -10) rotate(-90)")
                        .style("text-anchor", "start")
                        .style("color", "gray");

                      // Add Y axis
                      var y3 = d3.scaleLinear()
                        .domain([-0.1, 1])
                        .range([height, 0]);
                      site_svg.append("g")
                        .attr("transform", "translate(0," + 27 + ")")
                        .call(d3.axisLeft(y3))
                        .attr("class", "axis axis-grid");

                      site_svg.append("line") // attach a line
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
                          return y(.5)
                        }) // y1 position of the first end of the line
                        .attr("transform", "translate(0," + 27 + ")")
                        .attr("x2", width)
                        .attr("y2", function (d) {
                          return y(.5)
                        }) // y1 position of the first end of the line
                        .attr("opacity", 1)

                      var dataFilterSiteStudyPerformance2 = siteData.filter(function (d) {
                        return d.Study == "BI201301";
                      });
                      console.log(" *************************** : ", dataFilterSiteStudyPerformance2)

                      site_svg
                        .selectAll("dot")
                        .exit()
                        .data(dataFilterSiteStudyPerformance2)
                        .enter()
                        .append("circle")
                        .attr("cx", function (d, i) {
                          return x3(d.Site) + 18;
                        })
                        .attr("cy", function (d) {
                          return y3(0);
                        })
                        .transition()
                        .duration(2000)
                        .attr("cy", function (d, i) {
                          return y3(d["Screen Failure Rate"]);
                        })
                        .attr("r", 10)
                        .attr("transform", "translate(" + (margin.left - 28) + ", " + 27 + ")")
                        .style("fill", function (d) {
                          if (d["Screen Failure Rate"] > 0.5) {
                            return "#ff5e57"
                          } else {
                            return "#2ecc71"
                          }
                        })
                        .style("opacity", 1)

                      site_svg
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
                        .style("opacity", 0);

                        var currentStudy1 = document.getElementById("title_text").innerHTML
                    function df () {
                      return console.log("inside Update1 ========= : " + currentStudy1);
                    }
                    df()

                        // =================A function that update the chart=================================
                      function updatePerformance2(selectedPerformance2) {

                        var currentStudy2 = document.getElementById("title_text").innerHTML

                        console.log("inside Update2 ========= : " + currentStudy2)
                        // Create new data with the selection

                        var dataFilterStudyPerformance2 = siteData.filter(function (d) {
                          return d.Study === currentStudy2;
                        });

                        // console.log("dataFilterStudyPerformance2: " + Object.values(dataFilterStudyPerformance2.value))
                        console.log("********** dataFilterStudyPerformance2: ***************", dataFilterStudyPerformance2)

                        var dataFilterSitePerformance2 = dataFilterStudyPerformance2.map(function (d) {
                          return {
                            Site: d.Site,
                            value: +d[selectedPerformance2]
                          }
                        })
                        console.log("dataFilterSitePerformance2: ", dataFilterSitePerformance2)
                        console.log("===dataFilterSitePerformance2====" + Object.keys(dataFilterSitePerformance2))
                        // console.log(dataFilterSitePerformance2)
                        // Give these new data to update scatter plot
                        site_svg
                          .selectAll("circle")
                          .datum(dataFilterSitePerformance2)
                          .transition()
                          .duration(1000)
                          .attr("cx", function (d, i) {
                              console.log("cx" + d[i].value)
                              return x3(d[i].Site) + 18;
                          })
                      .attr("cy", function (d, i) {
                        console.log("cy" + d[i].value)
                        return y3(+d[i].value);
                      })


                      site_svg
                        .selectAll("circle")
                        .on("mouseover", function (d, i) {
                          tooltip.style("opacity", 1);
                          tooltip.html("<span style = 'font-size: 12pt'>" + d[i].Site + "</span>" + "</br>" + selectedPerformance2 + ": " + d[i].value)
                            .style("left", d3.event.pageX + "px")
                            .style("top", (d3.event.pageY - 38) + "px")
                            .style("fill", "blue")
                        })
                        .on("mouseout", function (d) {
                          tooltip.style("opacity", 0);
                        })
                      }


                    var selectedPerformanceOption2;
                    var currentPerformance;
                    // When the button is changed, run the updateChart function
                    d3.select("#selectPerformanceButton2").on("change", function (d) {
                      // recover the option that has been chosen
                      var selectedPerformanceOption2 = d3.select(this).property("value")
                      console.log("HERE: " + selectedPerformanceOption2)
                      // run the updateChart function with this selected option
                      updatePerformance2(selectedPerformanceOption2);
                      return selectedPerformanceOption2;
                    })
                    function df() {
                      currentPerformance = document.getElementById("selectPerformanceButton2").value;
                      console.log(currentPerformance);
                      return currentPerformance;
                    }

                    function updateChangeStudyNamePerformance(selectedGroup) {
                      var dataFilterStudyPerformance3 = siteData.filter(function (d) {
                        return d.Study === selectedGroup;
                      });
                      df()
                      console.log("********** dataFilterStudyPerformance3: ***************", dataFilterStudyPerformance3)

                      site_svg
                        .selectAll("circle")
                        .datum(dataFilterStudyPerformance3)
                        .transition()
                        .duration(1000)
                        .attr("cx", function (d, i) {
                          // console.log("cx" + d[i].value)
                          return x3(d[i].Site) + 18;
                        })
                        .attr("cy", function (d, i) {
                          return y3(d[i][currentPerformance])
                        })

                      site_svg
                        .selectAll("circle")
                        .on("mouseover", function (d, i) {
                          tooltip.style("opacity", .8);
                          tooltip.html("<span style = 'font-size: 12pt'>" + d[i].Site + "</span>" + "</br>" + selectedPerformance2 + ": " + d[i].value)
                            .style("left", d3.event.pageX + "px")
                            .style("top", (d3.event.pageY - 38) + "px")
                            .style("fill", "blue")
                        })
                        .on("mouseout", function (d) {
                          tooltip.style("opacity", 0);
                        })
                    }

                    // ====================== Site performance 2 END ==============================


                    // ====================== UPDATE ==============================

                    // When the button is changed, run the updateChart function
                    d3.select("#selectStudyButton").on("change", function (d) {
                      // recover the option that has been chosen
                      var selectedStudy = d3.select(this).property("value");
                      // var selectedPerformanceOption2 = document.getElementById("selectPerformanceButton2").property("value")
                      d3.select("#studyName").value = selectedStudy;
                      document.getElementById("title_text").innerHTML = selectedStudy;
                      // document.getElementById("title_text").innerHTML = "Study: " + selectedOption;
                      document.getElementById("study_description_text").innerHTML = "A Phase 3, Dose-Escalation Study to Evaluate theSafety, Tolerability, and Efficacy of BMN 110 in Subjects with Mucopolysaccharidosis IVA(Morquio Syndrome)";
                      document.getElementById("phase_text").innerHTML = "";
                      // run the updateChart function with this selected option
                      updateBar(selectedStudy);
                      updatePD(selectedStudy);
                      updateQR(selectedStudy);
                      updateAE(selectedStudy);
                      updateGauge(selectedStudy);
                      updateChangeStudyNamePerformance(selectedStudy);
                      updateEnrollment(selectedStudy);
                      // updatePerformance2(selectedPerformanceOption2)
                    });

                    // ===================== END UPDATE ============================
                  });
              });
          });
      });
  });
});