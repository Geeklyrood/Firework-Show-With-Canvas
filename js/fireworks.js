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
  
}




