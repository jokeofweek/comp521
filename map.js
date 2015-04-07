function Map(size) {
  this.size = size;

  this.heightmap  = new Uint8ClampedArray(size*size);

  this.range       = 0.8;
  this.maxDistance = this.range * Math.sqrt(this.size * this.size / 2);
}

Map.prototype.set = function(x, y, z) {
  this.heightmap[y * this.size + x] = z;
}

Map.prototype.get = function(x, y) {
  return this.heightmap[y * this.size + x];
}

Map.prototype.generate = function(octaves) {
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {

      // https://github.com/Hypercubed/perlin-terrain-angular-demo/blob/bd6df90b055a555194dd4aa09cbe9776de2de7f0/script.js#L38-L51
      value = (function(x,y,N) {
        var z = 0, s = 0;
        for (var i = 0; i < N; i++) {
          var pp = 1/(1 << i);
          var e = Math.PI*pp/2;
          var ss = Math.sin(e);
          var cc = Math.cos(e);
          var xx = (x*ss+y*cc);
          var yy = (-x*cc+y*ss);
          s += pp;
          z += pp*Math.abs(noise.perlin2(xx/pp,yy/pp));
        }
        return 2*z/s;
      })(x/this.size, y/this.size, octaves);

      // // Ensure an island/circular shape.
      var xDist = x - this.size/2;
      var yDist = y - this.size/2;
      var dist = Math.sqrt(xDist * xDist + yDist * yDist);

      value *= Math.max(0, 1 - Math.pow(dist / this.maxDistance, 2));

      this.heightmap[y * this.size + x] = 255 * value;
    }
  }
}
