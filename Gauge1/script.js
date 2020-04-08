let Dial = function (configuration) {
    let that = {}

    let config = {
        size: 100,
        arcInset: 100,
        arcWidth: 60,

        pointerWidth: 8,
        pointerOffset: 0,
        pointerHeadLengthPercent: 0.9,

        minValue: 0,
        maxValue: 100,

        minAngle: -180,
        maxAngle: 180,

        transitionMs: 750,

        currentLabelFontSize: 20,
        currentLabelInset: 20,
        labelFont: "arial",
        labelFontSize: 12,
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
            .attr("width", config.size)
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

    // document.write("<br>");
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

let contract = new Dial({
    size: 160,
    labelText: "Contract Status"
});

let commitment = new Dial({
    size: 160,
    labelText: "Average Commitment"
});
let cda = new Dial({
    size: 160,
    labelText: "CDA Ready"
});
let budget = new Dial({
    size: 160,
    labelText: "Budget Done"
});

var preStudyAssessments = {
    contract: 80,
    commitment: 60,
    cda: 40,
    budget: 20

}
contract.update(preStudyAssessments["contract"]);
commitment.update(preStudyAssessments["commitment"]);
cda.update(preStudyAssessments["cda"]);
budget.update(preStudyAssessments["budget"]);