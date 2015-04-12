function Map(size) {
  this.size = size;

  this.heightMap  = new Uint8ClampedArray(size*size);
  this.resourceMap = new Uint8ClampedArray(size * size);
  this.waterDistanceMap = new Uint8ClampedArray(size * size);

  this.range       = 0.8;
  this.maxDistance = this.range * Math.sqrt(this.size * this.size / 2);

  this.waterLevelThreshold = 0.3;
  this.waterLevel = null;
}

Map.prototype.set = function(x, y, z) {
  this.heightMap[y * this.size + x] = z;
}

Map.prototype.get = function(x, y) {
  if (y === undefined) {
    return this.heightMap[x];
  } else {
    return this.heightMap[y * this.size + x];
  }
}

Map.prototype.getResource = function(x, y) {
  if (y === undefined) {
    return this.resourceMap[x];
  } else {
    return this.resourceMap[y * this.size + x];
  }
}

Map.prototype.getWaterDistance = function(x, y) {
  if (y === undefined) {
    return this.waterDistanceMap[x];
  } else {
    return this.waterDistanceMap[y * this.size + x];
  }
};

Map.prototype.generate = function(octaves) {
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      value = noiseWithOctaves(x/this.size, y/this.size, octaves);
      value = keepInCircle(value, this.size, this.maxDistance, x, y);

      this.heightMap[y * this.size + x] = 200 * value;
    }
  }

  // Determine the water level
  var low = 255, high = 0;
  for (var i = 0; i < this.heightMap.length; i++) {
    low = Math.min(low, this.heightMap[i]);
    high = Math.max(high, this.heightMap[i]);
  }
  this.waterLevel = low + Math.round((high - low) * this.waterLevelThreshold);

  // Create the resource map
  noise.seed(seed * 2);
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      value = noiseWithOctaves(x/this.size, y/this.size, octaves);

      this.resourceMap[y * this.size + x] = 255 * value;
    }
  }

  noise.seed(seed);

  this.setupWaterDistanceMap();
}


Map.prototype.setupWaterDistanceMap = function() {
  var chunksAcross = 100;
  var chunkSize = size / chunksAcross;

  var chunkMap = new Uint8ClampedArray(chunksAcross * chunksAcross);

  // Separate the map into more coarse-grained chunks in order to
  // speed up determining how close a cell is to water.
  for (var cX = 0; cX < chunksAcross; cX++) {
    for (var cY = 0; cY < chunksAcross; cY++) {
      var hasWater = false;
      var xOffset = cX * chunkSize;
      var yOffset = cY * chunkSize * size;
      // We consider a chunk to having water if they have at least
      // chunkSize water pixels.
      var pixels = 0;
      for (var x = 0; x < chunkSize && !hasWater; x++) {
        for (var y = 0; y < chunkSize; y++) {
          if (this.heightMap[xOffset + yOffset + x + y * size] <= this.waterLevel) {
            pixels++;
            if (pixels > chunkSize) {
              hasWater = true;
              break;
            }
          }
        }
      }

      chunkMap[cX + cY * chunksAcross] = hasWater ? 0 : 1;
    }
  }

  // Perform a BFS on the chunks to figure out the distance for each chunk.
  var offsets = [-1, 1, -chunksAcross, chunksAcross, -chunksAcross - 1, -chunksAcross + 1, chunksAcross + 1, chunksAcross - 1];

  for (var cX = 0; cX < chunksAcross; cX++) {
    for (var cY = 0; cY < chunksAcross; cY++) {
      // If the point has water, exit early
      if (chunkMap[cY * chunksAcross + cX] == 0) {
        var xOffset = cX * chunkSize;
        var yOffset = cY * chunkSize * size;
        for (var x = 0; x < chunkSize; x++) {
          for (var y = 0; y < chunkSize; y++) {
            this.waterDistanceMap[xOffset + yOffset + x + y * size] = 255;
          }
        }
        continue;
      }

      // Use BFS to determine the water closest to a point,
      // based on Manhattan distance.
      var neighbors = [[0, cY * chunksAcross + cX]];
      var visited = {};
      while (neighbors.length > 0) {
        // Expand the neighbor until we find water
        var neighbor = neighbors.shift();
        if (chunkMap[neighbor[1]] == 0) {
          var xOffset = cX * chunkSize;
          var yOffset = cY * chunkSize * size;
          for (var x = 0; x < chunkSize; x++) {
            for (var y = 0; y < chunkSize; y++) {
              this.waterDistanceMap[xOffset + yOffset + x + y * size] = 255 - neighbor[0] * 10;
            }
          }
          break;
        }

        // If we've already visited, ignore.
        if (visited[neighbor[1]]) continue;

        // Add any unvisited neighbors
        for (var o = 0; o < offsets.length; o++) {
          if (neighbor[1] + offsets[0] < 0 || neighbor[1] + offsets[0] >= chunkMap.length) continue;
          if (!visited[neighbor[1] + offsets[o]]) neighbors.push([neighbor[0] + 1, neighbor[1] + offsets[o]]);
        }

        // Mark it as visited
        visited[neighbor[1]] = true;
      }

    }
  }
};


Map.prototype.getWaterLevel = function() {
  return this.waterLevel;  
};

// Perlin noise at a point with N octaves from
// https://github.com/Hypercubed/perlin-terrain-angular-demo/blob/bd6df90b055a555194dd4aa09cbe9776de2de7f0/script.js#L38-L51
function noiseWithOctaves(x,y,N) {
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
}

function keepInCircle(value, size, max, x, y) {
  var dx   = x - size/2,
      dy   = y - size/2;
  var dist = Math.sqrt(dx * dx + dy * dy);
  var n    = Math.max(0, 1 - Math.pow(dist / max, 2));
  return value * n;
}
