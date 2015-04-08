function Renderer(canvas, size, waterLevel) {
  this.canvas = canvas;
  this.ctx    = canvas.getContext('2d');
  this.size   = size;

  this.waterLevel = waterLevel || 75;

  this.canvas.height = size;
  this.canvas.width  = size;
}

Renderer.prototype.render = function(map) {
  var image = this.ctx.createImageData(this.size, this.size);

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      var i    = 4 * (y * this.size + x),
          v    = map.get(x, y),
          rgb  = [0,0,0];

      if (v < this.waterLevel) {
        rgb[2] = v + 180;
      } else {
        rgb[0] = v/2;
        rgb[1] = v;
        rgb[2] = v/2;
      }

      image.data[i]     = rgb[0];
      image.data[i + 1] = rgb[1];
      image.data[i + 2] = rgb[2];
      image.data[i + 3] = 255;
    }
  }

  this.ctx.putImageData(image, 0, 0);
}
