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
    }

    spawn(x, y) {
        this.x = x;
        this.y = y;
        this.isVisible = true;
    }

    hide() {
        this.isVisible = false;
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