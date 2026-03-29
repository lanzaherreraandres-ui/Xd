// block.ts

export type BlockType = 'solid' | 'liquid' | 'gas';

export class Block {
    type: BlockType;
    position: { x: number; y: number; z: number; };

    constructor(type: BlockType, position: { x: number; y: number; z: number; }) {
        this.type = type;
        this.position = position;
    }

    getType(): BlockType {
        return this.type;
    }

    getPosition() {
        return this.position;
    }
}