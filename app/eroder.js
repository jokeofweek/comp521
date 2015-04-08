/*
 * Based on approch described in
 * Realtime Procedural Terrain Generation - Jacob Olsen
 */
function Eroder(iterations, threshold) {
  this.iterations = iterations;
  this.threshold = threshold;
};

Eroder.prototype.erode = function(map) {
  // Define the offsets for the neighbors we want to consider.
  var neighbors = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  // Repeatedly apply erosion.
  for (var i = 0; i < this.iterations; i++) {
    for (var x = 1; x < size - 1; x++) {
      for (var y = 1; y < size - 1; y++) {
        var maxDiff = 0;
        var maxNeighbor;

        var h = map.get(x, y);

        // Find the neighbor with the smallest difference
        for (var n = 0; n < neighbors.length; n++) {
          var i = x + neighbors[n][0],
              j = y + neighbors[n][1];
          var other = map.get(i, j);
          var diff = h - other;
          if (diff > maxDiff) {
            maxDiff = diff;
            maxNeighbor = n;
          }
        }

        // If we found a neighbor within a certain threshold, exchange
        // sediment to make up for the height difference.
        if (0 < maxDiff && maxDiff <= this.threshold) {
          var change = Math.round(maxDiff / 2);
          map.set(x, y, h - change);

          var i = x + neighbors[maxNeighbor][0],
              j = y + neighbors[maxNeighbor][1];
          map.set(i, j, map.get(i, j) + change);
        }
      }
    }
  }
};
