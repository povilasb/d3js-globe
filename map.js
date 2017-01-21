var width = window.innerWidth;
var height = window.innerHeight;

var projection = d3.geo
  .mercator()
  .scale(150)
  .translate([width / 2, height / 2]);

var path = d3.geo
  .path()
  .pointRadius(2)
  .projection(projection);

var svg = d3.select("#world-map")
  .attr("width", width)
  .attr("height", height);

var g = svg.append("g");

d3.json("countries2.topo.json", function(error, topology) {
  g.selectAll("path")
    .data(topojson.object(topology, topology.objects.countries)
      .geometries)
      .enter()
      .append("path")
      .attr("d", path)
});
