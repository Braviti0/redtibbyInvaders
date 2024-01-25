class Invaders {
  constructor(alienImage, difficulty) {
    this.alienImage = alienImage;
    this.difficulty = difficulty;
    this.squadSize = 20 + (difficulty -1) * 5;
    this.maxAliens = difficulty;
    this.aliens = [];
    this.bullets = [];
    this.spawnPoints = [0,1,2,3]
  }
  
  

spawnAliens() {
  if (this.aliens.length < this.maxAliens) {
    let spawnPoint;
    let direction;

    const angleWidth = 70;  // Set the desired angle width

    switch (random(this.spawnPoints)) {
      case 0:
        spawnPoint = createVector(0, random(0, height));
        direction = 90 + random(-angleWidth, angleWidth);  // Perpendicular to the left side
        break;

      case 1:
        spawnPoint = createVector(width, random(0, height));
        direction = -90 + random(-angleWidth, angleWidth);  // Perpendicular to the right side
        break;

      case 2:
        spawnPoint = createVector(random(0, width), 0);
        direction = 180 + random(-angleWidth, angleWidth);  // Parallel to the top side
        break;

      default:
        spawnPoint = createVector(random(0, width), height);
        direction = 0 + random(-angleWidth, angleWidth);  // Parallel to the bottom side
    }

    this.aliens.push(new Alien(spawnPoint, direction, this.difficulty, this.alienImage));
    
    this.squadSize -= 1;
  }
}


  
  

  draw() {
    if ((frameCount * this.difficulty) % 90 == 0) {
      this.spawnAliens();
    }
    
    for (let i = this.bullets.length -1; i >= 0; i --) {
      this.bullets[i].render();
      
      if( this.bullets[i].velocity.mag() < 2 || this.bullets[i].position.dist(this.bullets[i].initialPosition) > this.bullets[i].range) {
        this.bullets.splice(i, 1);
      }
    }

    for (let alien of this.aliens) {
      alien.draw();
    }
  }
  
  
  
  attack(player) {
    for (let alien of this.aliens) {
      alien.target(player);
    }
    
    // shoot a bullet from a random alien every shooting interval
    if ((frameCount * this.difficulty) % 120  == 0 ) {
        
        for (let i = 0; i < this.difficulty; i ++ && this.aliens.length > 0) {
          let shooter = random(this.aliens);
          
          if (shooter && !shooter.isTurning) {
            this.bullets.push(shooter.shoot());
          }
        }
    }
  }
  
  
  destroyAlien(player) {
    
    for (let i = player.bullets.length-1; i > -1; i --) {
      
      for (let j = this.aliens.length-1; j > -1; j --) {
        
        if (player.bullets[i].hasHitObject(this.aliens[j])) {
          player.bullets.splice(i, 1);
          
          this.aliens[j].shield -= 1;
          
          if (this.aliens[j].shield < 1) {
            this.aliens.splice(j, 1);
            player.score += 10;
          }
          
          break;
        }
      }
    }
  }
  
}
