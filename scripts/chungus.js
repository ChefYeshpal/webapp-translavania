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
        
        this.maintainDistance = 250; 
        this.chaseMode = false; 
        this.chaseTimer = 0;
        this.timeUntilChase = 15000;
        this.encounterTimeout = null;
        this.maxEncounterWaitTime = 20000;
        
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
            
            if (!this.chaseMode) {
                this.chaseTimer += deltaTime;
                if (this.chaseTimer >= this.timeUntilChase) {
                    this.chaseMode = true;
                    if (this.dawg && !this.isDawgDead) {
                        this.dawg.addMessage("IT'S COMING FASTER!");
                    }
                }
                
                if (distance > this.maintainDistance + 20) {
                    this.x += (dx / distance) * this.followSpeed;
                    this.y += (dy / distance) * this.followSpeed;
                } else if (distance < this.maintainDistance - 20) {
                    this.x -= (dx / distance) * this.followSpeed;
                    this.y -= (dy / distance) * this.followSpeed;
                }
            } else {
                if (distance <= 35) {
                    this.catchPlayer();
                } else {
                    this.x += (dx / distance) * (this.followSpeed * 2.5);
                    this.y += (dy / distance) * (this.followSpeed * 2.5);
                }
            }
        }
    }
    
    triggerEncounter(canvas) {
        this.encounterActive = true;
        this.encounterCount++;
        
        this.encounterTimeout = setTimeout(() => {
            if (this.encounterActive) {
                if (this.dawg) {
                    this.dawg.addMessage("IT'S NOT WAITING ANYMORE!");
                }
                setTimeout(() => {
                    this.startChasing();
                }, 1000);
            }
        }, this.maxEncounterWaitTime);
        
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
                        this.dawg.addMessage("like... in the shadows...");
                        
                        setTimeout(() => {
                            if (this.inputBox) {
                                this.inputBox.showOptions(
                                    "1. I see it...",
                                    "2. stop kidding with me",
                                    (choice) => this.handleFirstChoice(choice)
                                );
                            }
                        }, 1000);
                    }, 1200);
                }, 1200);
            }
        }, 800);
    }
    
    handleFirstChoice(choice) {
        if (this.encounterTimeout) {
            clearTimeout(this.encounterTimeout);
            this.encounterTimeout = null;
        }
        
        if (choice === 1) {
            if (this.dawg) {
                this.dawg.addMessage("yeah... I see it too");
                
                setTimeout(() => {
                    this.dawg.addMessage("it's just... watching us...");
                    
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
                }, 1000);
            }
        } else if (choice === 2) {
            if (this.dawg) {
                this.dawg.addMessage("I... I don't think that's an illusion human");
                
                setTimeout(() => {
                    this.dawg.addMessage("LOOK AT ITS EYES!");
                    
                    setTimeout(() => {
                        this.dawg.addMessage("IT'S MOVING!");
                        
                        setTimeout(() => {
                            this.dawg.addMessage("RUN!");
                            
                            setTimeout(() => {
                                this.startChasing();
                            }, 800);
                        }, 800);
                    }, 1000);
                }, 1200);
            }
        }
    }
    
    handleFightOrRunChoice(choice) {
        if (this.encounterTimeout) {
            clearTimeout(this.encounterTimeout);
            this.encounterTimeout = null;
        }
        
        if (choice === 1) {
            // Dawg dies in this scenario, you MONSTER!
            if (this.dawg) {
                this.dawg.addMessage("alright, I'll take it on!");
                
                setTimeout(() => {
                    this.dawg.addMessage("get ready...");
                    
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
                                        this.dawg.addMessage("no...");
                                        
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
                                                            this.dawg.addMessage("please...");
                                                            
                                                            setTimeout(() => {
                                                                this.startChasing();
                                                            }, 600);
                                                        }, 800);
                                                    }, 1000);
                                                }, 800);
                                            }, 600);
                                        }, 600);
                                    }, 800);
                                }
                            }
                        }, 16);
                    }, 800);
                }, 1000);
                }, 1000);
            }
        } else if (choice === 2) {
            // Run - immediate chase
            if (this.dawg) {
                this.dawg.addMessage("good call, let's GO!");
                
                setTimeout(() => {
                    this.dawg.addMessage("don't look back!");
                    
                    setTimeout(() => {
                        this.startChasing();
                    }, 600);
                }, 600);
            }
        }
    }
    
    startChasing() {
        // Clear timeout if it exists
        if (this.encounterTimeout) {
            clearTimeout(this.encounterTimeout);
            this.encounterTimeout = null;
        }
        
        if (this.player) {
            const angle = Math.random() * Math.PI * 2;
            this.x = this.player.x + Math.cos(angle) * this.maintainDistance;
            this.y = this.player.y + Math.sin(angle) * this.maintainDistance;
        }
        
        this.isVisible = false;
        this.isFollowing = true;
        this.encounterActive = false;
        this.movementTimer = 0;
        this.chaseTimer = 0;
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
        
        this.showGameOverScreen();
    }
    
    showGameOverScreen() {
        const gameOverDiv = document.createElement('div');
        gameOverDiv.id = 'gameOverScreen';
        gameOverDiv.style.position = 'fixed';
        gameOverDiv.style.top = '0';
        gameOverDiv.style.left = '0';
        gameOverDiv.style.width = '100vw';
        gameOverDiv.style.height = '100vh';
        gameOverDiv.style.backgroundColor = '#ffffff';
        gameOverDiv.style.overflowY = 'auto';
        gameOverDiv.style.zIndex = '10000';
        gameOverDiv.style.fontFamily = 'Arial, sans-serif';
        gameOverDiv.style.padding = '40px';
        
        const form = document.createElement('div');
        form.style.maxWidth = '800px';
        form.style.margin = '0 auto';
        form.style.backgroundColor = '#f5f5f5';
        form.style.padding = '40px';
        form.style.borderRadius = '10px';
        form.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        
        const header = document.createElement('div');
        header.style.textAlign = 'center';
        header.style.marginBottom = '30px';
        header.style.borderBottom = '3px solid #333';
        header.style.paddingBottom = '20px';
        
        const title = document.createElement('h1');
        title.textContent = 'CHUNGUS CORP™ EMPLOYMENT APPLICATION';
        title.style.fontSize = '32px';
        title.style.color = '#333';
        title.style.marginBottom = '10px';
        title.style.fontWeight = 'bold';
        
        const subtitle = document.createElement('p');
        subtitle.textContent = 'Congratulations! You have been selected for immediate employment.';
        subtitle.style.fontSize = '16px';
        subtitle.style.color = '#666';
        subtitle.style.fontStyle = 'italic';
        
        header.appendChild(title);
        header.appendChild(subtitle);
        
        const welcomeMsg = document.createElement('div');
        welcomeMsg.style.backgroundColor = '#fff3cd';
        welcomeMsg.style.border = '2px solid #ffc107';
        welcomeMsg.style.padding = '20px';
        welcomeMsg.style.marginBottom = '30px';
        welcomeMsg.style.borderRadius = '5px';
        welcomeMsg.innerHTML = `
            <p style="margin: 0 0 10px 0; font-size: 14px;"><strong>Dear Applicant,</strong></p>
            <p style="margin: 0 0 10px 0; font-size: 14px;">
                Our hiring manager, <strong>Big Chungus</strong>, has been observing your performance 
                and finds you absolutely <em>bussin'</em> fr fr. No cap, your rizz is unmatched! 
            </p>
            <p style="margin: 0; font-size: 14px;">
                As per company policy, all caught individuals must complete this form before receiving 
                their eternal employment contract. This is a <strong>sigma grindset</strong> opportunity!
            </p>
        `;
        
        const formFields = document.createElement('div');
        formFields.style.marginBottom = '30px';
        
        const fields = [
            { label: 'Full Name (Government Name, no lies allowed):', type: 'text' },
            { label: 'How much aura do you have? (1-10):', type: 'number' },
            { label: 'Favorite type of gyatt:', type: 'text' },
            { label: 'Rate your Ohio survival skills:', type: 'text' },
            { label: 'Can you mog the competition? (Yes/Slay):', type: 'text' },
            { label: 'Previous experience with Big Chungus (be honest fr):', type: 'textarea' },
            { label: 'Why should we NOT keep you forever?', type: 'textarea' }
        ];
        
        fields.forEach(field => {
            const fieldDiv = document.createElement('div');
            fieldDiv.style.marginBottom = '20px';
            
            const label = document.createElement('label');
            label.textContent = field.label;
            label.style.display = 'block';
            label.style.marginBottom = '8px';
            label.style.fontSize = '14px';
            label.style.fontWeight = 'bold';
            label.style.color = '#333';
            
            let input;
            if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.style.height = '80px';
                input.style.resize = 'vertical';
            } else {
                input = document.createElement('input');
                input.type = field.type;
            }
            
            input.style.width = '100%';
            input.style.padding = '10px';
            input.style.fontSize = '14px';
            input.style.border = '2px solid #ddd';
            input.style.borderRadius = '5px';
            input.style.boxSizing = 'border-box';
            input.disabled = true;
            input.placeholder = 'All answers have been pre-approved by Chungus';
            input.style.backgroundColor = '#f9f9f9';
            
            fieldDiv.appendChild(label);
            fieldDiv.appendChild(input);
            formFields.appendChild(fieldDiv);
        });
        
        const disclaimer = document.createElement('div');
        disclaimer.style.backgroundColor = '#f8d7da';
        disclaimer.style.border = '2px solid #dc3545';
        disclaimer.style.padding = '15px';
        disclaimer.style.marginBottom = '30px';
        disclaimer.style.borderRadius = '5px';
        disclaimer.style.fontSize = '12px';
        disclaimer.innerHTML = `
            <p style="margin: 0 0 10px 0;"><strong>⚠️ LEGAL DISCLAIMER:</strong></p>
            <p style="margin: 0 0 5px 0;">• By being caught, you agree to eternal employment</p>
            <p style="margin: 0 0 5px 0;">• Salary: 0 gyatt tokens per lunar cycle</p>
            <p style="margin: 0 0 5px 0;">• Benefits: None (this is the backrooms)</p>
            <p style="margin: 0 0 5px 0;">• Time off: Denied (you are literally caught)</p>
            <p style="margin: 0;">• This form cannot be submitted (L + Ratio + Caught)</p>
        `;
        
        const tryAgainSection = document.createElement('div');
        tryAgainSection.style.textAlign = 'center';
        tryAgainSection.style.marginTop = '40px';
        tryAgainSection.style.paddingTop = '30px';
        tryAgainSection.style.borderTop = '3px solid #333';
        
        const escapeText = document.createElement('p');
        escapeText.textContent = '...or you could try to escape? 👀';
        escapeText.style.fontSize = '16px';
        escapeText.style.color = '#666';
        escapeText.style.marginBottom = '20px';
        
        const reloadButton = document.createElement('button');
        reloadButton.textContent = '🏃 ESCAPE & TRY AGAIN 🏃';
        reloadButton.style.fontSize = '20px';
        reloadButton.style.padding = '15px 40px';
        reloadButton.style.backgroundColor = '#28a745';
        reloadButton.style.color = 'white';
        reloadButton.style.border = 'none';
        reloadButton.style.borderRadius = '5px';
        reloadButton.style.cursor = 'pointer';
        reloadButton.style.transition = 'all 0.3s';
        reloadButton.style.fontWeight = 'bold';
        
        reloadButton.onmouseover = () => {
            reloadButton.style.backgroundColor = '#218838';
            reloadButton.style.transform = 'scale(1.05)';
        };
        reloadButton.onmouseout = () => {
            reloadButton.style.backgroundColor = '#28a745';
            reloadButton.style.transform = 'scale(1)';
        };
        reloadButton.onclick = () => {
            location.reload();
        };
        
        tryAgainSection.appendChild(escapeText);
        tryAgainSection.appendChild(reloadButton);
        
        form.appendChild(header);
        form.appendChild(welcomeMsg);
        form.appendChild(formFields);
        form.appendChild(disclaimer);
        form.appendChild(tryAgainSection);
        
        gameOverDiv.appendChild(form);
        document.body.appendChild(gameOverDiv);
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
