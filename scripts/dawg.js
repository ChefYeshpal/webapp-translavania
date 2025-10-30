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
                if (dialogueBox) {
                    dialogueBox.style.display = 'none';
                }
                break;
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