class Settings {
  
  constructor () {
    
    // images
    this.starShip = loadImage('assets/warCraft.png');
    this.superShip = loadImage('assets/battleShip.png');
    this.life = loadImage('assets/life.png');
    this.ufo = loadImage('assets/alien.png');
    this.spaceRock = loadImage('assets/spaceRock.png');
    
    this.wallpaper = [random(50,100),random(50,100),random(50,100), random(70,100)]
    
    this.paused = true;
    this.earnedNFT = false;
    
    // immutable 
    this.immutableAddress = "";
    this.immutableProfile = "";
    
    
    this.remarks = '';
    this.alterControls = false;
    
    // options
    this.options = {0 :["start game / continue", "controls", "volume", "NFT rewards"], 1: ["reset to default","toggle arrow keys", "motion control keys", "additional controls"] , 2: [], 3: [], 4: [], 5: [] };
    this.selectedOption = 0;
    
    // pages
    this.pages = ["home", "controls", "volume","motion control keys","additional controls", "NFT rewards"];
    this.selectedPage = 0;
    
    // game mechanics
    this.turningLeft = false;
    this.turningRight = false;
    this.boosting = false;
    this.braking = false;
    this.aim = false;
    
    this.level = 1;
    
    // keyboard Interface
    this.resetDefault()
    
    this.options[3] =  [ "boost/ up: " + this.boostKey, "brake/down: " + this.brakeKey, "left key: " + this.leftKey, "right key: " + this.rightKey];
    this.options[4] = ["pause key:" + (this.pauseKey == 17 ? "CTRL" : this.pauseKey), "shoot key:" + (this.shootKey == ' ' ? "SPACEBAR" : this.shootKey), " aim key:" + this.aimKey];
    this.options[5] = [ "once you have earned an NFT","you will be eligible to collect it" , "a pop up will enable you to mint", "your immmutable wallet will receive the nft", "your wallet address: " + this.immutableAddress, "your profile: " + this.immutableProfile];
  }
  
  resetDefault () {
    this.volume = 7;
    
    
    this.boostKey = null;
    this.brakeKey = null;
    this.leftKey = null;
    this.rightKey = null;
    
    this.pauseKey = CONTROL;
    this.shootKey = ' ';
    this.aimKey = 'b';
    
    this.arrowKeys = true;
  }
  
  display () {
    background(...this.wallpaper);
    
    push();
      rectMode(CENTER);
      textAlign(CENTER);
      fill("white");
      stroke("black");
      strokeWeight(4);
      textSize(height/10);
      text("redtibby Invaders", width/2, height/10);
      line(0, height/6, width, height/6);
    
      textSize(height/20);
    
      text(this.pages[this.selectedPage], width/2, height/4);
    
      for (let i = 0; i < this.options[this.selectedPage].length; i++) {
        text(this.options[this.selectedPage][i], width/2, (height/8) * (3 +i));
      }
    
    
    // volume page
      if (this.selectedPage == 2) {
        push();
          noStroke();
          rect(width/2, height/2, width * 7/8, height/ 8);
        
          rectMode(CORNER)
          fill("blue");
          rect(width/16, height/2 - height/16, width * this.volume/8, height/ 8);
        pop();
      }
    
      fill(0,0,0, 50);
      noStroke();
      rect(width/2, (height/8) * (3 + this.selectedOption), width, height/10);
      
      text(this.remarks, width/2, height * 9/ 10)
    pop();
  }
  
  handleExecution (page, option) {
    if (page == 0 ) {
      if (option == 0 ) {
        this.paused = false;
        this.initializeGame(this.level);
        
      } else if (option == 1) {
        this.selectedPage = 1;
      } else if (option == 2) {
        this.selectedPage = 2;
        this.alterControls = true;
      } else if (option == 3) {
        this.selectedPage = 5;
      }
      
    } else if (page == 1) {
       if (option == 0) {
         this.resetDefault();
         
          this.remarks = 'reset to default controls successfully';
       } else if (option == 1) {
         this.alterControls = true;
         this.remarks = "press Enter to confirm";
       } else if (option == 2) {
        this.selectedPage = 3;
        this.remarks = "press Enter to modify the selected key";
        
      } else if (option == 3) {
        this.selectedPage = 4;
        this.remarks = "press Enter to modify the selected key";
      }
    } else if (page == 3 || page == 4) {
      this.alterControls = true;
      this.remarks = "enter the new key,(alphanumeric keys only) ";
    }
  }
  
  
  initializeGame (difficulty) {
    // Initialize Player;
    this.player = new Player(this.starShip,this.life, difficulty);


    // Initialize Aliens;
    this.aliens = new Invaders(this.ufo,difficulty);


    // Initialize Debris;
    this.allDebris = new Obstacles(difficulty, this.spaceRock); 
  }
  
