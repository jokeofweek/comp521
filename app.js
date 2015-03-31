// http://mrl.nyu.edu/~perlin/noise/
// 

var fade = function(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
};
var lerp = function(t, a, b) {
  return a + t * (b - a);
};
var grad = function(hash, x, y ,z) {
  // Use the lower 4 bits of the hash code to make
  // a gradient direction.
  var h = hash & 15;

  // ...
};