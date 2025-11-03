const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
const player = new Player(400, 300);
const dawg = new Dawg();
const dragon = new Dragon();
const mrBob = new MrBob();
const chungus = new Chungus();
const landGen = new LandGenerator();
const inputBox = new InputBox();

// Set up relationships cause I aint getting any anytime soon :')
mrBob.setDawg(dawg);
dawg.setDragon(dragon);
dragon.setDawg(dawg);
dawg.setPlayer(player);
chungus.setPlayer(player);
chungus.setDawg(dawg);
chungus.setInputBox(inputBox);
chungus.setMrBob(mrBob);
inputBox.setMrBob(mrBob);
inputBox.setDragon(dragon);
dragon.setInputBox(inputBox);

let cameraX = player.x - canvas.width / 2;
let cameraY = player.y - canvas.height / 2;
window.player = player;

let isDarkMode = false;
let lastFrameTime = Date.now();
let gamePaused = false;

window.pauseGame = function() {
    gamePaused = true;
};

window.resumeGame = function() {
    gamePaused = false;
};

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
    const currentTime = Date.now();
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    
    // Only update game logic if not paused
    if (!gamePaused) {
        player.update();
        if (dawg.shouldFollow) dawg.followPlayer();
        chungus.update(deltaTime, isDarkMode);
        
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
    }
    
    // Always draw, even when paused
    ctx.fillStyle = '#4a7c2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    landGen.draw(ctx, cameraX, cameraY, canvas.width, canvas.height, player.y);
    player.draw(ctx, cameraX, cameraY);
    dawg.draw(ctx, cameraX, cameraY);
    dragon.draw(ctx, cameraX, cameraY);
    mrBob.draw(ctx, cameraX, cameraY);
    chungus.draw(ctx, cameraX, cameraY);
    
    requestAnimationFrame(gameLoop);
}

window.startDarkening = function(options = {}) {
    // options: { maxLevel: number(0..1), speed: ms increment interval, onComplete: fn }
    if (!darknessOverlay) return;
    const maxLevel = (typeof options.maxLevel === 'number') ? Math.max(0, Math.min(1, options.maxLevel)) : 0.6;
    const speed = options.speed || 120;
    const onComplete = options.onComplete;

    darknessOverlay.style.display = 'block';
    darknessOverlay.style.setProperty('--darkness-level', '0');
    let level = 0;
    const interval = setInterval(() => {
        level += 0.02;
        if (level >= maxLevel) level = maxLevel;
        darknessOverlay.style.setProperty('--darkness-level', String(level));
        if (level >= maxLevel) {
            clearInterval(interval);
            isDarkMode = true;
            chungus.startSpawnTimer();
            if (typeof onComplete === 'function') onComplete();
        }
    }, speed);
    return () => clearInterval(interval); 
};

window.setDarknessLevel = function(targetLevel = 0.45, speed = 120, onComplete) {
    if (!darknessOverlay) return;
    darknessOverlay.style.display = 'block';
    const current = parseFloat(getComputedStyle(darknessOverlay).getPropertyValue('--darkness-level')) || 0;
    let level = current;
    const step = 0.02;
    const increasing = targetLevel > current;

    const interval = setInterval(() => {
        if (increasing) {
            level += step;
            if (level >= targetLevel) level = targetLevel;
        } else {
            level -= step;
            if (level <= targetLevel) level = targetLevel;
        }
        darknessOverlay.style.setProperty('--darkness-level', String(level));
        if (level === targetLevel) {
            clearInterval(interval);
            if (targetLevel === 0) {
                darknessOverlay.style.display = 'none';
                isDarkMode = false;
            } else if (targetLevel > 0.3) {
                isDarkMode = true;
            }
            if (typeof onComplete === 'function') onComplete();
        }
    }, speed);
    return () => clearInterval(interval);
};

let imagesLoaded = 0;
const totalImages = 11;

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

if (chungus.image.complete) {
    chungus.imageLoaded = true;
    checkImagesLoaded();
} else {
    chungus.image.addEventListener('load', () => {
        chungus.imageLoaded = true;
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
