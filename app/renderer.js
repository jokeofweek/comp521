function Renderer(canvas, size, options) {
  this.canvas = canvas;
  this.ctx    = canvas.getContext('2d');
  this.size   = size;

  options = options || {};
  this.treeLevel  = options['treeLevel'] || 100;

  this.canvas.height = size;
  this.canvas.width  = size;
}

Renderer.prototype.render = function(map) {
  var image = this.ctx.createImageData(this.size, this.size);

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      var i    = 4 * (y * this.size + x),
          z    = map.get(x, y),
          rgb  = [0,0,0];

      if (z < map.getWaterLevel()) {
        rgb[2] = z + 180;
      } else {
        if (z > this.treeLevel && noise.simplex2(x, y) > 0.95) {
          rgb[0] = 80;
          rgb[1] = 40;
          rgb[2] = 10;
        } else {
          rgb[0] = z/2;
          rgb[1] = z;
          rgb[2] = z/2;
        }
      }

      image.data[i]     = rgb[0];
      image.data[i + 1] = rgb[1];
      image.data[i + 2] = rgb[2];
      image.data[i + 3] = 255;
    }
  }

  this.ctx.putImageData(image, 0, 0);
}
