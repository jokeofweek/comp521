// Global settings
var size = 500;

// Draw the noise values
var octaves = 7;

// Seed the RNG
var seed = Math.round(1000 * Math.random());
seed = 507;
noise.seed(seed);
console.log('seed: ' + seed);

var map        = new Map(size);
var eroder     = new Eroder(10, 2);
var evaluator  = new Evaluator(6, 120);
var renderers = [
  new Renderer3(document.getElementById('canvas3d'), size),
  new Renderer2(document.getElementById('canvas2d'), size),
  new ResourceRenderer(document.getElementById('canvasres'), size),
  new WaterDistanceRenderer(document.getElementById('canvaswd'), size),
  new ViabilityRenderer(document.getElementById('canvasviab'), size, evaluator),
];

// Generate map
map.generate(octaves);
eroder.erode(map);

// Render
for (var i = 0; i < renderers.length; i++) {
  renderers[i].render(map);
}
