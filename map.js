function setupRotation(svg, projection) {
  var lastRotation = [0, 0, 0];
  var mouseDownPos = false;
  var cometHits = [];

  svg.on("mousemove", function() {
    if (mouseDownPos) {
      var p = d3.mouse(this);
      diffX = (p[0] - mouseDownPos[0]) / 4;
      diffY = (p[1] - mouseDownPos[1]) / 4;
      projection.rotate([lastRotation[0] + diffX, lastRotation[1] - diffY]);
      svg.selectAll("path").attr("d", path);

    svg.selectAll("circle")
      .attr("cx", function (d) { return projection([d.lon, d.lat])[0]; })
      .attr("cy", function (d) { return projection([d.lon, d.lat])[1]; })
      .style("opacity", function (d) {
        // TODO: make opacity 0 (marker invisible) when circle is out of
        // visible area.
        return 0.7;
      });
    }
  });

  svg.on("mousedown", function() {
    mouseDownPos = d3.mouse(this);
    lastRotation = projection.rotate()
  });


  svg.on("dblclick", function() {
    mousePos = d3.mouse(this);
    coords = projection.invert(mousePos);
    cometHits.push({'lon': coords[0], 'lat': coords[1]});

    svg.selectAll("circle")
      .data(cometHits)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return projection([d.lon, d.lat])[0]; })
      .attr("cy", function (d) { return projection([d.lon, d.lat])[1]; })
      .attr("r", 5)
      .style("fill", "blue")
      .style("opacity", 0.7);
  });

  svg.on("mouseup", function() {
    mouseDownPos = false;
  });
}

var width = window.innerWidth;
var height = window.innerHeight;

var projection = d3.geoOrthographic()
  .scale(300)
  .clipAngle(90)
  .translate([width / 2, height / 2]);

var path = d3.geoPath()
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
    .data(topojson.object(topology, topology.objects.countries).geometries)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "country")
});
