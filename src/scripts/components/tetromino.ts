import * as PIXI from 'pixi.js';
import type { IUpdatable } from "../types";
import { NUM_ROWS, BOARD_WIDTH, BOARD_HEIGHT, SQUARE_SIZE, COLOR_BLUE, COLOR_RED, COLOR_GREEN, TIME_STEP_MS } from '../constants';
import { keys } from '../utils/keyboard';

export enum ITetrominoType {
    I,
    L,
    SQUARE,
    REVERSE_L,
    S,
    REVERSE_S,
    T,
}

interface IShape {
    color: number;
    size: number;
    positions: {row: number, col: number}[];
}

const SHAPES: { [key: number]: IShape } = {
    [ITetrominoType.I]: {
        color: COLOR_GREEN,
        size: 4,
        positions: [
            { row: 0, col: 1 },
            { row: 1, col: 1 },
            { row: 2, col: 1 },
            { row: 3, col: 1 },
        ]
    },

    [ITetrominoType.L]: {
        color: COLOR_RED,
        size: 3,
        positions: [
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 0, col: 2 },
        ]
    },

    [ITetrominoType.SQUARE]: {
        color: COLOR_GREEN,
        size: 2,
        positions: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 1, col: 0 },
            { row: 1, col: 1 },
        ]
    },

    [ITetrominoType.REVERSE_L]: {
        color: COLOR_GREEN,
        size: 3,
        positions: [
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 0, col: 0 },
        ]
    },

    [ITetrominoType.S]: {
        color: COLOR_RED,
        size: 3,
        positions: [
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
        ]
    },

    [ITetrominoType.REVERSE_S]: {
        color: COLOR_RED,
        size: 3,
        positions: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
        ]
    },

    [ITetrominoType.T]: {
        color: COLOR_BLUE,
        size: 3,
        positions: [
            { row: 0, col: 1 },
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
        ]
    },
}

export class Tetromino extends PIXI.Container implements IUpdatable {
    private squares: Square[] = [];
    private last_step = 0;

    constructor(type: ITetrominoType) {
        super();
        this.last_step = performance.now();

        const shape = SHAPES[type];
        for (const pos of shape.positions) {
            this.addSquare(COLOR_RED, pos.row, pos.col);
        }

        const delta = SQUARE_SIZE * (shape.size / 2);
        this.position.set(delta, delta);
        this.pivot.set(delta, delta);
    }

    private addSquare(tint: number, row: number, col: number) {
        const square = new Square(tint, row, col);
        this.squares.push(square);
        this.addChild(square);
    }

    update(delta: number) {
        const now = performance.now();
        if (now - this.last_step > TIME_STEP_MS) {
            this.y += SQUARE_SIZE
            this.last_step = now;
        }

        if (keys.right.trigger()) {
            this.moveRight();
        } else if (keys.left.trigger()) {
            this.moveLeft();
        }

        if (keys.up.trigger()) {
            this.rotateRight();
        } else if (keys.down.trigger()) {
            this.moveDown();
        }
    }

    rotateRight() {
        this.angle = (this.angle + 90) % 360;
    }

    rotateLeft() {
        this.angle = (this.angle - 90) % 360;
    }

    moveRight() {
        this.x += SQUARE_SIZE;
    }

    moveLeft() {
        this.x -= SQUARE_SIZE;
    }

    moveDown() {
        this.y += SQUARE_SIZE;
    }
}

class Square extends PIXI.Sprite {
    constructor(tint: number, public row: number, public col: number) {
        super(PIXI.Texture.WHITE);
        this.tint = tint;
        this.width = this.height = SQUARE_SIZE;
        this.y = SQUARE_SIZE*row;
        this.x = SQUARE_SIZE*col;
    }
}