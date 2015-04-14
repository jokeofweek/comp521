function Evaluator(players, distThreshold, waterDistanceWeight) {
  this.players = players;
  this.distThreshold = distThreshold;
  this.waterDistanceWeight = waterDistanceWeight;

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
  for (var i = 0; i < this.players; i++) {
    var best = 0;
    var bestX = -1;
    var bestY = -1;

    for (var x = 0; x < size; x++) {
      for (var y = 0; y < size; y++) {
        var v = this.getViability(map, x ,y);
        if (v > best) {
          var found = false;
          for (var j = 0; j < placed.length; j++) {
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

    // Not possible
    if (bestX == -1) return [];

    placed.push([bestX, bestY]);
  }

  this.fairnessScore = this.getViability(map, placed[0][0], placed[0][1]) - this.getViability(map, placed[players - 1][0], placed[players - 1][1]);

  return placed;
};

Evaluator.prototype.getFairnessScore = function() {
  return this.fairnessScore;
};