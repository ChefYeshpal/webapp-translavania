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
    }

    setDragon(dragon) {
        this.dragon = dragon;
    }

    spawn(x, y) {
        this.x = x;
        this.y = y;
        this.isVisible = true;
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
                        this.dragon.addMessage("shut up dog, what's that?");
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
}