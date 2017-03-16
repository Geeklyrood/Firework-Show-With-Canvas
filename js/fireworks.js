var canvas = document.querySelector(".fireworks"),
    ctx = canvas.getContext("2d"),
    
    // Full screen dimensions
    canvasWidth = window.innerWidth,
    canvasHeight = window.innerHeight,
    
    fireworks = [],
    particles = [],
    smokePuffs = [],
    
    maxSmokeVelocity = 1,
    
    hue = 120,
    
    // When launching fireworks via a click/tap,
    // too many will get launched at once without
    // some limitation applied.
    // We will use this to limit to one launch per
    // 5 loop ticks.
    limiterTotal = 5,
    limiterTick = 0,
    
    // These will be used to time the auto lanuches
    // of fireworks to one launch per 80 loop ticks.
    timerTotal = 80,
    timerTick = 0,
    
    mouseDown = false,
    mouseXposition,
    mouseYposition,
    
    smokeImage = new Image();

// Preloading the smoke image.
smokeImage.src = "images/smoke.png";

// Set canvas dimensions to match browsers dimensions inner window.
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Helper functions...
function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Caluclate the distance between two points.
function calculateDistance(point1X, point1Y, point2X, point2Y) {
  
  var xDistance = point1X - point2X,
      yDistance = point1Y - point2Y;
  
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  
}

// Create a Firework particle class constructor function.
function Firework(startX, startY, targetX, targetY) {
  
  this.x = startX;
  this.y = startY;
  
  this.startX = startX;
  this.startY = startY;
  
  this.targetX = targetX;
  this.targetY = targetY;
  
  // Distance between starting and ending points.
  this.distanceToTarget = calculateDistance(startX, startY, targetX, targetY);
  
  this.distanceTraveled = 0;
  
  // Track the coordinates of where the firework particle 
  // has been as it is flying toward the target, to create
  // a trail effect.
  this.coordinates = [];
  this.coordinateCount = 5;
  
  // Populate the initial coordinates collection/array with
  // the current coordinates of the Firework particle.
  while (this.coordinateCount--) {
    this.coordinates.push([this.x, this.y]);
  }
  
  this.angle = Math.atan2(targetY - startY, targetX - startX);
  
  this.speed = 2;
  
  this.acceleration = 1.05;
  
  this.brightness = randRange(50, 70);
  
  // Circle target indicator radius.
  this.targetRadius = 1;
  
}

// Draw the Firework particle - method of the Firework Class
// prototype will allow only one copy of Firework.
// Only need prototype when we need to create an new method.
// In this case we are creating a draw method.
// Prototype is used here to keep 1 instance of the fireworks.
Firework.prototype.draw = function() {
  
  ctx.beginPath();
  
  // Move to the last tracked coordinate (last element) in the 
  // this.coordinates array and then draw a line to the current
  // x and y coordinate.
  ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], 
             this.coordinates[this.coordinates.length - 1][1]);
  
  ctx.lineTo(this.x, this.y);
  
  ctx.strokeStyle = "hsl(" + hue + ", 100%, " + this.brightness + "%)";
  
  ctx.stroke();
  
  // Draw the circle for this firework's target
  // as a pulsing circle.
  ctx.beginPath();
  ctx.arc(this.targetX, this.targetY, this.targetRadius, 0, Math.PI * 2);
  
  ctx.stroke();
};

// Update (animate) the firework particle.
Firework.prototype.update = function(index) {
  
  // Remove the last element in the coordinates array
  // properties
  this.coordinates.pop();
  
  // Add the current coordinates of the firework to the 
  // beginning of the coordinates array (insert)
  this.coordinates.unshift([this.x, this.y]);
  
  // Make the target circle pulsate by adjusting it's
  // radius.
  if (this.targetRadius < 8) {
    this.targetRadius += 0.3;
  }else{
    this.targetRadius = 1;
  }
  
  // speed up the firework
  this.speed *= this.acceleration;
  
  // calculate the current velocities based on angle and speed
  var velocityX = Math.cos(this.angle) * this.speed,
      velocityY = Math.sin(this.angle) * this.speed;
  
  // How far will the firework have traveled with the above
  // velocities applied?
  this.distanceTraveled = calculateDistance(this.startX, this.startY, this.x + velocityX, this.y + velocityY);
  
  // If the distance traveled, including velocities,
  // is greater than the initial distance to the 
  // target, then the target has been reached
  if (this.distanceTraveled >= this.distanceToTarget) {
    
    // create explosion (another particle)
    createExplosion(this.targetX, this.targetY);
    
    // create smoke (another particle)
    createSmoke(this.targetX, this.targetY);
    
    // clean up on aisle 5 (firework particle) by removing
    // it from the array
    fireworks.splice(index, 1);
    
  } else { // we have not reached target so move our particle
    
    this.x += velocityX;
    this.y += velocityY;
    
  }
  
};

// Create explosion particles
function createExplosion(x, y) {
  
  var particleCount = 80;
  
  while (particleCount--) {
    
    particles.push(new ExplosionParticle(x, y));
    
  }
  
}

// ExplosionParticle Contstructor
function ExplosionParticle(x, y) {
  
  this.x = x;
  this.y = y;
  
  // Track the past coordinates of each explosion particle
  // to create a trail effect
  this.coordinates = [];
  this.coordinateCount = Math.round(randRange(10, 20));
  
  // Populate the initial coordinate collection with the
  // current coordinates
  while (this.coordinateCount--) {
    this.coordinates.push([this.x, this.y]);
  }
  
  this.angle = randRange(0, Math.PI * 2);
  
  this.speed = randRange(1, 10);
  
  this.friction = 0.95;
  
  this.gravity = 1;
  
  this.hue = randRange(hue - 20, hue + 20);
  
  this.brightness = randRange(50, 80);
  
  this.alpha = 1;
  
  this.decay = randRange(0.003, 0.006);
  
}


