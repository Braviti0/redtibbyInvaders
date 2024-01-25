class Bullet {
  constructor(position, angle) {
    this.initialPosition = position.copy();
    this.position = position.copy();
    this.velocity = p5.Vector.fromAngle(((angle - 90)/360) * TWO_PI);
    this.color = "red";
  }
  
  render() {
    push();
      stroke(this.color);
      strokeWeight(5);
      point(this.position.x, this.position.y);
      this.move();
    pop();
  }
  
  move() {
    this.position.add(this.velocity);
    
    this.velocity.mult(0.99);
  }
  
  hasHitObject(object) {
    if (this.position.dist(object.position) < object.r) {
      return true;
    }
    return false;
  }
}
