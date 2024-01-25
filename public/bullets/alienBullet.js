 class AlienBullet extends Bullet {
  constructor(position, angle, difficulty) {
    super(position, angle);
    this.velocity.mult(5 + difficulty);
    this.range = 270 + difficulty * 30;
  }
}
