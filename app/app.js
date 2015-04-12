// Draw the noise values
var octaves = 7;
var size = 500;

// Seed the RNG
var seed = Math.round(1000 * Math.random());
noise.seed(seed);
console.log('seed: ' + seed);

var map        = new Map(size);
var eroder     = new Eroder(10, 2);
var renderers = [
  new Renderer3(document.getElementById('canvas3d'), size),
  new Renderer2(document.getElementById('canvas2d'), size),
  new ResourceRenderer(document.getElementById('canvasres'), size),
  new WaterDistanceRenderer(document.getElementById('canvaswd'), size),
  new ViabilityRenderer(document.getElementById('canvasviab'), size),
];

// Generate map
map.generate(octaves);
eroder.erode(map);

// Render
for (var i = 0; i < renderers.length; i++) {
  renderers[i].render(map);
}