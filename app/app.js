// Global variables
var size, octaves, seed, players, eroderIter, eroderThresh, chunks, chunkDistCost, distThresh, waterDistWeight;

function regen() {
  size = getValue('opt-size');
  octaves = getValue('opt-octaves');
  seed = getValue('opt-seed');
  players = getValue('opt-players');
  eroderIter = getValue('opt-erosion-iter');
  eroderThresh = getValue('opt-erosion-thresh');
  chunks = getValue('opt-chunks');
  chunkDistCost = getValue('opt-chunk-dist-cost');
  distThresh = getValue('opt-dist-threshold');
  waterDistWeight = getValue('opt-water-weight');
  samples = getValue('opt-samples');

  // Generate a seed if none was specified.
  if (isNaN(seed)) {
    seed = Math.round(1000 * Math.random());
    console.log('seed: ' +  seed);
  } 

  noise.seed(seed);

  var map        = new Map(size, chunks, chunkDistCost);
  var eroder     = new Eroder(eroderIter, eroderThresh);
  var evaluator  = new Evaluator(players, distThresh, waterDistWeight, samples);
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

  map.setPlayerPositions(evaluator.getPlayerPositions(map));

  if (map.getPlayerPositions().length == 0) {
    alert('Cannot place players fairly given configuration.');
  } else {
    var scores = map.getPlayerPositions().map(function(p) {
      return evaluator.getViability(map, p[0], p[1]);
    });
    alert('Players placed with fairness score ' + evaluator.getFairnessScore() + '. Scores: ' + scores);
  }

  // Render
  for (var i = 0; i < renderers.length; i++) {
    renderers[i].render(map);
  }

  // Place players on the 3d map
  renderers[0].placePlayers(map);
}

function getValue(field) {
  return parseFloat(document.getElementById(field).value);
}
