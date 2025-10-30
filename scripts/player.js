class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.speed = 3;
        this.image = new Image();
        this.image.src = 'assets/player.png';
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };

        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            ArrowUp: false,
            ArrowLeft: false,
            ArrowDown: false,
            ArrowRight: false
        };
    }
    handleKeyDown(key) {
        if (key in this.keys) {
            this.keys[key] = true;
        }
    }
    handleKeyUp(key) {
        if (key in this.keys) {
            this.keys[key] = false;
        }
    }

    clearAllKeys() {
        for (let key in this.keys) {
            this.keys[key] = false;
        }
    }

    update() {
        if (this.keys.w || this.keys.ArrowUp) {
            this.y -= this.speed;
        }
        if (this.keys.s || this.keys.ArrowDown) {
            this.y += this.speed;
        }
        if (this.keys.a || this.keys.ArrowLeft) {
            this.x -= this.speed;
        }
        if (this.keys.d || this.keys.ArrowRight) {
            this.x += this.speed;
        }
    }
    
    draw(ctx, cameraX, cameraY) {
        if (this.imageLoaded) {
            ctx.drawImage(
                this.image,
                this.x - cameraX,
                this.y - cameraY,
                this.width,
                this.height
            );
        } else {
            ctx.fillStyle = 'blue';
            ctx.fillRect (
                this.x - cameraX,
                this.y - cameraY,
                this.width,
                this.height
            );
        }
    }
}