// Draw the explosion particle - method of the ExplosionParticle class
ExplosionParticle.prototype.draw = function() {
  
  ctx.beginPath();
  
  // Move to the last tracked coordinate (last element) in the 
  // this.coordinates array and then draw a line to the current
  // x and y coordinate.
  ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], 
             this.coordinates[this.coordinates.length - 1][1]);
  
  ctx.quadraticCurveTo(this.x + 1, this.y - Math.round(randRange(5, 10)), this.x, this.y);
  
  ctx.strokeStyle = "hsla(" + this.hue + ", 100%, " + this.brightness + "%, " + this.alpha + ")";
  
  ctx.stroke();

};

// Update (animate) the explosion particle.
ExplosionParticle.prototype.update = function(index) {
  
  // Remove the last element in the coordinates array
  // properties
  this.coordinates.pop();
  
  // Add the current coordinates of the explosion to the 
  // beginning of the coordinates array (insert)
  this.coordinates.unshift([this.x, this.y]);
  
  this.x += Math.cos(this.angle) * this.speed;
  this.y += Math.sin(this.angle) * this.speed + this.gravity;
  
  // slow down the explosion
  this.speed *= this.friction;
  
  this.alpha -= this.decay;
  
  if (this.alpha <= this.decay) {
    particles.splice(index, 1);
  }
  
};

// Create smoke for the explosion
function createSmoke(x, y) {
  
  var puffCount = 1;
  
  for  (var i = 0; i < puffCount; i++) {
    smokePuffs.push(new SmokeParticle(x, y));
  }
  
}

// Smoke particle constructor
function SmokeParticle(x, y) {
  
  this.x = randRange(x - 25, x + 25);
  this.y = randRange(y -15, y + 15);
  
  this.xVelocity = randRange(.2, maxSmokeVelocity);
  this.yVelocity = randRange(-.1, -maxSmokeVelocity);
  
  this.alpha = 1;
  
}

SmokeParticle.prototype.draw = function() {
  
  if (smokeImage) {
    
    ctx.save();
    
    ctx.globalAlpha = 0.3;
    
    ctx.drawImage(smokeImage, this.x - smokeImage.width / 2, this.y - smokeImage.height / 2);
    
    ctx.restore(); 
  
  }
  
  
}

SmokeParticle.prototype.update = function(index) {
 
  this.x += this.xVelocity;
  this.y += this.yVelocity;
  
  this.alpha -= .001;
  
  if (this.alpha <= 0) {
    smokePuffs.splice(index, 1);
  }
  
}

// heartBeat will be called framerate times per second
function heartBeat() {
  //console.log("heartbeat");
  // Call this function recursively framerate times
  // per second.
  requestAnimationFrame(heartBeat);
  
  // Increase the hue value slightly to get different
  // fire work colors over time.
  hue += 0.5;
  
  // Normally, ctx.clearRect()  would be used to clear
  // the canvas (either all or part of it), but we want
  // to create a trail effect on our firework as it travles
  // through the night sky...
  //
  // Setting the composite operation of the context to
  // a value of "destination-out" will allow use to clear
  // the canvase at a specific opacity, rather than
  // wiping completly clear.
  ctx.globalCompositeOperation = "destination-out";
  
  // Decrease the alpha value to create more prominent trails
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Setting a new composite operation value of "lighter"
  // create bright highlight points as the fireworks and
  // particles overlap each other.
  ctx.globalCompositeOperation = "lighter";
  
  // Loop over each Firework particle, draw it and animate.
  var i = fireworks.length;
  
  while (i--) {
    fireworks[i].draw();
    fireworks[i].update(i);
  }
  
  // Loop over each Explosion particle, draw it and animate.
  var i = particles.length;
  
  while (i--) {
    particles[i].draw();
    particles[i].update(i);
  }
  
  // Loop over each Smoke particle, draw it and animate.
  var i = smokePuffs.length;
  
  while (i--) {
    smokePuffs[i].draw();
    smokePuffs[i].update(i);
  }
  
  // Launch fireworks automatically to random target
  // coordintates when the mouse isn't pressed down.
  if (timerTick >= timerTotal) {
    
    if (!mouseDown) {
      
      // Launch a firework particle from bottom
      // middle of screen, then set random target
      // coordinates.  Note, target Y-position
      // should always be in top half of screen.
      fireworks.push(new Firework(canvasWidth / 2, canvasHeight, randRange(0, canvasWidth), randRange(0, canvasHeight / 2)));
      
      timerTick = 0;
      
    } // End of !mouseDown
    
  }else{
    timerTick++;
  } // End of timerTick >= timerTotal
  
  
  // Limit the rate at which fireworks get launched
  // when user presses mousedown
  if (limiterTick >= limiterTotal) {
    
    if (mouseDown) {
      
      // Launch firework from bottom middle of screen,
      // then set random target coordinates based on
      // mouse position
      fireworks.push(new Firework(canvasWidth / 2, canvasHeight, mouseXposition, mouseYposition));
      
      limiterTick = 0;
      
    }
    
  } else {
    limiterTick++;
  }

}

canvas.addEventListener('mousemove', function(e) {
  
  mouseXposition = e.pageX - canvas.offsetLeft;
  mouseYposition = e.pageY - canvas.offsetTop;
  
});

canvas.addEventListener('mousedown', function(e) {
  
  e.preventDefault();
  mouseDown = true;
  
});

canvas.addEventListener('mouseup', function(e) {
  
  e.preventDefault();
  mouseDown = false;
  
});

// Call heartBeat() once the page loads.
window.onload = heartBeat;
    






























