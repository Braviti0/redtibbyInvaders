class Obstacles {
  constructor(difficulty, spaceRock) {
    this.rock = spaceRock;
    this.debris = [];
    this.powerUps = [];
    this.difficulty = difficulty;
    this.allDebris = 50 * difficulty;
    this.maxDebris = 6;
    this.maxPowerUps = 1 + difficulty;
    this.spawnPoints = [0, 1, 2, 3];
  }
  
  spawnPowerUp (position) {
    if (this.powerUps.length < this.maxPowerUps) {
      this.powerUps.push(new PowerUp(position, random(this.spawnPoints)));
    }
  }

  spawnDebris() {
    if (this.debris.length < this.maxDebris) {
      let spawnPoint;
      let direction;

      const angleWidth = 70;  // Set the desired angle width

      switch (random(this.spawnPoints)) {
        case 0:
          spawnPoint = createVector(0, random(0, height));
          break;

        case 1:
          spawnPoint = createVector(width, random(0, height));
          break;

        case 2:
          spawnPoint = createVector(random(0, width), 0);
          break;

        default:
          spawnPoint = createVector(random(0, width), height);
      }

      this.debris.push(new Debris(spawnPoint, random(this.spawnPoints), this.difficulty, this.rock));
    }
  }

  render() {
    if ((frameCount * this.difficulty) % 240 == 0) {
      this.spawnDebris();
      
      if (random(0, 15) > 14) {
        this.spawnPowerUp(createVector(random(0, width), random(0, height)));
      }
    }
    
    for (let i = this.debris.length - 1; i >= 0; i--) {
      this.debris[i].show();
      this.debris[i].move();
    }
    
    for (let i = this.powerUps.length -1; i > -1; i--) {
      this.powerUps[i].show();
      this.powerUps[i].move();
      
      
      // remove expired powerUps
      if (this.powerUps[i].r < 5) {
        this.powerUps.splice(i, 1);
      }
    }
  }
  
  releasePower (player) {
    
    for (let i = this.powerUps.length -1; i > -1; i --) {
      
      if (this.powerUps[i].hasHitPlayer(player)) {
        
        player.collectPowerUp(this.powerUps[i].magicNumber);
        
        this.powerUps.splice(i, 1);
      }
    }
  }
  
  crackRock(player, aliens) {
    
    for (let i = player.bullets.length-1; i > -1; i --) {
      
      for (let j = this.debris.length-1; j > -1; j --) {
        
        if (player.bullets[i].hasHitObject(this.debris[j])) {
          player.bullets.splice(i, 1);
          
          this.debris[j].cracks += 1;
          
          if (this.debris[j].cracks > this.debris[j].maxCracks) {
            player.score +=  10 * this.debris[j].maxCracks;
            
            if (random(this.spawnPoints) == 3) {
              this.spawnPowerUp(this.debris[j].position);
            }
            this.debris.splice(j, 1);
          }
          
          break;
        }
      }
    } 
    
    
    
    // allow the rock to shield alien bullets to make the game easier for the player
    
    for (let k = aliens.bullets.length -1; k > -1; k --) {
      
      for (let j = this.debris.length-1; j > -1; j --) {
        
        if (aliens.bullets[k].hasHitObject(this.debris[j])) {
          aliens.bullets.splice( k, 1);  
          
          break;
        }
      }
    }
  }
}
