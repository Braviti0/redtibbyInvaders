class Player {
  
  constructor(shooterImage, life, difficulty) {
    this.image = shooterImage;
    this.life = life;
    this.r = 10;
    
    // spaceship specs
    this.rocketPower = 0.1;
    this.thrusterPower = 0.008;
    this.maxAmmo = 8;
    this.bulletSpeed = 8;
    this.maxBombs = 1;
    this.maxLives = 3;
    this.maxShield = 2;
    this.refillSpeed = 1;
    this.aimSkill = 20/ difficulty;
    
    // motion mechanics
    this.position = createVector(width/2, height/2);
    this.velocity = createVector(0,0);
    this.direction = 0;
    
    
    //Inherited value from settings.level
    this.difficulty = difficulty;
    
    
    // existing bullets
    this.bullets = [];
    this.ammo = this.maxAmmo;
    
    
    this.lives = this.maxLives;
    this.shield = this.maxShield;
    
    // powerUp variables
    this.immortal = true;
    this.scoreMultiplier = difficulty;
    this.laserStart = 0;
    this.immortalStart = -60 * 10; // player is immortal for about 5 seconds during start of game
    
    this.score = 0;
    this.finalScore = 0;
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
    
    this.refillAmmo();
    this.drawLives();
    this.drawInfo("redtibby");
    
    this.losePower();
  }
  
  losePower () {
    // remortalize player after sometime
    if (this.immortal == true && (frameCount - this.immortalStart) > 60 * (16 - this.difficulty)) {
        this.immortal = false;
    } 
    
    if (this.aimSkill > 20 && (frameCount - this.laserStart) > 60 * (16 - this.difficulty)) {
      this.aimSkill = 20/this.difficulty;
    }
    
    this.finalScore = this.score * this.scoreMultiplier;
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
  move (left, right, boost, brake, aim, aliens, setting) {
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
    
    if (aim) {
      this.aim(aliens, setting);
    }
    
    this.position.add(this.velocity);
    this.velocity.mult(0.99);
    this.edges();
  }
  
  turn (LorR) {
    if (LorR == "left") {
      this.direction -= 3;
    } else {
      this.direction += 3;
    }
  }

  accelerate (faster) {
    let direction = p5.Vector.fromAngle(radians(this.direction - 90));
    let speedChange = faster ? this.rocketPower : -this.thrusterPower;
    this.velocity.add(p5.Vector.mult(direction, speedChange));
  }
  
  
  
  
  
  // Defense and Offense systems
  
  renderPlayerBullets() {
    for (let i = this.bullets.length - 1; i > -1; i--) {
      this.bullets[i].render();

      if( this.bullets[i].velocity.mag() < 2 || this.bullets[i].position.dist(this.bullets[i].initialPosition) > this.bullets[i].range) {
        this.bullets.splice(i, 1);
      }
    }
  }

  
  shoot () {
    if (this.ammo > 0) {
      this.bullets.push(new PlayerBullet(this.position,this.direction, this.bulletSpeed));
      this.ammo -= 1;
    }
  }
  
  refillAmmo () {
    if (this.ammo < this.maxAmmo && frameCount % (40/this.refillSpeed) == 0 ) {
      this.ammo++ ;
    }
  } 
  
  aim (aliens, setting) {
    for (let alien of aliens) {
        // Get the vector between the alien and player and set that as the alien's target
      let toAlien = createVector(alien.position.x - this.position.x, alien.position.y - this.position.y);

      let playerDirection = p5.Vector.fromAngle(radians(this.direction - 90));

      let turningAmount = degrees(playerDirection.angleBetween(toAlien));
      
      if (abs(turningAmount) < this.aimSkill) {
        this.direction += turningAmount;
        setting.aim = false;
        break;
      }
    }
  }
  
  
  // re-alive after death  
  respawn() {
    this.position = createVector(width/2, height/2);
    this.velocity = createVector(0,0);
    this.acceleration = createVector(0,0);
    this.direction = 0;
    this.shield = this.maxShield;
    this.ammo = this.maxAmmo;
    
    this.immortal = true;
    this.immortalStart = -60 * 10; // player is immortal for about 5 seconds during start of game
    
    this.lives -= 1;
  }
  
  
  
  // upgradeSpaceship after levelUp
  upgradeSpaceship(newShip) {
    this.image = newShip;
    this.ammo += 6;
  }


  loseLife(game) {
    if (this.lives > 0) {
      this.respawn();
    } else {
      game.paused = true;
      game.remarks = "game over! your score: " + this.finalScore;
    }
  }
  
  
  // make player lose lives
  mortalize(invaders, debris,game) {
    for (let alien of invaders.aliens) {
      if (alien.hasHitPlayer(this)) {
        this.loseLife(game);
        break;
      }
    }
    
    for (let rock of debris) {
      if (rock.hasHitPlayer(this)) {
        this.loseLife(game);
        break;
      }
    }
    
    for (let i = invaders.bullets.length -1; i > -1; i --) {
      if (invaders.bullets[i].hasHitObject(this)) {
        this.shield -= 1;
        
        if (this.shield < 1) {
          this.loseLife(game);
        }
        
        invaders.bullets.splice(i, 1);
      }
    }
  }
  
  
  // handle powerUps
  
  collectPowerUp( magicNumber) {
    switch (magicNumber) {
      case 0:
        // extra life
        if (this.lives < this.maxLives) {
          this.lives += 1;
        }
        break;
      case 1:
        // increase score by factor
        this.scoreMultiplier += this.difficulty;
        break;
        
        // track powerUp time and disable it after about 15 seconds
      case 2:
        // laser accuracy
        if (this.aimSkill < 30) {
          this.aimSkill += 30;
        }
        this.laserStart = frameCount;
        break;
        
      case 3:
        // temporary immortality
        this.immortal = true;
        this.immortalStart = frameCount;
    }
  }
     
  
  

  
  
  // information display
  
  drawLives() {
    for (let i = 0; i < this.lives; i++) {
      push();
        tint(255, 100);
        image(this.life, width - (i + 1) * 30, 10, this.r * 2, this.r * 2);
      pop();
    }
    
    
    // indicators for immortality and laser aiming
    if (this.immortal == true) {
      push();
        noStroke();
        fill(150,150,0, 60);
        rectMode(CORNER);
        rect(width - (30 * this.lives) - 10,5,30 * this.lives + 10,30 );
      pop();
    } 
    
    if (this.aimSkill > 20) {
      push();
        noStroke();
        fill(150,150,150, 60);
        rectMode(CORNER);
        rect(width/2 ,5,30,30 );
      pop();
    }
  }
  
  
  
  drawInfo(username) {
    fill(255);
    let bounty_text = username + ": ";
    let bounty_text_w = textWidth(bounty_text);
    let score = text(bounty_text, 50, 25);
    push();
      fill(100, 255, 100);
      textSize(12);
      text(this.finalScore, bounty_text_w + 50, 25);
    pop();
    this.drawLives(bounty_text_w + textWidth(this.score) + 100);
  }


}
