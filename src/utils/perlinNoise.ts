class PerlinNoise {
    constructor() {
        this.permutation = new Uint8Array(512);
        this.gradient = new Float32Array(512);
        this.initialize();
    }

    initialize() {
        let p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) {
            p[i] = i;
        }
        for (let i = 255; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [p[i], p[j]] = [p[j], p[i]];
        }
        for (let i = 0; i < 512; i++) {
            this.permutation[i] = p[i & 255];
            this.gradient[i] = (Math.random() * 2 - 1) * (Math.random() * 2 - 1);
        }
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(t, a, b) {
        return a + t * (b - a);
    }

    gradient(hash, x, y) {
        const h = hash & 3;
        const u = h < 2 ? x : y;
        const v = h < 2 ? y : x;
        return ((h & 1 ? -u : u) + (h & 2 ? -v : v));
    }

    noise(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        const u = this.fade(x);
        const v = this.fade(y);

        const a = this.permutation[X] + Y;
        const aa = this.permutation[a];
        const ab = this.permutation[a + 1];
        const b = this.permutation[X + 1] + Y;
        const ba = this.permutation[b];
        const bb = this.permutation[b + 1];

        const gradAA = this.gradient[aa];
        const gradAB = this.gradient[ab];
        const gradBA = this.gradient[ba];
        const gradBB = this.gradient[bb];

        const valAA = this.lerp(u, gradAA, gradAB);
        const valAB = this.lerp(u, gradBA, gradBB);
        return (this.lerp(v, valAA, valAB) + 1) / 2;
    }

    generateTerrain(width, height, octaves, persistence, lacunarity) {
        const terrain = new Float32Array(width * height);
        for (let octave = 0; octave < octaves; octave++) {
            const frequency = Math.pow(lacunarity, octave);
            const amplitude = Math.pow(persistence, octave);
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    terrain[x + y * width] += this.noise(x * frequency, y * frequency) * amplitude;
                }
            }
        }
        return terrain;
    }
}

export default PerlinNoise;