function Renderer3(canvas, size) {
  this.canvas = canvas;
  this.size   = size;
}

Renderer3.prototype.render = function(map) {
  var scene    = new THREE.Scene(),
      camera   = new THREE.PerspectiveCamera(45, 1, 1, 1000),
      renderer = new THREE.WebGLRenderer({canvas: this.canvas});

  this.scene = scene;

  camera.position.set(100, 50, 100);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer.setSize(this.size, this.size);
  renderer.setClearColor(0xffffff, 1);

  var geometry = new THREE.PlaneGeometry(100, 100, this.size-1, this.size-1),
      material = new THREE.MeshNormalMaterial();

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      var i = y * this.size + x;
      var z = 50 * map.get(i) / 255;
      geometry.vertices[i].z = z;
    }
  }

  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  var plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2.0;
  scene.add(plane);

  var water = new THREE.Mesh(new THREE.BoxGeometry(100, 50 * map.getWaterLevel() / 255, 100),
              new THREE.MeshBasicMaterial({
                color: 0x3366aa,
                transparent: true,
                opacity: 0.7
              }));
  water.position.y += 25 * map.getWaterLevel() / 255
  scene.add(water);

  scene.add(new THREE.AmbientLight(0xcccccc));

  var controls = new THREE.TrackballControls(camera, this.canvas);
  var render = function() {
    window.requestAnimationFrame(render);

    controls.update();
    renderer.render(scene, camera);
  }

  render();
}

Renderer3.prototype.placePlayers = function(map) {
  if (this.scene === undefined) return;

  var geometry = new THREE.BoxGeometry(4, 4, 4);
  var material = new THREE.MeshPhongMaterial({color: 0xff0000});

  var self = this;
  map.getPlayerPositions().forEach(function(point) {
    var x = point[0],
        y = point[1],
        z = 50 * map.get(y * self.size + x) / 255;

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (x/self.size - 0.5) * 100;
    mesh.position.y = z+2;
    mesh.position.z = (y/self.size - 0.5) * 100;

    self.scene.add(mesh);
  });
}
