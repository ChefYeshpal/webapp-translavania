class MrBob {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 32;
        this.height = 32;
        this.image = new Image();
        this.image.src = 'assets/mrbobpng.png';
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        this.isVisible = true;
        this.hasAppeared = false;
        this.interactionDistance = 50;
        this.dialogueShown = false;
        this.consoleInstructionShown = false;
        this.conversationState = 'initial';
    }

    respondToPlayer(answer) {
        const lowerAnswer = answer.toLowerCase();
        
        switch(this.conversationState) {
            case 'initial':
                if (lowerAnswer.includes('yes') || lowerAnswer.includes('yeah') || lowerAnswer.includes('lost')) {
                    console.log("Mr. Bob: Oh dear! Well, this forest can be quite confusing. Would you like some help finding your way?");
                    this.conversationState = 'offer_help';
                } else if (lowerAnswer.includes('no') || lowerAnswer.includes('not')) {
                    console.log("Mr. Bob: Ah, just exploring then? That's brave of you. This place has many secrets...");
                    this.conversationState = 'exploring';
                } else {
                    console.log("Mr. Bob: Hmm, I'm not sure I understand. (Try answering with 'yes', 'yeah', 'lost' or 'no', 'not')");
                }
                break;
                
            case 'offer_help':
                if (lowerAnswer.includes('yes') || lowerAnswer.includes('please') || lowerAnswer.includes('help')) {
                    console.log("Mr. Bob: Wonderful! Head north past the big oak tree, then follow the mushrooms. Good luck, traveler!");
                    this.conversationState = 'helped';
                } else if (lowerAnswer.includes('no') || lowerAnswer.includes('nah')) {
                    console.log("Mr. Bob: Suit yourself! But if you change your mind, you know where to find me.");
                    this.conversationState = 'declined_help';
                } else {
                    console.log("Mr. Bob: Hmm, I'm not sure I understand. (Try answering with 'yes', 'please', 'help' or 'no', 'nah')");
                }
                break;
                
            case 'exploring':
                console.log("Mr. Bob: Be careful out here. Not everything is as it seems... Safe travels, friend.");
                this.conversationState = 'ended';
                break;
                
            default:
                const endingDialogues = [
                    "Mr. Bob: I've said all I need to say. Good luck on your journey!",
                    "Mr. Bob: The forest holds many mysteries... perhaps we'll meet again.",
                    "Mr. Bob: I must return to my duties now. Farewell, traveler.",
                    "Mr. Bob: The trees are calling me. Safe travels, friend.",
                    "Mr. Bob: Our conversation has come to an end. May the forest guide you.",
                    "Mr. Bob: I have nothing more to share at this time. Take care out there.",
                    "Mr. Bob: *tips imagginary fedora* Until next time, wanderer."
                ];
                const randomDialogue = endingDialogues[Math.floor(Math.random() * endingDialogues.length)];
                console.log(randomDialogue);
                break;
        }
    }

    spawnBesideNearestTree(trees, player) {
        if (trees.length > 0 && !this.hasAppeared) {
            let nearestTree = null;
            let minDistance = Infinity;
            
            for (const tree of trees) {
                const distance = Math.sqrt(
                    Math.pow(tree.x - player.x, 2) + Math.pow(tree.y - player.y, 2)
                );
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestTree = tree;
                }
            }
            // Does this work? nope. Will I remove this? also nope.
            if (nearestTree) {
                this.x = nearestTree.x + 40;
                this.y = nearestTree.y; 
                this.hasAppeared = true;
            }
        }
    }

    interactWithPlayer(player) {
        const distance = Math.sqrt(
            Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2)
        );

        if (distance < this.interactionDistance) {
            if (!this.consoleInstructionShown) {
                alert("go to inspect (right click) => go to console");
                this.consoleInstructionShown = true;
            } else if (!this.dialogueShown) {
                console.log("Mr. Bob: hello, are you lost?");
                console.log("(Type ans('your answer here') to respond)");
                this.dialogueShown = true;
            }
        }
    }

    update(player, landGen, cameraX, cameraY, canvasWidth, canvasHeight) {
        // Spawn Mr. Bob on first update
        if (!this.hasAppeared) {
            const visibleTrees = [];
            for (const chunkKey in landGen.chunks) {
                const chunk = landGen.chunks[chunkKey];
                for (const item of chunk) {
                    if (item.type.startsWith('tree')) {
                        visibleTrees.push(item);
                    }
                }
            }
            this.spawnBesideNearestTree(visibleTrees, player);
        }
        
        this.interactWithPlayer(player);
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
