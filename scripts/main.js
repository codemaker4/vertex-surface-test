var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvasW = canvas.width;
canvasH = canvas.height;
var ctx = canvas.getContext('2d');

var surfaceManager = new SurfaceManager(50, true);

surfaceManager.addSurface([
  [canvasW*0.1,canvasH*0.5],
  [canvasW*0.9,canvasH*0.5],
  [canvasW*0.9,canvasH*0.9],
  [canvasW*0.1,canvasH*0.9]]);

var mouseX = 0;
var mouseY = 0;

function draw() {

  ctx.clearRect(0, 0, canvasW, canvasH);

  if (mouseDown[0]) {
    surfaceManager.pushAway(mouseX, mouseY, 100);
  }
  if (mouseDown[1]) {
    surfaceManager.attract(mouseX, mouseY, 100, 2);
  }

  surfaceManager.render();

  surfaceManager.redoVertexes();

}

setInterval(draw, 1000/60);


canvas.addEventListener('mousemove', e => {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
});

var mouseDown = [false, false, false];
document.body.onmousedown = function(evt) {
  mouseDown[evt.button] = true;
  console.log(mouseDown);
}
document.body.onmouseup = function(evt) {
  mouseDown[evt.button] = false;
  console.log(mouseDown);
}
