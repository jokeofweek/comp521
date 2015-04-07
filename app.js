// Draw the noise values
var octaves = 7;
var waterLevel = 0.3;
var seed = Math.random() * 200;
var width = 500;
var halfWidth = width / 2;
var height = 500;
var halfHeight = height / 2;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.height = height;
canvas.width = width;

var maxDistance = 0.8 * Math.sqrt(halfWidth * halfWidth + halfHeight * halfHeight);

for (var y = 0; y < height; y++) {
  for (var x = 0; x < width; x++) {
    var value = 0;
    for (var o = 1 << octaves; o >= 1; o >>= 1) {
      value += noise.perlin3((x + seed) / o, (y + seed) / o, seed) * o;
    }

    // Get the average value
    value /= (2 << octaves);

    // Normalize to [0, 1]
    value = (value + 1) / 2;

    // Ensure an island/circular shape.
    var xDist = x - halfWidth;
    var yDist = y - halfHeight;
    var dist = Math.sqrt(xDist * xDist + yDist * yDist);
    
    value *= Math.max(0, 1 - Math.pow(dist / maxDistance, 2));

    var component = Math.floor(value * 255);

    if (value < waterLevel) {
      ctx.fillStyle = 'rgb(0, 0, ' + (30 + component) + ')'
    } else {
      ctx.fillStyle = 'rgb(' + component + ',' + component + ',' + component + ')';
    }
    ctx.fillRect(x, y, 1, 1);
  }
}

