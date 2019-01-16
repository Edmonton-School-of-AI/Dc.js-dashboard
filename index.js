/*
    Resources links
    - keenio website -> https://keen.github.io/dashboards/
    - d3 API -> https://github.com/d3/d3/blob/master/API.md
    - crossfilter API -> https://github.com/square/crossfilter/wiki/API-Reference
    - dc examples -> http://dc-js.github.io/dc.js/examples/
    - dc API -> http://dc-js.github.io/dc.js/docs/html/
*/
const log = console.log;

const lineChart = dc.lineChart("#line-chart");
const pieChart = dc.pieChart("#pie-chart");

d3.json("Data/example.json", makeViz);

function makeViz(error, json) {

    if(error) {
        alert("Problem Loading File");
    } else {

        //transactions data
        const data = json.data;

        //to see intial loaded date
        // log(data);

        //converting timestamp to date object
        //for simplicity will not process date to correspond to data date
        data.forEach(d => {
            d.date = new Date(d.date);
        });

        //date with processed dates
        // log(data);

        //multi-dimensional filter
        let ndx = crossfilter(data);

        //dimensions
        let dateDimension = ndx.dimension(function(d) { return d.date; });
        let typeDimension = ndx.dimension(function(d) { return d.type; });

        //groups
        let dateGroup = dateDimension.group().reduceSum(function(d) { return d.total; });
        let typeGroup = typeDimension.group().reduceSum(function(d) { return d.total; });

        //Time trend
        lineChart
            .height(setHeight(lineChart))
            .useViewBoxResizing(true)
            .elasticY(true)
            .dimension(dateDimension)
            .group(dateGroup)
            .renderVerticalGridLines(true)
            .renderHorizontalGridLines(true)
            .x(d3.scaleTime().domain([d3.min(data, d => d.date), d3.max(data, d => d.date)]))
            .yAxisLabel("Total")
            .xAxisLabel("Time")
            .renderArea(true);

        //Pay types
        pieChart
            .height(setHeight(pieChart))
            .useViewBoxResizing(true)
            .dimension(typeDimension)
            .group(typeGroup);

        //Renders all charts ie line and pie charts
        dc.renderAll();

        function setHeight(chart) {
            return chart.width() * 0.6;
        };
    };
};