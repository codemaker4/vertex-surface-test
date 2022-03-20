class SurfaceManager {
  constructor(maxVertexLength) {
    this.maxVertexLength = maxVertexLength;
    this.sqMaxVertexLength = Math.pow(this.maxVertexLength,2); // squared distances to not need sqrt() in distance calculation.
    this.alwaysUpdate = false;
    this.surfaces = [];
    this.onNewSurface = undefined;
    this.onSurfaceDelete = undefined;
  }
  pushAway(x, y, distance) {
    for (var i = 0; i < this.surfaces.length; i++) {
      this.surfaces[i].pushAway(x, y, distance);
    }
  }
  attract(x, y, distance, speed) {
    for (var i = 0; i < this.surfaces.length; i++) {
      this.surfaces[i].attract(x, y, distance, speed);
    }
  }
  redoVertexes() {
    for (var i = 0; i < this.surfaces.length; i++) { // internal shape collisions that DO result into splitting
      var nowSurface = this.surfaces[i];
      for (var j = 0; j < nowSurface.vertexes.length; j++) {
        if (nowSurface.vertexes[j][2]) { // if vert moved, check for intersects with other parts of the shape
          for (var k = 0; k < nowSurface.vertexes.length; k++) {
            if (j-k > -2 && j-k < 2) { // skip when too close and internal shape collsions should check
              continue
            }
            var sqDistance = nowSurface.getSQVertDist(j, k-j);
            if (sqDistance < this.sqMaxVertexLength) {
              var splitStart = j;
              var splitEnd = k
              if (splitStart > splitEnd) {
                splitStart = k;
                splitEnd = j;
              }
              this.addSurface(nowSurface.vertexes.slice(splitStart, splitEnd));
              nowSurface.vertexes.splice(splitStart, splitEnd-splitStart);
              j = Infinity;
              k = Infinity;
              nowSurface.updateAll();
              this.surfaces[this.surfaces.length-1].updateAll();
              if (this.onNewSurface) {
                this.onNewSurface(his.surfaces[this.surfaces.length-1]);
              }
            }
          }
        }
      }
    }

    for (var i = 0; i < this.surfaces.length; i++) { // misc internal shape collisions that do NOT result into splitting
      if (this.surfaces[i].vertexes.length <= 3) {
        if (this.onSurfaceDelete) {
          this.onSurfaceDelete(this.surfaces[i]);
        }
        this.surfaces.splice(i,1)
        i-= 1;
        continue;
      }
      this.surfaces[i].redoVertexes();
    }
  }
  render(showMoved) {
    for (var i = 0; i < this.surfaces.length; i++) {
      this.surfaces[i].render(showMoved);
    }
  }
  addSurface(vertexes) {
    this.surfaces.push(new Surface(vertexes, this.maxVertexLength))
  }
}
