// Draw the noise values
var octaves = 7;
var size = 500;

// Seed the RNG
var seed = Math.round(1000 * Math.random());
noise.seed(seed);
console.log('seed: ' + seed);

var map        = new Map(size);
var eroder     = new Eroder(10, 2);
var renderer3d = new Renderer3(document.getElementById('canvas3d'), size);
var renderer2d = new Renderer2(document.getElementById('canvas2d'), size);
var resourceRenderer = new ResourceRenderer(document.getElementById('canvasres'), size);
var waterDistRenderer = new WaterDistanceRenderer(document.getElementById('canvaswd'), size);

// Generate map
map.generate(octaves);
eroder.erode(map);

// Render
renderer3d.render(map);
renderer2d.render(map);
resourceRenderer.render(map);
waterDistRenderer.render(map);