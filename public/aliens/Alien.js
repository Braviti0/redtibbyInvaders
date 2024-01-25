class Alien {
  constructor(position, direction, difficulty, image) {
    
    // alien specs
    this.rocketSpeed = 0.03 + (0.01 * difficulty);
    this.turningFactor = 0.2 + 0.1* difficulty;
    this.shield = difficulty;
    
    // motion mechanics
    this.position = position;
    this.velocity = createVector(0,0);
    this.direction = direction;
    this.targetDirection = 0;
    
    
    // setup
    this.accelerate(random(0.5, difficulty + 1.5));
    
    // attack mechanics;
    this.isTurning = true;
    this.targetLockedTime = 1;
    
    
    // metadata
    this.difficulty = difficulty;
    this.r = 10 + difficulty*2;
    this.image = image;
  }

  draw() {
    push();
      angleMode(DEGREES);
      imageMode(CENTER);
      translate(this.position.x, this.position.y);
      rotate(this.direction);
      image(this.image, 0, 0, this.r * 2, this.r * 2);
      angleMode(RADIANS);
    pop();
  }

  hasHitPlayer(player) {
    if (this.position.dist(player.position) < this.r + player.r) {
      return true;
    }
    return false;
  }

  
  move (player) {
    this.position.add(this.velocity);
    this.velocity.mult(0.99);
    
    this.edges();
  }
  
  
  
  target(player) {

    // Get the vector between the alien and player and set that as the alien's target
    let toPlayer = createVector(player.position.x - this.position.x, player.position.y - this.position.y);

    let alienDirection = p5.Vector.fromAngle(radians(this.direction - 90));

    let turningAmount = degrees(alienDirection.angleBetween(toPlayer));

    if (turningAmount < -4.9) {
      this.isTurning = true;
      this.direction -= this.turningFactor;
    } else if (turningAmount > 4.9) {
      this.isTurning = true;
      this.direction += this.turningFactor;
    } else if (abs(turningAmount) < 5 && this.isTurning == true) {
      this.isTurning = false;
      this.direction += turningAmount;
    } 

    this.move(player);
  }

  accelerate (power) {
    let direction = p5.Vector.fromAngle(radians(this.direction - 90));
    this.velocity.add(p5.Vector.mult(direction, random(0,power)));
  }
  
    // wrap
  edges() {
    if (this.position.x > width + this.r) {
      this.position.x = -this.r;
    } else if (this.position.x < -this.r) {
      this.position.x = width + this.r;
    }
    if (this.position.y > height + this.r) {
      this.position.y = -this.r;
    } else if (this.position.y < -this.r) {
      this.position.y = height + this.r;
    }
  }
  
  
  shoot ( ) {
    return new AlienBullet(this.position, this.direction, this.difficulty);
  }
}
