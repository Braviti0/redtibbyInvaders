let interface;


function preload() {
  
  // initialize interface
  interface = new Settings();

  pixelDensity(1);
}


function keyPressed () {
  
  interface.handleKeyPress();
}

function keyReleased () {
  interface.handleKeyRelease();
}


function setup() {
  createCanvas(400, 400);
}

function draw() {
  
  if (!interface.paused) {
    background(0);
    
    // Draw elements
    interface.player.render();
    interface.player.move(interface.turningLeft, interface.turningRight, interface.boosting, interface.braking, interface.aim, interface.aliens.aliens, interface);
    interface.player.renderPlayerBullets();
    if (!interface.player.immortal) {
      interface.player.mortalize(interface.aliens, interface.allDebris.debris, interface);
    }


    interface.aliens.draw();
    interface.aliens.attack(interface.player);
    interface.aliens.destroyAlien(interface.player);



    interface.allDebris.render();
    interface.allDebris.crackRock(interface.player, interface.aliens);
    interface.allDebris.releasePower(interface.player);
    
  } else {
    interface.display();
  }
}

