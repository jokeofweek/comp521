function ViabilityRenderer(canvas, size, evaluator, options) {
  this.canvas = canvas;
  this.ctx    = canvas.getContext('2d');
  this.size   = size / 2;
  this.evaluator = evaluator;

  options = options || {};

  this.canvas.height = size / 2;
  this.canvas.width  = size / 2;
}

ViabilityRenderer.prototype.render = function(map) {
  var image = this.ctx.createImageData(this.size, this.size);

  // Calculate all the player positions. We'll draw a circle 
  // of a given radius around these on the map.
  var positions = this.evaluator.getPlayerPositions(map);
  console.log(positions);

  var distThreshold = Math.pow(10, 2);

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      var i = 4 * (y * this.size + x);
      var found = false;

      for (var p = 0; p < positions.length; p++) {
        if (distThreshold > (Math.pow((x * 2) - positions[p][0], 2) + Math.pow((y * 2) - positions[p][1], 2))) {
          found = true;
          image.data[i]     = 255;
          image.data[i + 1] = 0;
          image.data[i + 2] = 0;
          image.data[i + 3] = 255;
          break;
        }
      }

      if (!found) {
        var v = evaluator.getViability(map, x * 2, y * 2);
        image.data[i]     = v;
        image.data[i + 1] = v;
        image.data[i + 2] = v;
        image.data[i + 3] = 255;
      }
    }
  }

  this.ctx.putImageData(image, 0, 0);
}
