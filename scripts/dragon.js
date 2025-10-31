class Dragon {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 64;
        this.height = 64;
        this.image = new Image();
        this.image.src = 'assets/dragon.png';
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        this.isVisible = false;
        this.hasAppeared = false;
        this.conversationState = 'initial';
        this.inputBox = null;
    }
    
    setInputBox(inputBox) {
        this.inputBox = inputBox;
    }

    spawn(x, y) {
        this.x = x;
        this.y = y;
        this.isVisible = true;
        this.hasAppeared = true;
    }

    showDialogue(text) {
        this.addMessage(text);
    }
    
    addMessage(text) {
        const dialogueBox = document.getElementById('dragonDialogue');
        if (!dialogueBox) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'dragon-message';
        messageElement.textContent = text;
        
        dialogueBox.appendChild(messageElement);
        
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5300);
    }

    hideDialogue() {
        const dialogueBox = document.getElementById('dragonDialogue');
        if (dialogueBox) {
            dialogueBox.style.display = 'none';
        }
    }
    
    showOptions() {
        if (this.inputBox) {
            this.inputBox.showOptions(
                "1. hi there!",
                "2. stay silent...",
                (choice) => this.handleChoice(choice)
            );
        }
    }
    
    handleChoice(choice) {
        if (choice === 1) {
            this.addMessage("who are you? why are you evne here huh?");
            this.conversationState = 'greeted';
        } else if (choice === 2) {
            this.addMessage("and... who's that person? what are they doing here?");
            this.conversationState = 'silent';
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
