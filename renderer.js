function Renderer(canvas, size, waterLevel) {
  this.canvas = canvas;
  this.ctx    = canvas.getContext('2d');
  this.size   = size;

  this.waterLevel = waterLevel || 75;

  this.canvas.height = size;
  this.canvas.width  = size;
}

Renderer.prototype.render = function(heightmap) {
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      var v   = heightmap[y * this.size + x],
          rgb = [0,0,0];

      if (v < this.waterLevel) {
        var b = Math.min(v+50, 255);
        rgb = [0,0,b];
      } else {
        var r = b = v/2;
        rgb = [r,v,b];
      }

      this.ctx.fillStyle = 'rgb(' + rgb.join() + ')';
      this.ctx.fillRect(x, y, 1, 1);
    }
  }
}
