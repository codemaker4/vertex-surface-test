class Surface {
  constructor(vertexes, maxVertexLength) {
    this.vertexes = vertexes; // [[x,y],[x,y],...]
    this.maxVertexLength = maxVertexLength;
    this.sqMaxVertexLength = Math.pow(this.maxVertexLength,2); // squared distances to not need sqrt() in distance calculation.
    for (var i = 0; i < this.vertexes.length; i++) {
      this.vertexes[i][2] = true; // [[x,y,hasMoved],[x,y,hasMoved],...]
    }
    this.alwaysUpdate = false;
  }
  updateAll() {
    for (var i = 0; i < this.vertexes.length; i++) {
      this.vertexes[i][2] = true; // [[x,y,hasMoved],[x,y,hasMoved],...]
    }
  }
  getVertex(i) {
    if (i < 0) {
      return this.vertexes[i + this.vertexes.length];
    } else if (i >= this.vertexes.length) {
      return this.vertexes[i - this.vertexes.length];
    } else {
      return this.vertexes[i];
    }
  }
  removeVertex(i) {
    var lenBefore = this.vertexes.length;
    if (i < 0) {
      this.vertexes.splice(i + this.vertexes.length, 1);
    } else if (i >= this.vertexes.length) {
      this.vertexes.splice(i - this.vertexes.length, 1);
    } else {
      this.vertexes.splice(i                       , 1);
    }
    if (lenBefore == this.vertexes.length) {
      console.log("removal failed: i=", i, "\nverts: ", this.vertexes);
    }
  }
  getSQDist(x, y, i) {
    return Math.pow(this.vertexes[i][0]-x , 2) +
           Math.pow(this.vertexes[i][1]-y , 2);
  }
  getDist(x, y, i){
    return Math.sqrt(this.getSQDist(x, y, i));
  }
  getSQVertDist(i, offset) {
    var vertex1 = this.getVertex(i         );
    var vertex2 = this.getVertex(i + offset);
    return Math.pow(vertex2[0]-vertex1[0] , 2) +
           Math.pow(vertex2[1]-vertex1[1] , 2);
  }
  getVertDist(i, offset) {
    return Math.sqrt(this.getSQVertDist(i, offset));
  }
  getPosInbetween(i, offset) {
    var vertex1 = this.getVertex(i         );
    var vertex2 = this.getVertex(i + offset);
    return [(vertex1[0] + vertex2[0]) / 2 , (vertex1[1] + vertex2[1]) / 2, true];
  }
  redoVertexes() {
    for (var i = 0; !(Math.max(i,3) >= this.vertexes.length); i++) {
      var didSomething = false;

      if (this.getVertex(i)[2] || this.getVertex(i+1)[2] || this.alwaysUpdate) { // if either vertexes moved
        var sqDistNow = this.getSQVertDist(i, 1); // make sure dist isn't too long
        if (sqDistNow > this.sqMaxVertexLength) {
          this.vertexes.splice(i+1, 0, this.getPosInbetween(i,1))
          didSomething = true;
          this.getVertex(i-1)[2] = true;
        } else {

          var distNow = Math.sqrt(sqDistNow);
          if (distNow < this.maxVertexLength/2) { // make sure dist isn't too short
            this.removeVertex(i+1);
            didSomething = true;
            this.getVertex(i-1)[2] = true;
            this.getVertex(i-2)[2] = true;
          }

        }
      }

      if (this.getVertex(i)[2] || this.getVertex(i+2)[2] || this.alwaysUpdate) { // ether vertex moved that are 2 apart
        var shortcutDist = this.getVertDist(i, 2);
        if (shortcutDist < this.maxVertexLength) { // make sure dist isn't too short
          this.removeVertex(i+1);
          didSomething = true;
          this.getVertex(i-1)[2] = true;
        }
      }

      this.getVertex(i)[2] = didSomething;
    }
  }
  pushAway(x, y, distance) {
    var sqDistance = Math.pow(distance, 2);
    for (var i = 0; i < this.vertexes.length; i++) {
      var nowSQDist = this.getSQDist(x, y, i);
      if (nowSQDist < sqDistance) {
        var dirToMove = Math.atan2(y - this.vertexes[i][1] , x - this.vertexes[i][0]);
        var amountToMove = Math.sqrt(nowSQDist) - distance;
        this.vertexes[i][0] += Math.cos(dirToMove) * amountToMove;
        this.vertexes[i][1] += Math.sin(dirToMove) * amountToMove;
        this.vertexes[i][2] = true;
      }
    }
  }
  attract(x,y,distance,speed) {
    var sqDistance = Math.pow(distance, 2);
    for (var i = 0; i < this.vertexes.length; i++) {
      var nowSQDist = this.getSQDist(x, y, i);
      if (nowSQDist < sqDistance) {
        var dirToMove = Math.atan2(y - this.vertexes[i][1] , x - this.vertexes[i][0]);
        this.vertexes[i][0] += Math.cos(dirToMove) * speed;
        this.vertexes[i][1] += Math.sin(dirToMove) * speed;
        this.vertexes[i][2] = true;
      }
    }
  }
  render(showMoved) {
    // for (var i = 0; i < this.vertexes.length; i++) {
      // var vertex = this.getVertex(i);
      //
      // if (showMoved && this.getVertex(i)[2]) {
      //   ctx.fillStyle = "#F00"
      // }
      //
      // ctx.beginPath();
      // ctx.arc(vertex[0], vertex[1], 2, 0, 2*Math.PI);
      // ctx.fill();
      //
      // ctx.fillStyle = "#000"

      // var nextVertex = this.getVertex(i+1);
      // ctx.beginPath();
      // ctx.moveTo(vertex[0], vertex[1]);
      // ctx.lineTo(nextVertex[0], nextVertex[1]);
      // ctx.stroke();
    // }

    ctx.fillStyle = "#888"
    ctx.beginPath();
    ctx.moveTo(this.vertexes[0][0], this.vertexes[0][1]);
    for (var i = 1; i < this.vertexes.length; i++) {
      ctx.lineTo(this.vertexes[i][0], this.vertexes[i][1]);
    }
    ctx.fill();
    ctx.fillStyle = "#000"
    ctx.closePath();
    ctx.stroke();

    for (var i = 1; i < this.vertexes.length; i++) {
      ctx.fillRect(this.vertexes[i][0]-2, this.vertexes[i][1]-2, 4, 4);
    }
  }
}
