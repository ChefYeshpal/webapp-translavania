class Chungus {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 48;
        this.height = 48;
        this.image = new Image();
        this.image.src = 'assets/chungus.png';
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        this.isVisible = false;
        this.isFollowing = false;
        this.followSpeed = 1.5;
        this.player = null;
        this.dawg = null;
        this.inputBox = null;
        
        this.movementTrackingActive = false;
        this.movementTimer = 0;
        this.requiredMovementTime = 7000;
        this.lastPlayerPos = { x: 0, y: 0 };
        this.encounterActive = false;
        this.encounterCount = 0;
        this.isDawgDead = false;
        
        this.screenX = 0;
        this.screenY = 0;
    }
    
    setPlayer(player) {
        this.player = player;
        if (player) {
            this.lastPlayerPos = { x: player.x, y: player.y };
        }
    }
    
    setDawg(dawg) {
        this.dawg = dawg;
    }
    
    setInputBox(inputBox) {
        this.inputBox = inputBox;
    }
    
    startTracking() {
        this.movementTrackingActive = true;
        this.movementTimer = 0;
        if (this.player) {
            this.lastPlayerPos = { x: this.player.x, y: this.player.y };
        }
    }
    
    update(deltaTime, isDark, canvas) {
        if (!this.player || this.isDawgDead) return;
        
        // Only track movement when it's dark and dawg is following
        if (isDark && this.dawg && this.dawg.shouldFollow && !this.encounterActive) {
            const playerMoved = (
                Math.abs(this.player.x - this.lastPlayerPos.x) > 0.1 ||
                Math.abs(this.player.y - this.lastPlayerPos.y) > 0.1
            );
            
            if (playerMoved) {
                this.movementTimer += deltaTime;
                this.lastPlayerPos = { x: this.player.x, y: this.player.y };
                
                if (this.movementTimer >= this.requiredMovementTime) {
                    this.triggerEncounter(canvas);
                }
            }
        }
        
        if (this.isFollowing && this.player) {
            const dx = this.player.x - this.x;
            const dy = this.player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= 35) {
                this.catchPlayer();
            } else {
                this.x += (dx / distance) * this.followSpeed;
                this.y += (dy / distance) * this.followSpeed;
            }
        }
    }
    
    triggerEncounter(canvas) {
        this.encounterActive = true;
        this.encounterCount++;
        
        // Disable player controls FIRST
        if (this.player) {
            this.player.clearAllKeys();
            this.player.controlsDisabled = true;
        }
        
        setTimeout(() => {
            this.isVisible = true;
            this.screenX = canvas.width - this.width - 20; 
            this.screenY = 20;
            this.x = this.player.x + 300;
            this.y = this.player.y - 200;
            
            if (this.dawg) {
                this.dawg.addMessage("uhh human?");
                
                setTimeout(() => {
                    this.dawg.addMessage("I think there's something there...");
                    
                    setTimeout(() => {
                        if (this.player) {
                            this.player.controlsDisabled = false;
                        }
                        
                        setTimeout(() => {
                            if (this.inputBox) {
                                this.inputBox.showOptions(
                                    "1. I see it...",
                                    "2. stop kidding with me",
                                    (choice) => this.handleFirstChoice(choice)
                                );
                            }
                        }, 800);
                    }, 400);
                }, 1200);
            }
        }, 800);
    }
    
    handleFirstChoice(choice) {
        if (choice === 1) {
            if (this.dawg) {
                this.dawg.addMessage("yeah... I see it too");
                
                setTimeout(() => {
                    this.dawg.addMessage("should we run or fight it?");
                    
                    setTimeout(() => {
                        if (this.inputBox) {
                            this.inputBox.showOptions(
                                "1. fight",
                                "2. run",
                                (choice) => this.handleFightOrRunChoice(choice)
                            );
                        }
                    }, 1000);
                }, 1000);
            }
        } else if (choice === 2) {
            if (this.dawg) {
                this.dawg.addMessage("I... I don't think that's an illusion human");
                
                setTimeout(() => {
                    this.dawg.addMessage("IT'S MOVING!");
                    
                    setTimeout(() => {
                        this.dawg.addMessage("RUN!");
                        
                        setTimeout(() => {
                            if (this.player) {
                                this.player.controlsDisabled = false;
                            }
                            
                            this.isVisible = false;
                            this.isFollowing = true;
                            this.followSpeed = 1.2;
                            this.encounterActive = false;
                        }, 800);
                    }, 1000);
                }, 1200);
            }
        }
    }
    
    handleFightOrRunChoice(choice) {
        if (choice === 1) {
            // Dawg dies in this scenario, you MONSTER!
            if (this.dawg) {
                this.dawg.addMessage("alright, I'll take it on!");
                
                setTimeout(() => {
                    this.dawg.addMessage("you better run if this goes bad...");
                    
                    setTimeout(() => {
                        const moveInterval = setInterval(() => {
                            if (this.dawg && !this.isDawgDead) {
                                const dx = this.x - this.dawg.x;
                                const dy = this.y - this.dawg.y;
                                const distance = Math.sqrt(dx * dx + dy * dy);
                                
                                if (distance > 10) {
                                    this.dawg.x += (dx / distance) * 3.5;
                                    this.dawg.y += (dy / distance) * 3.5;
                                } else {
                                    clearInterval(moveInterval);
                                    
                                    setTimeout(() => {
                                        this.dawg.addMessage("I... I can't...");
                                        
                                        setTimeout(() => {
                                            this.dawg.isVisible = false;
                                            this.isDawgDead = true;
                                            this.dawg.addMessage("dawg is dead.");
                                            
                                            setTimeout(() => {
                                                this.dawg.addMessage("...");
                                                
                                                setTimeout(() => {
                                                    this.dawg.addMessage("run...");
                                                    
                                                    setTimeout(() => {
                                                        if (this.player) {
                                                            this.player.controlsDisabled = false;
                                                        }
                                                        
                                                        this.isVisible = false;
                                                        this.isFollowing = true;
                                                        this.followSpeed = 1.5;
                                                        this.encounterActive = false;
                                                    }, 800);
                                                }, 1000);
                                            }, 800);
                                        }, 600);
                                    }, 800);
                                }
                            }
                        }, 16);
                    }, 1000);
                }, 1200);
            }
        } else if (choice === 2) {
            // Run - immediate chase
            if (this.dawg) {
                this.dawg.addMessage("good call, let's GO!");
                
                setTimeout(() => {
                    if (this.player) {
                        this.player.controlsDisabled = false;
                    }
                    
                    this.isVisible = false;
                    this.isFollowing = true;
                    this.followSpeed = 1.4;
                    this.encounterActive = false;
                }, 600);
            }
        }
    }
    
    catchPlayer() {
        this.isFollowing = false;
        if (this.player) {
            this.player.controlsDisabled = true;
            this.player.clearAllKeys();
        }
        if (window.pauseGame) {
            window.pauseGame();
        }
        
        if (this.dawg && !this.isDawgDead) {
            this.dawg.addMessage("oh no... it caught you!");
        } else {
            setTimeout(() => {
                alert("You were caught by the creature...");
            }, 500);
        }
    }
    
    draw(ctx, cameraX, cameraY, canvas) {
        if (!this.imageLoaded) return;
        
        if (this.isVisible && this.encounterActive) {
            ctx.drawImage(
                this.image,
                this.screenX,
                this.screenY,
                this.width,
                this.height
            );
        }
        
        if (this.isFollowing) {
            ctx.drawImage(
                this.image,
                this.x - cameraX,
                this.y - cameraY,
                this.width,
                this.height
            );
        }
    }
}
