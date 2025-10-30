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
        this.isMoving = false;
        this.moveSpeed = 1.5;
        this.movingStartTime = 0;
        this.dawwgAppeared = false;
        this.secondChanceGiven = false;
        this.dawg = null;
        this.inputBoxShown = false;
    }

    showInputBox() {
        const inputContainer = document.getElementById('mrBobInput');
        if (inputContainer) {
            inputContainer.style.display = 'flex';
            this.inputBoxShown = true;
            
            // Start dawg dialogue after showing input box
            if (this.dawg && this.conversationState === 'finished') {
                setTimeout(() => {
                    this.dawg.startDialogue();
                }, 500);
            }
        }
    }

    handleInputSubmit() {
        const inputField = document.getElementById('mrBobInputField');
        const answer = inputField.value.trim();
        
        if (answer) {
            if (this.conversationState === 'finished' && this.dawg) {
                console.log(`You: ${answer}`);
                this.dawg.respondToPlayer(answer);
                inputField.value = '';
            } else {
                console.log(`You: ${answer}`);
                this.respondToPlayer(answer);
                inputField.value = '';
            }
        }
    }

    respondToPlayer(answer) {
        const lowerAnswer = answer.toLowerCase();
        
        switch(this.conversationState) {
            case 'initial':
                if (lowerAnswer.includes('yes') || lowerAnswer.includes('yeah') || lowerAnswer.includes('lost')) {
                    console.log("Mr. Bob: Oh dear... this forest can be quite confusing, can't it?");
                    console.log("Mr. Bob: People wander in here all the time... not many find their way out alone.");
                    this.conversationState = 'path1';
                } else if (lowerAnswer.includes('no') || lowerAnswer.includes('not')) {
                    console.log("Mr. Bob: Ah, just exploring then? How... interesting.");
                    console.log("Mr. Bob: Though I wonder... do you truly know where you're going?");
                    this.conversationState = 'path2';
                } else {
                    console.log("Mr. Bob: Hmm, I'm not sure I understand. (Try answering with 'yes', 'yeah', 'lost' or 'no', 'not')");
                }
                break;
                
            case 'path1':
                console.log("Mr. Bob: You know, I've been watching travelers like you for quite some time...");
                console.log("Mr. Bob: I really think I should help you. After all, it would be such a shame if something happened to you out here.");
                this.conversationState = 'final_offer';
                break;
                
            case 'path2':
                console.log("Mr. Bob: This forest... it changes people. Makes them think they're in control when they're not.");
                console.log("Mr. Bob: But don't worry, I can guide you. I know every tree, every shadow...");
                this.conversationState = 'final_offer';
                break;
                
            case 'final_offer':
                if (lowerAnswer.includes('yes') || lowerAnswer.includes('ok') || lowerAnswer.includes('okay')) {
                    console.log("Mr. Bob: Excellent... I knew you'd see things my way.");
                    console.log("Mr. Bob: Well then! How about you follow me...");
                    this.conversationState = 'moving';
                    this.isMoving = true;
                    this.movingStartTime = Date.now();
                } else {
                    console.log("Mr. Bob: So, I'll help you, please? It'll be my pleasure...");
                    console.log("Mr. Bob: You don't really have much of a choice, do you?");
                }
                break;
                
            case 'moving':
                const endingDialogues = [
                    "Mr. Bob: Just a bit further now...",
                    "Mr. Bob: The path reveals itself to those who follow...",
                    "Mr. Bob: You're doing wonderfully...",
                    "Mr. Bob: We're almost there...",
                    "Mr. Bob: Trust me, just keep following..."
                ];
                const randomDialogue = endingDialogues[Math.floor(Math.random() * endingDialogues.length)];
                console.log(randomDialogue);
                break;
                
            case 'introduce_dawwg':
                if (lowerAnswer.includes('yes') || lowerAnswer.includes('yeah') || lowerAnswer.includes('okay') || lowerAnswer.includes('aight')) {
                    console.log("Mr. Bob: Cool, she'll protect you.");
                    this.isVisible = false;
                    this.conversationState = 'finished';
                    // this is for that VERY SPECIFIC BUX FIX where the users avatar keeps going forwards even after the dialogue box closes, DO NOT DELETE THIS
                    if (window.player) {
                        window.player.clearAllKeys();
                    }
                    alert("you should close the console now, it's getting kinda clunky isn't it?");
                    if (window.player) {
                        window.player.clearAllKeys();
                    }
                    this.showInputBox();
                } else if (lowerAnswer.includes('nah') || lowerAnswer.includes('nope') || lowerAnswer.includes('no way')) {
                    if (!this.secondChanceGiven) {
                        console.log("Mr. Bob: You know what? Fuck you, I ain't gonna help you no more if you don't respect her GOT IT?");
                        this.secondChanceGiven = true;
                    } else {
                        console.log("Mr. Bob: You ungrateful little shit. We're done here.");
                        this.conversationState = 'left';
                        this.isVisible = false;
                        if (this.dawg) {
                            this.dawg.hide();
                        }
                    }
                } else {
                    console.log("Mr. Bob: I need an answer. Will you respect Mrs. Dawwg? (Try 'yes', 'yeah', 'okay', 'aight' or 'nah', 'nope', 'no way')");
                }
                break;
                
            default:
                console.log("Mr. Bob: Our time together has been... enlightening.");
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
                player.clearAllKeys(); 
                alert("go to inspect (right click) => go to console");
                player.clearAllKeys();
                this.consoleInstructionShown = true;
            } else if (!this.dialogueShown) {
                console.log("Mr. Bob: hello, are you lost?");
                console.log("(Type ans('your answer here') to respond)");
                this.dialogueShown = true;
            }
        }
    }

    setDawg(dawg) {
        this.dawg = dawg;
    }

    update(player, landGen, cameraX, cameraY, canvasWidth, canvasHeight) {
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
        
        if (this.isMoving) {
            if (!this.dawwgAppeared && Date.now() - this.movingStartTime >= 8000) {
                this.isMoving = false;
                this.dawwgAppeared = true;
                if (this.dawg) {
                    this.dawg.spawn(this.x + 50, this.y);
                }
                console.log("Mr. Bob: This is Mrs. Dawwg. She is a very nice dog, and she will always protect you.");
                console.log("Mr. Bob: DO NOT do a no-no touch on her, otherwise I WILL touch you.");
                this.conversationState = 'introduce_dawwg';
            } else if (this.isMoving) {
                this.x += this.moveSpeed * Math.cos(Math.PI / 4);
                this.y -= this.moveSpeed * Math.sin(Math.PI / 4);
            }
        } else if (!this.dawwgAppeared) {
            this.interactWithPlayer(player);
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