  modifyControls( page, option) {
    if (page == 1 && option == 0) {
      
    } else if (page ==1 && option == 1 && keyCode == ENTER) {
      
      if (this.arrowKeys) {
        this.arrowKeys = false;
        this.remarks = "arrow keys disabled";
      } else {
        this.arrowKeys = true;
        this.remarks = "arrow keys enabled";
      }
    } else if (page == 3 && keyCode != ENTER) {
      if (option == 0 ) {
        this.boostKey = key;
        this.remarks = "boost/up key set as: " + this.boostKey;
      } else if (option == 1) {
        this.brakeKey = key;
        this.remarks = "brake/down key set as: " + this.brakeKey;
      } else if (option == 2) {
        this.leftKey = key;
        this.remarks = "left key set as: " + this.leftKey;
      } else if (option == 3) {
        this.rightKey = key;
        this.remarks = "right key set as: " + this.rightKey;
      }
      this.options[3] =  [ "boost/ up: " + this.boostKey, "brake/down: " + this.brakeKey, "left key: " + this.leftKey, "right key: " + this.rightKey];
      
    } else if (page ==4 && keyCode !=  ENTER) {
      
      switch (option) {
          
        case 0:
          this.pauseKey = key;
          this.remarks = "pause key set as:" + this.pauseKey;
          break;
        
          case 1:
            this.shootKey = key;
            this.remarks = "shoot key set as:" + this.shootKey;
            break;
          case 2:
            this.aimKey = key;
            this.remarks = "aim key set as:" + this.aimKey;
      }
      
        this.options[4] = ["pause key:" + (this.pauseKey == 17 ? "CTRL" : this.pauseKey), "shoot key:" + (this.shootKey == ' ' ? "SPACEBAR" : this.shootKey), " aim key:" + this.aimKey];
    } else if (page == 2) {
            if ((key == this.boostKey || keyCode == UP_ARROW) && this.volume < 7) {
              
              this.volume += 1;
              return;
              
            } else if ((key == this.brakeKey || keyCode == DOWN_ARROW) && this.volume > 0) {
              
              this.volume -= 1;
              return;
              
            } else if (keyCode == ESCAPE || key == this.leftKey || keyCode == LEFT_ARROW) {
                this.selectedPage = 0;
                this.alterControls = false;
            } else {
              return;
            }
      
      } else {
      this.remarks = "controls were not modified";
    }
    
    this.alterControls = false;
  }
  
  handleKeyPress() {

    if (!this.paused) {
      this.onPlayerControlPress();
      
      // pause or resume
      if (keyCode == this.pauseKey || key == this.pauseKey) {
        this.paused = !this.paused;
      }
      
    } else if (this.alterControls) {
      
        this.modifyControls(this.selectedPage, this.selectedOption);
      
    } else {
      
      if (keyCode == ESCAPE || key == this.leftKey || keyCode == LEFT_ARROW) {
        this.selectedPage = 0;
        this.alterControls = false;
      } else if ((keyCode == UP_ARROW || key == this.boostKey) && this.selectedOption > 0) {
        this.selectedOption -= 1;
      } else if ((keyCode == DOWN_ARROW || key == this.brakeKey) && this.selectedOption < this.options[this.selectedPage].length - 1) {
        this.selectedOption += 1;
      } else if ((keyCode == ENTER || key == this.shootKey)) {
        this.handleExecution(this.selectedPage, this.selectedOption);
      }
    }
  }

  
  handleKeyRelease () {
    
    if (!this.paused) {
      this.onPlayerControlRelease();
    }
    
  }
  
  
  onPlayerControlPress () {
        // turn Left or Right
    if ((keyCode == LEFT_ARROW) && this.arrowKeys ||
      key == this.leftKey) {
      this.turningLeft = true;
      this.turningRight = false;
    } else if ((keyCode == RIGHT_ARROW) && this.arrowKeys ||
      key == this.rightKey) {
      this.turningLeft = false;
      this.turningRight = true;
    }
    
    // Boost and brake
    if ((keyCode == UP_ARROW) && this.arrowKeys ||
      key == this.boostKey) {
      this.boosting = true;
    } else if ((keyCode == DOWN_ARROW) && this.arrowKeys ||
      key == this.brakeKey) {
      this.braking = true;
    } 
    
    if ((key == this.aimKey)) {
      this.aim = true;
    }
    
    if (key == this.shootKey) {
      this.player.shoot();
    }
  }
  
  onPlayerControlRelease () {
        // stop turning
    if ((keyCode == LEFT_ARROW) && this.arrowKeys ||
      key == this.leftKey) {
      this.turningLeft = false;
    } else if ((keyCode == RIGHT_ARROW) && this.arrowKeys ||
      key == this.rightKey) {
      this.turningRight = false;
    }
    
    // stop boosting
    if ((keyCode == UP_ARROW) && this.arrowKeys ||
      key == this.boostKey) {
      this.boosting = false;
    } else if ((keyCode == DOWN_ARROW) && this.arrowKeys ||
      key == this.brakeKey) {
      this.braking = false;
    }
    
    // stop aiming
    if ((key == this.aimKey)) {
      this.aim = false;
    }
  }
  
  levelUp () {
    this.paused = true;
    this.level ++;
  }

}