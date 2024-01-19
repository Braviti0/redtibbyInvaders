let player;
let aliens;
let interface;
let allDebris;
let difficulty = 1;



function preload() {
  starShip = loadImage('assets/warCraft.png');
  
  img = loadImage('assets/warCraft.png');
  
  // initialize interface
  interface = new Settings();
}


function keyPressed () {
  
  if (key == interface.shootKey) {
      player.shoot();
  }
  
  interface.handleKeyPress();
}

function keyReleased () {
  interface.handleKeyRelease();
}


function setup() {
  createCanvas(400, 400);
  
  // Initialize Player;
  player = new Player(starShip, difficulty);
  
  
  // Initialize Aliens;
  aliens = new Invaders(img,difficulty, player.boundary, width, height);
  aliens.spawnAliens();
  
  
  // Initialize Debris;
  allDebris = new Obstacles(width, height, difficulty, player.boundary);
  allDebris.spawnDebris(createVector(player.position.x, player.position.y)); 
}

function draw() {
  background(0);
  
  // Draw elements
  player.render();
  player.move(interface.turningLeft, interface.turningRight, interface.boosting, interface.braking);
  player.renderPlayerBullets();
  // aliens.draw();
  // allDebris.render();
}

