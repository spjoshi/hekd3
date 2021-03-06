// Variable declaration
var margin = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 30
};
var height = 400 - margin.top - margin.bottom;
var width = 500 - margin.left - margin.right;

// Add svg to
var svg = d3.select('body').
append('svg').
attr('width', width + margin.left + margin.right).
attr('height', height + margin.top + margin.bottom).
append('g').
attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// X scale
var x = d3.scaleLinear().
range([0, width]);
var y = d3.scaleBand().
rangeRound([height, 0]);

var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y).
tickSize(3, 0);


d3.tsv('data.tsv', type, function (error, data) {
    x.domain(d3.extent(data, function (d) {
        return d.value;
    })).nice();
    y.domain(data.map(function (d) {
        return d.name;
    }));

    svg.selectAll('.bar').
    data(data).
    enter().append('rect').
    attr('class', function (d) {
        return "bar bar--" + (d.value < 0 ? "negative" : "positive");
    }).
    attr('x', function (d) {
        return x(Math.min(0, d.value));
    }).
    attr('y', function (d) {
        return y(d.name);
    }).
    attr('width', function (d) {
        return Math.abs(x(d.value) - x(0));
    }).
    attr('height', height / data.length - 5);

    svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis);

    var tickNegative = svg.append('g').
    attr('class', 'y axis').attr('transform', 'translate(' + x(0) + ',0)').call(yAxis).selectAll('.tick').filter(function (d, i) {
        return data[i].value < 0;
    });

    tickNegative.select('line').attr('x2', 6);

    tickNegative.select('text').attr('x', 9).style('text-anchor', 'start');
});

function type(d) {
    d.value = +d.value;
    return d;
}