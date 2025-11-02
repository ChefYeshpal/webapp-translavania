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
        this.followSpeed = 2.5;
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
            
            if (distance > 5) {
                this.x += (dx / distance) * this.followSpeed;
                this.y += (dy / distance) * this.followSpeed;
            } else {
                this.catchPlayer();
            }
        }
    }
    
    triggerEncounter(canvas) {
        this.encounterActive = true;
        this.encounterCount++;
        
        // Disable player controls
        if (this.player) {
            this.player.clearAllKeys();
            this.player.controlsDisabled = true;
        }
        
        this.isVisible = true;
        this.screenX = canvas.width - this.width - 20;
        this.screenY = canvas.height - this.height - 20;
        
        this.x = this.player.x + 200;
        this.y = this.player.y + 200;
        
        // Dawg dialogue
        setTimeout(() => {
            if (this.dawg) {
                this.dawg.addMessage("uhh human?");
                
                setTimeout(() => {
                    this.dawg.addMessage("I think there's something there...");
                    
                    setTimeout(() => {
                        if (this.inputBox) {
                            this.inputBox.showOptions(
                                "1. I see it...",
                                "2. stop kidding with me",
                                (choice) => this.handleFirstChoice(choice)
                            );
                        }
                    }, 1500);
                }, 1500);
            }
        }, 500);
    }
    
    handleFirstChoice(choice) {
        if (choice === 1) {
            // Player sees it
            if (this.dawg) {
                this.dawg.addMessage("should we run or fight that?");
                
                setTimeout(() => {
                    if (this.inputBox) {
                        this.inputBox.showOptions(
                            "1. yes",
                            "2. run",
                            (choice) => this.handleFightOrRunChoice(choice)
                        );
                    }
                }, 1500);
            }
        } else if (choice === 2) {
            // Player dismisses it
            if (this.dawg) {
                this.dawg.addMessage("oh... probably some kind of an illusion then...");
                
                setTimeout(() => {
                    if (this.player) {
                        this.player.controlsDisabled = false;
                    }
                    
                    // Hide creature from corner but keep it in world (far distance)
                    this.isVisible = false;
                    this.x = this.player.x + 300;
                    this.y = this.player.y + 300;
                    
                    // Start following from a distance
                    this.isFollowing = true;
                    this.followSpeed = 0.8; // Slower follow when dismissed
                    
                    // Reset for next encounter
                    this.encounterActive = false;
                    this.movementTimer = 0;
                }, 1500);
            }
        }
    }
    
    handleFightOrRunChoice(choice) {
        if (choice === 1) {
            // Fight - dawg rushes and dies
            if (this.dawg) {
                this.dawg.addMessage("alright, let's do this!");
                
                setTimeout(() => {
                    // Move dawg towards creature
                    const moveInterval = setInterval(() => {
                        if (this.dawg && !this.isDawgDead) {
                            const dx = this.x - this.dawg.x;
                            const dy = this.y - this.dawg.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            
                            if (distance > 10) {
                                this.dawg.x += (dx / distance) * 3;
                                this.dawg.y += (dy / distance) * 3;
                            } else {
                                clearInterval(moveInterval);
                                // Dawg circles the creature briefly then disappears
                                setTimeout(() => {
                                    this.dawg.isVisible = false;
                                    this.isDawgDead = true;
                                    this.dawg.addMessage("dawg is dead.");
                                    
                                    // Hide creature
                                    this.isVisible = false;
                                    this.encounterActive = false;
                                    
                                    // Re-enable controls
                                    if (this.player) {
                                        this.player.controlsDisabled = false;
                                    }
                                }, 1000);
                            }
                        }
                    }, 16);
                }, 1000);
            }
        } else if (choice === 2) {
            // Run - creature chases player
            if (this.dawg) {
                this.dawg.addMessage("okay, RUN!");
                
                setTimeout(() => {
                    // Re-enable controls so player can run
                    if (this.player) {
                        this.player.controlsDisabled = false;
                    }
                    
                    // Creature starts following
                    this.isFollowing = true;
                    this.followSpeed = 2.5;
                    
                    // Hide from corner (it's now in the world)
                    this.isVisible = false;
                    this.encounterActive = false;
                }, 1000);
            }
        }
    }
    
    catchPlayer() {
        // TODO: Implement what happens when creature catches player
        // Left for later as per user request
        this.isFollowing = false;
        if (this.dawg && !this.isDawgDead) {
            this.dawg.addMessage("oh no... it caught you!");
        }
    }
    
    draw(ctx, cameraX, cameraY, canvas) {
        if (!this.imageLoaded) return;
        
        // Draw in screen space (bottom right corner) when visible
        if (this.isVisible && this.encounterActive) {
            ctx.drawImage(
                this.image,
                this.screenX,
                this.screenY,
                this.width,
                this.height
            );
        }
        
        // Draw in world space when following
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
