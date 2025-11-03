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
        this.isApproaching = false;
        this.approachSpeed = 0.8;
        this.chaseSpeed = 1.5;
        this.player = null;
        this.dawg = null;
        this.inputBox = null;
        this.mrBob = null;
        
        this.spawnTimer = 0;
        this.spawnDelay = 8000;
        this.hasSpawned = false;
        this.isDawgDead = false;
        this.isHighlighted = false;
        this.phase = 'waiting'; 
        this.pressureCount = 0;
    }
    
    setPlayer(player) {
        this.player = player;
    }
    
    setDawg(dawg) {
        this.dawg = dawg;
    }
    
    setInputBox(inputBox) {
        this.inputBox = inputBox;
    }
    
    setMrBob(mrBob) {
        this.mrBob = mrBob;
    }
    
    startSpawnTimer() {
        this.spawnTimer = 0;
        this.hasSpawned = false;
    }
    
    update(deltaTime, isDark) {
        if (!this.player || this.isDawgDead) return;
        
        if (isDark && this.dawg && this.dawg.shouldFollow && !this.hasSpawned) {
            this.spawnTimer += deltaTime;
            
            if (this.spawnTimer >= this.spawnDelay) {
                this.spawn();
            }
        }
        
        if ((this.isApproaching || this.phase === 'chasing') && this.player) {
            const dx = this.player.x - this.x;
            const dy = this.player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const speed = this.phase === 'chasing' ? this.chaseSpeed : this.approachSpeed;
            
            // Check for player catching
            if (distance <= 25) {
                this.catchPlayer();
            } else {
                this.x += (dx / distance) * speed;
                this.y += (dy / distance) * speed;
            }
        }
    }
    
    spawn() {
        if (this.hasSpawned) return;
        
        this.hasSpawned = true;
        this.isVisible = true;
        this.isApproaching = true;
        this.phase = 'approaching';
        this.x = this.player.x - 400;
        this.y = this.player.y + 200;
        setTimeout(() => {
            if (this.dawg) {
                this.dawg.addMessage("uhh... I think there's something following us....");
                
                setTimeout(() => {
                    if (this.inputBox) {
                        this.inputBox.showOptions(
                            "1. I see it...",
                            "2. What're you talking about?",
                            (choice) => this.handleFirstChoice(choice)
                        );
                    }
                }, 1500);
            }
        }, 1000);
    }
    
    handleFirstChoice(choice) {
        if (choice === 1) {
            this.isHighlighted = false;
            if (this.dawg) {
                this.dawg.addMessage("should we fight or run?");
                
                setTimeout(() => {
                    if (this.inputBox) {
                        this.inputBox.showOptions(
                            "1. run",
                            "2. fight",
                            (choice) => this.handleFightOrRun(choice)
                        );
                    }
                }, 1200);
            }
        } else if (choice === 2) {
            if (this.dawg) {
                this.dawg.addMessage("look there! dont you see it?");
                this.isHighlighted = true;
                
                setTimeout(() => {
                    if (this.inputBox) {
                        this.inputBox.showOptions(
                            "1. Oh... I see it...",
                            "2. Nah, I dont see it...",
                            (choice) => this.handleSecondChoice(choice)
                        );
                    }
                }, 1500);
            }
        }
    }
    
    handleSecondChoice(choice) {
        if (choice === 1) {
            this.isHighlighted = false;
            if (this.dawg) {
                this.dawg.addMessage("should we fight or run?");
                
                setTimeout(() => {
                    if (this.inputBox) {
                        this.inputBox.showOptions(
                            "1. run",
                            "2. fight",
                            (choice) => this.handleFightOrRun(choice)
                        );
                    }
                }, 1200);
            }
        } else if (choice === 2) {
            this.pressureCount++;
            
            if (this.dawg) {
                const pressureMessages = [
                    "human, look carefully!",
                    "it's RIGHT there, are you blind?!",
                    "HUMAN! LOOK!"
                ];
                
                const message = pressureMessages[Math.min(this.pressureCount - 1, pressureMessages.length - 1)];
                this.dawg.addMessage(message);
                
                setTimeout(() => {
                    if (this.inputBox) {
                        this.inputBox.showOptions(
                            "1. Oh... I see it...",
                            "2. Nah, I dont see it...",
                            (choice) => this.handleSecondChoice(choice)
                        );
                    }
                }, 1500);
            }
        }
    }
    
    handleFightOrRun(choice) {
        if (choice === 1) {
            if (this.dawg) {
                this.dawg.addMessage("okay, RUN!");
                
                setTimeout(() => {
                    this.phase = 'chasing';
                    this.isHighlighted = false;
                }, 500);
            }
        } else if (choice === 2) {
            if (this.dawg) {
                this.dawg.addMessage("I'll protect you human!");
                
                setTimeout(() => {
                    const moveInterval = setInterval(() => {
                        if (this.dawg && !this.isDawgDead) {
                            const dx = this.x - this.dawg.x;
                            const dy = this.y - this.dawg.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            
                            if (distance > 20) {
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
                                            if (this.mrBob) {
                                                this.mrBob.isVisible = true;
                                                this.mrBob.x = this.player.x + 100;
                                                this.mrBob.y = this.player.y;
                                                
                                                setTimeout(() => {
                                                    this.dawg.addMessage("YOU KILLED HER!!!!!");
                                                }, 300);
                                            }
                                            setTimeout(() => {
                                                this.showDawgDeathGameOver();
                                            }, 3000);
                                        }, 1000);
                                    }, 800);
                                }, 600);
                            }
                        }
                    }, 16);
                }, 1000);
            }
        }
    }
    
    catchPlayer() {
        this.isApproaching = false;
        this.phase = 'caught';
        
        if (this.player) {
            this.player.controlsDisabled = true;
            this.player.clearAllKeys();
        }
        
        if (window.pauseGame) {
            window.pauseGame();
        }
        this.showGameOver();
    }
    
    // Dog's death game over screen, did intially think of adding jeff the killer's image here but decided against it cause we're all goofy :p
    showDawgDeathGameOver() {
        if (this.player) {
            this.player.controlsDisabled = true;
            this.player.clearAllKeys();
        }
        
        if (window.pauseGame) {
            window.pauseGame();
        }
        const gameOverDiv = document.createElement('div');
        gameOverDiv.id = 'gameOverScreen';
        gameOverDiv.style.position = 'fixed';
        gameOverDiv.style.top = '0';
        gameOverDiv.style.left = '0';
        gameOverDiv.style.width = '100%';
        gameOverDiv.style.height = '100%';
        gameOverDiv.style.backgroundColor = '#000';
        gameOverDiv.style.display = 'flex';
        gameOverDiv.style.flexDirection = 'column';
        gameOverDiv.style.alignItems = 'center';
        gameOverDiv.style.justifyContent = 'center';
        gameOverDiv.style.zIndex = '10000';
        gameOverDiv.style.fontFamily = 'Arial, sans-serif';
        
        gameOverDiv.innerHTML = `
            <div style="text-align: center;">
                <h1 style="color: #ff0000; font-size: 72px; margin: 0; font-weight: bold;">GAME OVER</h1>
                <h2 style="color: #fff; font-size: 48px; margin: 20px 0; font-weight: normal;">YOU KILLED DOG >:(</h2>
                <button id="playAgainBtn" style="padding: 15px 40px; background: #333; border: 2px solid #666; color: #fff; font-size: 20px; cursor: pointer; margin-top: 40px;">
                    Play Again
                </button>
            </div>
        `;
        
        document.body.appendChild(gameOverDiv);
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            location.reload();
        });
    }
    
    // Job application
    showGameOver() {
        const gameOverDiv = document.createElement('div');
        gameOverDiv.id = 'gameOverScreen';
        gameOverDiv.style.position = 'fixed';
        gameOverDiv.style.top = '0';
        gameOverDiv.style.left = '0';
        gameOverDiv.style.width = '100%';
        gameOverDiv.style.height = '100%';
        gameOverDiv.style.backgroundColor = '#f5f5f5';
        gameOverDiv.style.display = 'flex';
        gameOverDiv.style.flexDirection = 'column';
        gameOverDiv.style.alignItems = 'center';
        gameOverDiv.style.justifyContent = 'center';
        gameOverDiv.style.zIndex = '10000';
        gameOverDiv.style.fontFamily = 'Arial, sans-serif';
        
        gameOverDiv.innerHTML = `
            <div style="max-width: 600px; padding: 40px; background: white; border: 1px solid #ccc;">
                <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: normal; color: #333;">Employment Application Form</h1>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #666;">Full Name:</label>
                    <input type="text" id="jobFullName" style="width: 100%; padding: 8px; border: 1px solid #999; background: #fff; box-sizing: border-box;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #666;">Position Applied For:</label>
                    <input type="text" id="jobPosition" value="Data Entry Clerk" style="width: 100%; padding: 8px; border: 1px solid #999; background: #fff; box-sizing: border-box;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #666;">Years of Experience:</label>
                    <input type="text" id="jobExperience" style="width: 100%; padding: 8px; border: 1px solid #999; background: #fff; box-sizing: border-box;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #666;">References:</label>
                    <textarea id="jobReferences" style="width: 100%; padding: 8px; border: 1px solid #999; background: #fff; height: 80px; resize: none; box-sizing: border-box;"></textarea>
                </div>
                
                <p style="font-size: 12px; color: #999; margin: 20px 0;">
                    By submitting this application, you agree to work standard business hours, 9 AM to 5 PM, Monday through Friday.
                </p>
                
                <button id="playAgainBtn" style="width: 100%; padding: 12px; background: #ddd; border: 1px solid #999; color: #333; font-size: 16px; cursor: pointer; margin-top: 20px;">
                    Play Again
                </button>
            </div>
        `;
        
        document.body.appendChild(gameOverDiv);
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            location.reload();
        });
    }
    
    draw(ctx, cameraX, cameraY) {
        if (!this.imageLoaded || !this.isVisible) return;
        if (this.isHighlighted) {
            ctx.save();
            ctx.shadowColor = 'rgba(255, 255, 200, 0.5)';
            ctx.shadowBlur = 20;
        }
        
        ctx.drawImage(
            this.image,
            this.x - cameraX,
            this.y - cameraY,
            this.width,
            this.height
        );
        
        if (this.isHighlighted) {
            ctx.restore();
        }
    }
}
