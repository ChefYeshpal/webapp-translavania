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
        this.dawg = null;
    }
    
    setInputBox(inputBox) {
        this.inputBox = inputBox;
    }
    
    setDawg(dawg) {
        this.dawg = dawg;
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
        const dialogueBox = document.getElementById('unifiedDialogue');
        if (!dialogueBox) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'dragon-message';
        messageElement.textContent = text;
        
        dialogueBox.appendChild(messageElement);
        
        dialogueBox.scrollTop = dialogueBox.scrollHeight;
    }

    hideDialogue() {
        const dialogueBox = document.getElementById('unifiedDialogue');
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
            this.addMessage("who are you? why are you even here huh?");
            this.conversationState = 'greeted';
        } else if (choice === 2) {
            this.addMessage("and... who's that person? what are they doing here?");
            this.conversationState = 'silent';
        }
        
        setTimeout(() => {
            this.addMessage("do you even know what this place has?");
            
            setTimeout(() => {
                if (this.inputBox) {
                    this.inputBox.showOptions(
                        "1. yes",
                        "2. no",
                        (choice) => this.handleKnowledgeChoice(choice)
                    );
                }
            }, 1500);
        }, 2000);
    }
    
    handleKnowledgeChoice(choice) {
        if (choice === 1) {
            window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
        } else if (choice === 2) {
            this.explainTheLand();
        }
    }
    
    explainTheLand() {
        this.addMessage("OH... you should know something then... this land is... cursed, one might say");
        
        setTimeout(() => {
            this.addMessage("there exists a creature which lurks in the darkness");
            
            setTimeout(() => {
                this.addMessage("if it ever calls out to you, never go to it");
                
                setTimeout(() => {
                    this.addMessage("some call it the gritty monster, some call it the t-bagger");
                    
                    setTimeout(() => {
                        this.addMessage("I prefer to call it...");
                        
                        setTimeout(() => {
                            this.enableDarknessMode();
                            
                            setTimeout(() => {
                                this.addMessage("ditty...");
                                
                                setTimeout(() => {
                                    this.addMessage("so human, you better be careful out there in the dark...");
                                    
                                    setTimeout(() => {
                                        this.disableDarknessMode();
                                        this.isVisible = false;
                                        
                                        setTimeout(() => {
                                            if (this.dawg) {
                                                this.dawg.afterDragonLeaves();
                                            }
                                        }, 1000);
                                    }, 3000);
                                }, 2000);
                            }, 1500);
                        }, 2000);
                    }, 2500);
                }, 2500);
            }, 2500);
        }, 2000);
    }
    
    enableDarknessMode() {
        const overlay = document.getElementById('darknessOverlay');
        if (overlay) {
            overlay.style.display = 'block';
        }
    }
    
    disableDarknessMode() {
        const overlay = document.getElementById('darknessOverlay');
        if (overlay) {
            overlay.style.display = 'none';
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
