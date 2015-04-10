// Draw the noise values
var octaves = 7;
var size = 500;

// Seed the RNG
var seed = Math.round(1000 * Math.random());
noise.seed(seed);
console.log('seed: ' + seed);

var map      = new Map(size);
var eroder   = new Eroder(10, 2);
var renderer = new Renderer3(document.getElementById('canvas'), size);

map.generate(octaves);
eroder.erode(map);
renderer.render(map);
