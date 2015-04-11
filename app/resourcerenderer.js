function ResourceRenderer(canvas, size, options) {
  this.canvas = canvas;
  this.ctx    = canvas.getContext('2d');
  this.size   = size;

  options = options || {};

  this.canvas.height = size;
  this.canvas.width  = size;
}

ResourceRenderer.prototype.render = function(map) {
  var image = this.ctx.createImageData(this.size, this.size);

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      var i    = 4 * (y * this.size + x),
          v    = map.getResource(x, y);
      image.data[i]     = v;
      image.data[i + 1] = v;
      image.data[i + 2] = v;
      image.data[i + 3] = 255;
    }
  }

  this.ctx.putImageData(image, 0, 0);
}
