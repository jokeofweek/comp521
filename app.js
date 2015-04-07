// Draw the noise values
var octaves = 7;
var size = 500;

// Seed the RNG
noise.seed(Math.random());

var renderer = new Renderer(document.getElementById('canvas'), size);

var maxDistance = 0.8 * Math.sqrt(size*size/2);
var heightmap = new Uint8ClampedArray(size*size);

for (var x = 0; x < size; x++) {
  for (var y = 0; y < size; y++) {

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
    })(x/size, y/size, octaves);

    // // Ensure an island/circular shape.
    var xDist = x - size/2;
    var yDist = y - size/2;
    var dist = Math.sqrt(xDist * xDist + yDist * yDist);
    
    value *= Math.max(0, 1 - Math.pow(dist / maxDistance, 2));

    heightmap[y * size + x] = 255 * value;
  }
}

var eroder = new Eroder(5, 5);
eroder.erode(heightmap);

renderer.render(heightmap);
