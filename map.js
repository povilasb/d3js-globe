function setupRotation(svg, projection) {
  var spinX = d3.scale.linear()
    .domain([0, width])
    .range([-180, 180]);

  var spinY = d3.scale.linear()
    .domain([0, height])
    .range([90, -90]);

  var mouseDown = false;

  svg.on("mousemove", function() {
    if (mouseDown == true) {
      var p = d3.mouse(this);
      projection.rotate([spinX(p[0]), spinY(p[1])]);
      svg.selectAll("path").attr("d", path);
    }
  });

  svg.on("mousedown", function() {
    mouseDown = true;
  });

  svg.on("mouseup", function() {
    mouseDown = false;
  });
}

var width = window.innerWidth;
var height = window.innerHeight;

var projection = d3.geo
  .orthographic()
  .scale(300)
  .clipAngle(90)
  .translate([width / 2, height / 2]);

var path = d3.geo
  .path()
  .pointRadius(2)
  .projection(projection);

var svg = d3.select("#world-map")
  .attr("width", width)
  .attr("height", height);

svg.append("defs").append("path")
  .datum({type: "Sphere"})
  .attr("id", "sphere")
  .attr("d", path);
svg.append("use")
  .attr("class", "stroke")
  .attr("xlink:href", "#sphere");

setupRotation(svg, projection);

var g = svg.append("g");

d3.json("countries.json", function(error, topology) {
  g.selectAll()
    .data(topojson.object(topology, topology.objects.countries)
      .geometries)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "country")
});
