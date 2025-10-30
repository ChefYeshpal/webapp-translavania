const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
const player = new Player(400, 300);
const dawg = new Dawg();
const mrBob = new MrBob();
mrBob.setDawg(dawg);
const landGen = new LandGenerator();
let cameraX = player.x - canvas.width / 2;
let cameraY = player.y - canvas.height / 2;
window.player = player;

// Ans function, they gotta use this to answer hehehehehehe
window.ans = function(answer) {
    mrBob.respondToPlayer(answer);
};

window.addEventListener('keydown', (e) => {
    player.handleKeyDown(e.key);
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
});

window.addEventListener('keyup', (e) => {
    player.handleKeyUp(e.key);
});

function gameLoop() {
    player.update();
    
    // center cam on player
    cameraX = player.x - canvas.width / 2;
    cameraY = player.y - canvas.height / 2;
    mrBob.update(player, landGen, cameraX, cameraY, canvas.width, canvas.height);
    landGen.updateChunks(cameraX, cameraY, canvas.width, canvas.height);
    ctx.fillStyle = '#4a7c2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    landGen.draw(ctx, cameraX, cameraY, canvas.width, canvas.height, player.y);
    player.draw(ctx, cameraX, cameraY);
    dawg.draw(ctx, cameraX, cameraY);
    mrBob.draw(ctx, cameraX, cameraY);
    
    requestAnimationFrame(gameLoop);
}

let imagesLoaded = 0;
const totalImages = 9;

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded >= totalImages) {
        gameLoop();
    }
}

if (player.image.complete) {
    player.imageLoaded = true;
    checkImagesLoaded();
} else {
    player.image.addEventListener('load', () => {
        player.imageLoaded = true;
        checkImagesLoaded();
    });
}

if (mrBob.image.complete) {
    mrBob.imageLoaded = true;
    checkImagesLoaded();
} else {
    mrBob.image.addEventListener('load', () => {
        mrBob.imageLoaded = true;
        checkImagesLoaded();
    });
}

if (dawg.image.complete) {
    dawg.imageLoaded = true;
    checkImagesLoaded();
} else {
    dawg.image.addEventListener('load', () => {
        dawg.imageLoaded = true;
        checkImagesLoaded();
    });
}

Object.values(landGen.images).forEach(img => {
    if (img.complete) {
        checkImagesLoaded();
    } else {
        img.addEventListener('load', checkImagesLoaded);
    }
});

// Input box
const mrBobOkButton = document.getElementById('mrBobOkButton');
const mrBobInputField = document.getElementById('mrBobInputField');

mrBobOkButton.addEventListener('click', () => {
    mrBob.handleInputSubmit();
});

mrBobInputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        mrBob.handleInputSubmit();
    }
});
