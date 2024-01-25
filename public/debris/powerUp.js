class PowerUp {
  constructor(position, magicNumber) {
    this.position = position.copy();
    this.velocity = createVector(0,0);
    this.magicNumber = magicNumber;
    this.r = 15;
    this.colors = ["red", "blue", "white", "yellow"];
  }

  move() {
    this.position.add(this.velocity);
    this.velocity.mult(0.98);
    this.velocity.add(createVector(random(-0.2, 0.2), random(-0.2, 0.2)));
    
    this.r -= 0.01;
    
    this.edges();
  }

  show() {
    push();
      imageMode(CENTER);
      // scaled image for circular rocks
      fill(this.colors[this.magicNumber]);
      circle(this.position.x, this.position.y, this.r);
    pop();
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

  hasHitPlayer(player) {
    if (dist(this.position.x, this.position.y, player.position.x, player.position.y) < this.r + player.r) {
      return true;
    }
    return false;
  }
}
