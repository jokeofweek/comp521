function Evaluator(players, distThreshold, waterDistanceWeight, samples) {
  this.players = players;
  this.distThreshold = distThreshold;
  this.waterDistanceWeight = waterDistanceWeight;
  this.samples = samples;
  this.fairnessScore = null;
};

Evaluator.prototype.getViability = function(map, x, y) {
  var height = map.get(x, y),
      resource = map.getResource(x, y),
      waterDist = map.getWaterDistance(x, y);

  if (height <= map.getWaterLevel() ) {
    return 0;
  }


  var score = (this.waterDistanceWeight * waterDist) + ((1 - this.waterDistanceWeight) * resource);

  return Math.min(255, Math.max(0, Math.round(score)));
};

Evaluator.prototype.getPlayerPositions = function(map) {
  var placed = [];

  var distSqrd = this.distThreshold * this.distThreshold;
  // For each player, find the best viable spot which is at least a
  // given distance away from other players.
  for (var i = 0; i < samples; i++) {
    var best = 0;
    var bestX = -1;
    var bestY = -1;

    for (var x = 0; x < size; x++) {
      for (var y = 0; y < size; y++) {
        var v = this.getViability(map, x ,y);
        if (v > best) {
          var found = false;
          for (var j = Math.max(0, placed.length - this.players); j < placed.length; j++) {
            if (distSqrd > (Math.pow(x - placed[j][0], 2) + Math.pow(y - placed[j][1], 2))) {
              found = true;
              break;
            }
          }
          if (!found) {
            best = v;
            bestX = x;
            bestY = y;
          }
        }
      }
    }

    // Skip impossible cases
    if (bestX == -1) continue;

    placed.push([bestX, bestY]);
  }

  // Remove impossible cases
  placed = placed.filter(function(x) {
    return x[0] != -1;
  })

  // If not possible
  if (placed.length < this.players) return [];

  // Find the best window in placed
  var bestFairness = 100000;
  var bestIndex = -1;

  for (var i = 0; i < placed.length - this.players; i++) {
    // Sort the slice for this window.
    var w = placed.slice(i, i + this.players);
    var self = this;
    var w = w.map(function(p) {
      return self.getViability(map, p[0], p[1]);
    })
    w.sort();
    console.log(w);
    var fairness = w[w.length - 1] - w[0];
    console.log('Fairness trial: ' + fairness)
    if (fairness < bestFairness) {
      bestFairness = fairness;
      bestIndex = i;
    }
  }

  this.fairnessScore = bestFairness;
  placed = placed.slice(bestIndex, bestIndex + this.players);

  return placed;
};

Evaluator.prototype.getFairnessScore = function() {
  return this.fairnessScore;
};