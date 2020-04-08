// set the dimensions and margins of the graph

var margin = {
        top: 10,
        right: 30,
        bottom: 30,
        left: 60
    },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

// append the SVG object to the body of the page
var SVG = d3.select("#main_svg")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
//Read the data
var url = "https://raw.githubusercontent.com/spjoshi/hekd3/master/site_performance_data.csv"
d3.csv(url, function (data) {
    // List of groups (here I have one group per column)
    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);
    var xAxis = SVG.append("g")
        .attr("transform", "translate(0," + (height - 15) + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 1])
        .range([height - 15, 0]);
    var yAxis = SVG.append("g")
        .call(d3.axisLeft(y));

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = SVG.append("defs").append("SVG:clipPath")
        .attr("id", "clip")
        .append("SVG:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

    // Create the scatter variable: where both the circles and the brush take place
    var scatter = SVG.append('g')
        .attr("clip-path", "url(#clip)")

    // Add circles
    scatter
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        // .on("mouseover", function (d) {
        //     scatter.attr("r", 2)
        // })
        .attr("cx", function (d) {
            return x(d["Enrollment Rate"]);
        })
        .attr("cy", function (d) {
            return y(d["Withdrawal Rate"]);
        })
        .attr("r", 20)
        .style("fill", function (d) {
            if (d["Query Resolution"] == "Open") {
                return "#FF5533"
            } else {
                return "#0105e0"
            }
        })
        .style("opacity", 0.5)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)

    console.log('here');
    scatter
        .selectAll("circle")
        .on("mouseover", function (d, i) {

            tooltip.style("opacity", 1);
            tooltip.html("Site: " + d.Site + "<br/>" + "Enrollment Rate: " + d["Enrollment Rate"] + "<br/>" + "Withdrawal Rate : " + d["Withdrawal Rate"])
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


    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    var zoom = d3.zoom()
        .scaleExtent([.5, 20]) // This control how much you can unzoom (x0.5) and zoom (x20)
        .extent([
            [0, 0],
            [width, height]
        ])
        .on("zoom", updateChart);

    // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
    SVG.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom);
    // now the user can zoom and it will trigger the function called updateChart

    // A function that updates the chart when the user zoom and thus new boundaries are available
    function updateChart() {

        // recover the new scale
        var newX = d3.event.transform.rescaleX(x);
        var newY = d3.event.transform.rescaleY(y);

        // update axes with these new boundaries
        xAxis.call(d3.axisBottom(newX))
        yAxis.call(d3.axisLeft(newY))

        // update circle position
        scatter
            .selectAll("circle")
            .attr('cx', function (d) {
                return newX(d["Enrollment Rate"])
            })
            .attr('cy', function (d) {
                return newY(d["Withdrawal Rate"])
            });
    };

    function handleMouseOver(d, i) { // Add interactivity

        // Use D3 to select element, change color and size
        d3.select(this).attr({
            fill: "orange",
            r: radius * 2
        });

        // Specify where to put label of text
        svg.append("text").attr({
                id: "t" + d.x + "-" + d.y + "-" + i, // Create an id for text so we can select it later for removing on mouseout
                x: function () {
                    return xScale(d.x) - 30;
                },
                y: function () {
                    return yScale(d.y) - 15;
                }
            })
            .text(function () {
                return [d.x, d.y]; // Value of the text
            });
    }

    function handleMouseOut(d, i) {
        // Use D3 to select element, change color back to normal
        d3.select(this).attr({
            fill: "black",
            r: radius
        });

        // Select text by id and then remove
        d3.select("#t" + d.x + "-" + d.y + "-" + i).remove(); // Remove text location
    }


})