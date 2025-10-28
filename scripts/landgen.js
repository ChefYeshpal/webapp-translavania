class LandGenerator {
    constructor() {
        this.objects=[];
        this.chunkSize = 800;
        this.loadedChunks = new Set();
        this.images = {
            tree1: this.loadImage('assets/tree1.png'),
            tree2: this.loadImage('assets/tree2.png'),
            tree3: this.loadImage('assets/tree3.png'),
            bush1: this.loadImage('assets/bush1.png'),
            bush2: this.loadImage('assets/bush2.png'),
            grass: this.loadImage('assets/grass.png')
        };
    }

    loadImage(src) {
        const img = new Image();
        img.src = src;
        return img;
    }

    // SEED!!! (just a num gen for consistent chunks)
    seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }
    getChunkKey(chunkX, chunkY) {
        return `${chunkX},${chunkY}`;
    }
    generateChunk(chunkX, chunkY) {
        const key = this.getChunkKey(chunkX, chunkY);
        if (this.lloadedChunks.has(key)) {
            return;
        }
        this.loadedChunks.add(key);
        const startX = chunkX * this.chunkSize;
        const startY = chunkY * this.chunkSize;
        const seed = chunkX * 1000 + chunkY;

        // Forests
        const treeCount = 15 + Math.floor(this.seededRandom(seed) * 10);
        for (let i = 0; i < treeCount; i++) {
            const treeSeed = seed + i * 100;
            const x = startX + this.seededRandom(treeSeed) * this.chunkSize;
            const y = startY + this.seededRandom(treeSeed + 1) * this.chunkSize;
            const treeType = Math.floor(this.seededRandom(treeSeed + 2) * 3) + 1;
            this.objects.push({
                x: x,
                y: y,
                width: 48,
                height: 64,
                image:this.images[`tree${treeType}`],
                type:'tree',
                sortY: y + 54
            });
        }

        // Bushes
        const bushCount = 20 + Math.floor(this.seededRandom(seed + 500) * 15);
        for (let i = 0; i < bushCount; i++) {
            const bushSeed = seed + 500 + i * 100;
            const x = startX + this.seededRandom(bushSeed) * this.chunkSize;
            const y = startY + this.seededRandom(bushSeed + 1) * this.chunkSize;
            const bushType = Math.floor(this.seededRandom(bushSeed + 2) * 2) + 1;
            this.objects.push({
                x: x,
                y: y,
                width: 32,
                height: 24,
                image: this.images[`bush${bushType}`],
                sortY: y + 24
            });
        }
    }
}