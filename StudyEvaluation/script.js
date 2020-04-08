// set the dimensions and margins of the graph
var margin = {
    top: 10,
    right: 30,
    bottom: 190,
    left: 100
  },
  width = window.innerWidth - margin.left - margin.right,
  height = window.innerHeight - margin.top - margin.bottom;

var studyPerformanceData = {
  BI201301: {
    protocolDeviationRate: 0.8,
    adverseEventRate: 0.7,
    screenFailureRate: 0.4,
    enrollmentRate: 0.9,
    withdrawalRate: 0.3
  },
  BIO423: {
    protocolDeviationRate: 0.8,
    adverseEventRate: 0.7,
    screenFailureRate: 0.4,
    enrollmentRate: 0.9,
    withdrawalRate: 0.3
  },
  BI122: {
    protocolDeviationRate: 0.8,
    adverseEventRate: 0.7,
    screenFailureRate: 0.4,
    enrollmentRate: 0.9,
    withdrawalRate: 0.3
  }
};
// append the svg object to the body of the page
var svg = d3
  .select("#chart_div")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

//Parse the Data
// d3.csv("https://raw.githubusercontent.com/spjoshi/hekd3/master/enrollmentFunnelData.csv").then(function (data) {

// data = data.filter(function (d, i) {
//   return i < 6
// })

// studyPerformanceData.forEach(function (d) {
//   d.Stage = d.Stage;
//   d["BI201301"] = +d["BI201301"];
//   d["BIO423"] = +d["BIO423"];
//   d["BI122"] = +d["BI122"];
// })
// console.log(studyPerformanceData)
// console.log(data);

var allGroup = Object.keys(studyPerformanceData);
var xAxisLabels = Object.keys(studyPerformanceData.BI122);
var performanceMetrics = [
  "Enrollment Rate",
  "Withdrawal Rate",
  "Screen Failure Rate",
  "Protocol Deviation Rate",
  "Adverse Event Rate"
];

// add the options to the button
d3.select("#selectStudyButton")
  .selectAll("myOptions")
  .data(allGroup)
  .enter()
  .append("option")
  .text(function(d) {
    // console.log(d + "  inside myOptions")
    return d;
  }) // text showed in the menu
  .attr("value", function(d) {
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
  .domain(xAxisLabels)
  .padding(0.2);

svg
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10, 0) rotate(-15)")
  .style("text-anchor", "end");

// Y axis
var y = d3
  .scaleLinear()
  .range([height, 0])
  .domain([0, Math.max(...Object.values(studyPerformanceData.BI201301))]);
svg
  .append("g")
  .attr("class", "y axis")
  .call(d3.axisLeft(y));

svg
  .selectAll()
  .data(studyPerformanceData)
  .enter()
  .append("text")
  .text(function(d, i) {
    console.log(i);

    // return d.Value;
    return i;
  })
  .attr("text-anchor", "middle")
  .attr("x", function(d, i) {
    console.log(d + "222");
    return x(performanceMetrics[i]) + x.bandwidth() / 2;
  })
  .attr("y", function(d, i) {
    return y(d.BI201301);
  })
  .attr("font-family", "sans-serif")
  .attr("font-size", "11px")
  .attr("fill", "navy");

// Bars
console.log(performanceMetrics);
var bar = svg
  .selectAll("mybar")
  .data(studyPerformanceData)
  .enter()
  .append("rect")
  .attr("x", function(d, i) {
    console.log(d);
    console.log(performanceMetrics[i]);
    return x(xAxisLabel[i]);
  })
  .attr("width", x.bandwidth())
  .attr("fill", "#69b3a2")
  // .attr("fill", function (d) {
  //   if ((d.Stage === "Withdrawn") | (d.Stage === "Failed Screen")) {
  //     return "#EC1C23";
  //     console.log("====" + height)
  //   } else {
  //     return "#69b3a2";
  //   }
  // })
  // no bar at the beginning thus:
  .attr("height", function(d) {
    return height - y(0);
    console.log("====" + height);
  })
  .attr("y", function(d) {
    return y(0);
  });

// Animation
svg
  .selectAll("rect")
  .transition()
  .duration(800)
  .attr("y", function(d, i) {
    console.log(i * 10);
    return y(d.BI201301);
  })
  .attr("height", function(d) {
    return height - y(d.BI201301);
  })
  .delay(function(d, i) {
    console.log(i * 2);
    return i * 101;
  });

// A function that update the chart
function update(selectedGroup) {
  // Create new data with the selection?
  var dataFilter = data.map(function(d) {
    return {
      Stage: d.Stage,
      Value: d[selectedGroup]
    };
  });
  console.log(dataFilter);

  var y = d3
    .scaleLinear()
    .range([height, 0])
    .domain([
      0,
      d3.max(dataFilter, function(d) {
        return d.Value;
      })
    ])
    .nice();
  svg
    .selectAll(".y")
    .transition()
    .duration(1000)
    .call(d3.axisLeft(y));

  // y = d3.scaleLinear.domain([0, d3.max(dataFilter, function (d) {
  //   return d.Value
  // })]);
  // svg.append("g").call(d3.axisLeft(y));

  // Animation
  bar
    .data(dataFilter)
    .transition()
    .duration(800)
    .attr("height", function(d) {
      return height - y(d.Value);
      console.log(d.Value);
    })
    .attr("y", function(d, i) {
      console.log(i * 10);
      return y(d.Value);
    })
    .delay(function(d, i) {
      console.log(i * 2);
      return i * 101;
    });
}

// When the button is changed, run the updateChart function
d3.select("#selectStudyButton").on("change", function(d) {
  // recover the option that has been chosen
  var selectedOption = d3.select(this).property("value");
  console.log(selectedOption);
  // run the updateChart function with this selected option
  update(selectedOption);
});

// }); // data closure
