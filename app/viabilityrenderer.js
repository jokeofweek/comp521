function ViabilityRenderer(canvas, size, options) {
  this.canvas = canvas;
  this.ctx    = canvas.getContext('2d');
  this.size   = size / 2;

  options = options || {};

  this.canvas.height = size / 2;
  this.canvas.width  = size / 2;
}

ViabilityRenderer.prototype.render = function(map) {
  var image = this.ctx.createImageData(this.size, this.size);
  var waterLevel = map.getWaterLevel();

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      var i    = 4 * (y * this.size + x),
          height = map.get(x * 2, y * 2),
          resource = map.getResource(x * 2, y * 2),
          waterDist = map.getWaterDistance(x * 2, y * 2);

      var v;
      if (height <= waterLevel) {
        v = 0;
      } else {
        v = Math.min(255, Math.max(0, Math.round(
          255 * ((resource / 255) * (waterDist / 255)))));
        console.log(resource + ', ' + waterDist);
      }
      image.data[i]     = v;
      image.data[i + 1] = v;
      image.data[i + 2] = v;
      image.data[i + 3] = 255;
    }
  }

  this.ctx.putImageData(image, 0, 0);
}
