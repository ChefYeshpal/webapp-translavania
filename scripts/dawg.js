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
        const dialogueBox = document.getElementById('dawgDialogue');
        const dialogueText = document.getElementById('dawgDialogueText');
        
        if (dialogueBox && dialogueText) {
            dialogueText.textContent = "sup human, how's it all goin?";
            dialogueBox.style.display = 'block';
            
            // Show input box for user response
            const inputContainer = document.getElementById('mrBobInput');
            if (inputContainer) {
                inputContainer.style.display = 'flex';
            }
        }
    }

    respondToPlayer(answer) {
        const dialogueBox = document.getElementById('dawgDialogue');
        const dialogueText = document.getElementById('dawgDialogueText');
        
        switch(this.conversationState) {
            case 'initial':
                if (dialogueText) {
                    dialogueText.textContent = "I dont care tbh, but lemme take you somewhere hmm?";
                }
                this.conversationState = 'waiting_for_next';
                break;
                
            case 'waiting_for_next':
                if (dialogueText) {
                    dialogueText.textContent = "eh, follow me aight? we aint going too far";
                }
                this.conversationState = 'moving';
                this.isMoving = true;
                this.moveStartTime = Date.now();
                
                setTimeout(() => {
                    if (dialogueBox) {
                        dialogueBox.style.display = 'none';
                    }
                }, 2000);
                break;
        }
    }

    update() {
        if (this.isMoving) {
            const elapsedTime = Date.now() - this.moveStartTime;
            
            // Spawn dragon at 5 seconds (but keep it quiet)
            if (!this.dragon.hasAppeared && elapsedTime >= 5000) {
                this.dragon.spawn(this.x + 60, this.y - 30);
            }
            
            // Trigger dialogue at 10 seconds
            if (!this.dragonEncounterTriggered && elapsedTime >= 10000) {
                this.dragonEncounterTriggered = true;
                this.isMoving = false;
            
                const dawgDialogueBox = document.getElementById('dawgDialogue');
                const dawgDialogueText = document.getElementById('dawgDialogueText');
                if (dawgDialogueBox && dawgDialogueText) {
                    dawgDialogueText.textContent = "oh hey, looks that's KNOCKOFF HEIDI!!!!";
                    dawgDialogueBox.style.display = 'block';
                }
                
                setTimeout(() => {
                    if (this.dragon) {
                        this.dragon.showDialogue("shut up dog, what's that?");
                        
                        setTimeout(() => {
                            this.dragon.showOptions();
                        }, 2000);
                    }
                }, 1500);
                
                return;
            }
            
            // northeast (positive x, negative y)
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