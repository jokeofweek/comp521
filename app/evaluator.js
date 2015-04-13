function Evaluator() {
};

Evaluator.prototype.getViability = function(map, x, y) {
  var height = map.get(x, y),
      resource = map.getResource(x, y),
      waterDist = map.getWaterDistance(x, y);

  if (height <= map.getWaterLevel()) {
    return 0;
  }
  return Math.min(255, Math.max(0, Math.round(
    255 * ((resource / 255) * (waterDist / 255)))));
};