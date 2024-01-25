class PlayerBullet extends Bullet {
  constructor(position, angle, lethality) {
    super(position, angle);
    this.velocity.mult(lethality);
    this.size = lethality/2;
    this.range = lethality * 50;
    this.color = "green";
  }
}
