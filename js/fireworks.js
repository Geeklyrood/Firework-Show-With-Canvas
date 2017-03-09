var canvas = document.querySelector('.fireworks'),
    ctx = canvas.getContext('2d'),
    
    // full screen dimensions
    canvasWidth = window.innerWidth,
    canvasHeight = window.innerHeight,
    
    fireworks = [],
    particles = [],
    smokePuffs = [],
    
    maxSmokeVelocity = 1,
    
    hue = 120,
    
    // When launching fireworks via a click (tap), to many will 
    // get launched at once without some limitation applied. We
    // will use this to one launch per 5 loop ticks.
    limiterTotal = 5,
    limiterTick = 0,
    
    // These will be used to time the auto launches of fireworks
    // to one launch per 80 loop ticks.
    timerTotal = 80,
    timerTick = 0,
    
    mouseDown = false,
    mouseXpos,
    mouseYpos,
    
    smokeImage = new Image();

// pre-loading the smoke image
smokeImage.src = 'images/smoke.png';

// Set canvas dimensions to match dimensions of browser's inner 
// window
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Helper functions

function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Calculate the distance between to points
function calculateDistance(point1X, point1Y, point2X, point2Y) {
  
  var xDistance = point1X - point2X,
      yDistance = point1Y - point2Y;
  
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  
}


// Create a Firework particle class constructor
function Firework(startX, startY, targetX, targetY) {
  
  this.x = startX;
  this.y = startY;
  
  this.startX = startX;
  this.startY = startY;
  
  this.targetX = targetX;
  this.targetY = targetY;
  
  // distance between starting and ending points
  this.distanceToTarget = calculateDistance(startX, startY, targetX, targetY);
  
  this.distanceTraveled = 0
  
  // Track the coordinates of where the Firework particle has been as it 
  // is flying toward the target to create a trail effect
  this.coordinates = [];
  this.coordinateCount = 5;
  
  // Populate the initial coordinates collection with the current 
  // coordinates of the Firework particle.
  while (this.coordinateCount--) {
    this.coordinates.push([this.x, this.y]);
  }
  
  this.angle = Math.atan2(targetY - startY, targetX - startX);
  
  this.speed = 2;
  
  this.acceleration = 1.05;
  
  this.brightness = randRange(50, 70);
  
  // circle target indicator radius
  this.targetRadius = 1;
  
}

// Draw the Firework particle - method of the Firework 'class'
Firework.prototype.draw = function() {
  
  ctx.beginPath();
  
  // Move to the last tracked coordinate (last elemetn) in the
  // this.cooridinates array and then draw a line to the 
  // current x and y coordinate.
  ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], 
             this.coordinates[this.coordinates.length - 1][1]);
  
  ctx.lineTo(this.x, this.y);
  
  ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
  
  //ctx.stroke();
  
}




