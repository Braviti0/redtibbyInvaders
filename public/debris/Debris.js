class Debris {
  constructor(position, r, difficulty, spaceRock) {
    this.rock = spaceRock;
    this.position = position;
    this.cracks = 0;
    this.maxCracks = r + difficulty;
    this.velocity = createVector(random(-difficulty, difficulty) / 4, random(-difficulty, difficulty) / 4);
    this.r = 10 + 5 * r;
  }

  move() {
    this.position.add(this.velocity);
    
    this.edges();
  }

  show() {
    push();
      imageMode(CENTER);
      // scaled image for circular rocks
      fill("red");
      image(this.rock,this.position.x, this.position.y, this.r * 2.8, this.r * 1.7);
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
