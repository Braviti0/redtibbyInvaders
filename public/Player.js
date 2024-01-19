class Player {
  
    constructor(shooterImage, difficulty) {
      this.image = shooterImage;
      this.r = 10;
      
      // spaceship specs
      this.rocketSpeed = 0.1;
      this.thrusterSpeed = 0.008;
      this.maxAmmo = 8;
      this.bulletSpeed = 8;
      this.maxBombs = 1;
      this.maxLives = 3;
      this.refillSpeed = 1;
      
      // motion mechanics
      this.position = createVector(width/2, height/2);
      this.velocity = createVector(0,0);
      this.direction = 0;
      
      
      //Inherited value from settings.level
      this.difficulty = difficulty;
      
      
      // existing bullets
      this.bullets = [];
      this.ammo = this.maxAmmo;
      
      
      this.lives = 3;
      
      
      this.score = 0;
      
      // can't build this function, that prevents losing life at game start, basically creates a circle of freedom, where no aliens can spawn (they can only move there)
      this.boundary = this.r * (5 - difficulty);
    }
    
    
    
    /// display
    
    render() {
      push();
      angleMode(DEGREES);
      rectMode(CENTER);
        translate(this.position.x, this.position.y);
        rotate(this.direction);
        imageMode(CENTER);
        image(this.image, 0, 0, this.r * 2, this.r * 2);
      angleMode(RADIANS);
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
    
    
    // move player
    move (left, right, boost, brake) {
      if (boost) {
        this.accelerate(true);
      } else if (brake) {
        this.accelerate(false);
      }
      
      if (left) {
        this.turn("left");
      } else if (right) {
        this.turn("right");
      }
      
      this.position.add(this.velocity);
      this.velocity.mult(0.99);
      this.edges();
    }
    
    turn (LorR) {
      if (LorR == "left") {
        this.direction -= 4;
      } else {
        this.direction += 4;
      }
    }
  
    accelerate (faster) {
      let thrust = p5.Vector.fromAngle(((this.direction - 90)/360) * TWO_PI);
      let speedChange = faster ? this.rocketSpeed : this.thrusterSpeed;
      this.velocity.add(p5.Vector.mult(thrust, speedChange));
    }
    
    
    
    
    
    // Defense and Offense systems
    
    renderPlayerBullets() {
      for (let i = this.bullets.length - 1; i > -1; i--) {
        this.bullets[i].render();
  
        if (this.bullets[i].isOffScreen) {
          this.bullets.splice(i, 1);
        }
      }
    }
  
    
    shoot () {
      if (this.ammo > 0) {
        this.bullets.push(new PlayerBullet(this.position,this.direction, this.bulletSpeed));
      }
      
      if (this.ammo < this.maxAmmo) {
        setTimeout(this.refillAmmo, 3000/this.refillSpeed);
      }
    }
    
    refillAmmo () {
      this.ammo += 1;
      
      if (this.ammo < this.maxAmmo) {
        setTimeout(this.refillAmmo, 3000/this.refillSpeed);
      }
    }
    
    
    // re-alive after death
    respawn() {
      this.position = createVector(width/2, height/2);
      this.velocity = createVector(0,0);
      this.acceleration = createVector(0,0);
      this.direction = 0;
      
      this.lives -= 1;
    }
    
    
    
    // upgradeSpaceship after levelUp
    upgradeSpaceship() {
      this.image = loadImage("battleShip.png");
      this.ammo += 6;
    }
  
  
    loseLife() {
      if (this.lives > 0) {
        this.respawn();
      }
    }
  }
  