/*
 * Based on approch described in
 * http://www.float4x4.net/index.php/2010/06/generating-realistic-and-playable-terrain-height-maps/
 */
function Smoother() {
};

Smoother.prototype.smooth = function(map) {
  // Fro each point, average the points height with all of its negihbors.
  for (var x = 1; x < size - 1; x++) {
    for (var y = 1; y < size - 1; y++) {
      var total = 0;
      var iters = 0;
      for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
          total += map.get(x + i + (y + j) * size);
          iters++;
        }
      }
      map.set(x + y * size, total / 9);
      // console.log(map.get(x + y * size)); 
      console.log(iters);
    }
  }
};