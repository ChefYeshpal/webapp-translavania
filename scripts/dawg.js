class Dawg {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 32;
        this.height = 32;
        this.image = new Image();
        this.image.src = 'assets/dawwg.png';
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        this.isVisible = false;
        this.conversationState = 'initial';
        this.dialogueStarted = false;
        this.isMoving = false;
        this.moveSpeed = 1.5;
        this.moveStartTime = 0;
        this.dragonEncounterTriggered = false;
        this.dragon = null;
        this.player = null;
        this.shouldFollow = false;
        this.followDistance = 48;
    }

    setDragon(dragon) {
        this.dragon = dragon;
    }

    spawn(x, y) {
        this.x = x;
        this.y = y;
        this.isVisible = true;
    }

    setPlayer(player) {
        this.player = player;
    }

    hide() {
        this.isVisible = false;
    }

    startDialogue() {
        if (!this.dialogueStarted) {
            this.dialogueStarted = true;
            this.showDialogue();
        }
    }

    showDialogue() {
        const dialogueBox = document.getElementById('unifiedDialogue');
        
        if (dialogueBox) {
            this.addMessage("sup human, how's it all goin?");
            
            const inputContainer = document.getElementById('mrBobInput');
            if (inputContainer) {
                inputContainer.style.display = 'flex';
            }
        }
    }

    // This sequence should run only after the dragon has disappeared and night has begun
    startNightSequence() {
        if (this.dialogueStarted) return;
        this.dialogueStarted = true;

        this.addMessage("hmm... seems like night's coming earlier though...");

        setTimeout(() => {
            this.addMessage("so, just cause bob told me to be with you, I'll spend tonight with you");
        }, 1400);

        setTimeout(() => {
            this.showThanksOrNahOptions();
        }, 2800);
    }
    
    addMessage(text) {
        const dialogueBox = document.getElementById('unifiedDialogue');
        if (!dialogueBox) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'dawg-message';
        messageElement.textContent = text;
        
        dialogueBox.appendChild(messageElement);
        
        dialogueBox.scrollTop = dialogueBox.scrollHeight;
    }

    respondToPlayer(answer) {
        switch(this.conversationState) {
            case 'initial':
                this.addMessage("I dont care tbh, but lemme take you somewhere hmm?");
                this.conversationState = 'waiting_for_next';
                break;
                
            case 'waiting_for_next':
                this.addMessage("eh, follow me aight? we aint going too far");
                this.conversationState = 'moving';
                this.isMoving = true;
                this.moveStartTime = Date.now();
                break;
        }
    }

    showThanksOrNahOptions() {
        const optionSelector = document.getElementById('optionSelector');
        const opt1 = document.getElementById('option1');
        const opt2 = document.getElementById('option2');
        if (!optionSelector || !opt1 || !opt2) return;

        opt1.textContent = 'thanks...';
        opt2.textContent = "nah I'll be fine";
        optionSelector.style.display = 'flex';

        const cleanup = () => {
            optionSelector.style.display = 'none';
            opt1.onclick = null;
            opt2.onclick = null;
        };

        opt1.onclick = () => {
            cleanup();
            this.addMessage('aww, thanks human...');
            this.shouldFollow = true;
            if (window.startDarkening) window.startDarkening();
        };

        opt2.onclick = () => {
            cleanup();
            this.addMessage('you do you human...');
            if (window.startDarkening) window.startDarkening();
            setTimeout(() => {
                this.addMessage('...');
                // hide dawg
                this.hide();
            }, 900);
        };
    }

    followPlayer() {
        if (!this.player) return;
        const targetX = this.player.x - this.followDistance;
        const targetY = this.player.y;

        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = 1.8;
        if (dist > 1) {
            this.x += (dx / dist) * Math.min(speed, dist);
            this.y += (dy / dist) * Math.min(speed, dist);
        }
    }

    update() {
        if (this.isMoving) {
            const elapsedTime = Date.now() - this.moveStartTime;
            
            const totalMoveTime = 10000;
            const destinationX = this.x + (this.moveSpeed * Math.cos(-Math.PI / 4) * (totalMoveTime / 16.67));
            const destinationY = this.y + (this.moveSpeed * Math.sin(-Math.PI / 4) * (totalMoveTime / 16.67));
            
            if (!this.dragon.hasAppeared && elapsedTime >= 5000) {
                this.dragon.spawn(destinationX + 80, destinationY - 40);
            }
            
            if (!this.dragonEncounterTriggered && elapsedTime >= 10000) {
                this.dragonEncounterTriggered = true;
                this.isMoving = false;
                
                this.addMessage("oh hey, looks that's KNOCKOFF HEIDI!!!!");
                
                setTimeout(() => {
                    if (this.dragon) {
                        this.dragon.addMessage("What was that?");
                    }
                    
                    setTimeout(() => {
                        this.addMessage("That's dragon (i am so smort), and she's a knockoff of a racoon who's a dragon");
                        
                        setTimeout(() => {
                            if (this.dragon) {
                                this.dragon.addMessage("SHUT UP WILL YOU");
                            }
                            
                            setTimeout(() => {
                                this.addMessage("anyways, she's a cool species, just dont try to skibdi rizz her will you?");
                                
                                setTimeout(() => {
                                    if (this.dragon) {
                                        this.dragon.addMessage("who is that thing anyways?");
                                    }
                                    
                                    setTimeout(() => {
                                        if (this.dragon) {
                                            this.dragon.showOptions();
                                        }
                                    }, 2000);
                                }, 2500);
                            }, 2000);
                        }, 2500);
                    }, 2000);
                }, 1500);
                
                return;
            }
            
            this.x += this.moveSpeed * Math.cos(-Math.PI / 4);
            this.y += this.moveSpeed * Math.sin(-Math.PI / 4);
        }
    }

    draw(ctx, cameraX, cameraY) {
        if (this.isVisible && this.imageLoaded) {
            ctx.drawImage(
                this.image,
                this.x - cameraX,
                this.y - cameraY,
                this.width,
                this.height
            );
        }
    }
    
    afterDragonLeaves() {
        this.addMessage("wowzers... that was a rollercoster huh...");
        
        setTimeout(() => {
            this.addMessage("anyways, she forgot to tell you to stay away from trees during the night");
            
            setTimeout(() => {
                this.addMessage("I honestly prefer to burrow into a hole and stay there...");
                
                setTimeout(() => {
                    if (this.dragon && this.dragon.inputBox) {
                        this.dragon.inputBox.showOptions(
                            "1. okay...",
                            "2. can I come in your hole?",
                            (choice) => this.handleHoleChoice(choice)
                        );
                    }
                }, 2000);
            }, 2500);
        }, 2000);
    }
    
    handleHoleChoice(choice) {
        if (choice === 1) {
            this.addMessage("cool cool, you do you human");
        } else if (choice === 2) {
            this.addMessage("eww...");
        }
        
        setTimeout(() => {
            this.addMessage("anyways, it'll be night time soon...");
            
            setTimeout(() => {
                this.addMessage("I wont be around you then, but you should heed dragon and my warnings");
            }, 2000);
        }, 2000);
    }
}