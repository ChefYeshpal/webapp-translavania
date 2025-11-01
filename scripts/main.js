const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
const player = new Player(400, 300);
const dawg = new Dawg();
const dragon = new Dragon();
const mrBob = new MrBob();
mrBob.setDawg(dawg);
dawg.setDragon(dragon);
dragon.setDawg(dawg);
const landGen = new LandGenerator();
const inputBox = new InputBox();
inputBox.setMrBob(mrBob);
inputBox.setDragon(dragon);
dragon.setInputBox(inputBox);
let cameraX = player.x - canvas.width / 2;
let cameraY = player.y - canvas.height / 2;
window.player = player;

window.ans = function(answer) {
    mrBob.respondToPlayer(answer);
};

const darknessOverlay = document.getElementById('darknessOverlay');
window.addEventListener('mousemove', (e) => {
    if (darknessOverlay && darknessOverlay.style.display !== 'none') {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        darknessOverlay.style.setProperty('--mouse-x', `${x}px`);
        darknessOverlay.style.setProperty('--mouse-y', `${y}px`);
    }
});

window.addEventListener('keydown', (e) => {
    if (inputBox.isFocused()) {
        return;
    }
    
    player.handleKeyDown(e.key);
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
    
    if (darknessOverlay && darknessOverlay.style.display !== 'none') {
        const rect = canvas.getBoundingClientRect();
        const centerX = rect.left + canvas.width / 2;
        const centerY = rect.top + canvas.height / 2;
        darknessOverlay.style.setProperty('--mouse-x', `${centerX}px`);
        darknessOverlay.style.setProperty('--mouse-y', `${centerY}px`);
    }
});

window.addEventListener('keyup', (e) => {
    if (inputBox.isFocused()) {
        return;
    }
    
    player.handleKeyUp(e.key);
});

function gameLoop() {
    player.update();
    
    cameraX = player.x - canvas.width / 2;
    cameraY = player.y - canvas.height / 2;
    
    if (darknessOverlay && darknessOverlay.style.display !== 'none') {
        const rect = canvas.getBoundingClientRect();
        const screenX = rect.left + canvas.width / 2;
        const screenY = rect.top + canvas.height / 2;
        darknessOverlay.style.setProperty('--mouse-x', `${screenX}px`);
        darknessOverlay.style.setProperty('--mouse-y', `${screenY}px`);
    }
    
    mrBob.update(player, landGen, cameraX, cameraY, canvas.width, canvas.height);
    dawg.update();
    landGen.updateChunks(cameraX, cameraY, canvas.width, canvas.height);
    ctx.fillStyle = '#4a7c2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    landGen.draw(ctx, cameraX, cameraY, canvas.width, canvas.height, player.y);
    player.draw(ctx, cameraX, cameraY);
    dawg.draw(ctx, cameraX, cameraY);
    dragon.draw(ctx, cameraX, cameraY);
    mrBob.draw(ctx, cameraX, cameraY);
    
    requestAnimationFrame(gameLoop);
}

let imagesLoaded = 0;
const totalImages = 10;

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

if (dragon.image.complete) {
    dragon.imageLoaded = true;
    checkImagesLoaded();
} else {
    dragon.image.addEventListener('load', () => {
        dragon.imageLoaded = true;
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
