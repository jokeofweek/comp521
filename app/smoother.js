/*
 * Based on approch described in
 * http://www.float4x4.net/index.php/2010/06/generating-realistic-and-playable-terrain-height-maps/
 */
function Smoother() {
};

Smoother.prototype.smooth = function(map) {
  // For each point, average the points height with all of its negihbors.
  for (var x = 1; x < size - 1; x++) {
    for (var y = 1; y < size - 1; y++) {
      var delta  = [-1, 0, 1],
          values = [],
          total  = 0;

      for (var i = 0; i < delta.length; i++) {
        for (var j = 0; j < delta.length; j++) {
          var value = map.get(x+i, y+j);
          total += value;
          values.push(value);
        }
      }

      var average = total / 9.0;
      map.set(x, y, average);
    }
  }
};
