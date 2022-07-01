import * as PIXI from 'pixi.js';
import type { IUpdatable } from "../types";
import { BOARD_WIDTH, BOARD_HEIGHT, SQUARE_SIZE, COLOR_BLUE, COLOR_RED, COLOR_GREEN } from '../constants';

export enum ITetrominoType {
    SQUARE,
}

export class Tetromino extends PIXI.Container implements IUpdatable {
    private squares: Square[] = [];

    constructor(type?: ITetrominoType) {
        super();

        this.addSquare(COLOR_RED, 0, 0);
        this.addSquare(COLOR_GREEN, 1, 1);
        // this.anchor.set(0.5);
        // this.width = this.height = SQUARE_SIZE;
    }

    private addSquare(tint: number, row: number, col: number) {
        const square = new Square(tint, row, col);
        this.squares.push(square);
        this.addChild(square);
    }

    update(delta: number) {
        // this.rotation += 0.01 * delta;
        // this.y += delta;
    }
}

class Square extends PIXI.Sprite {
    constructor(tint: number, public row: number, public col: number) {
        super(PIXI.Texture.WHITE);
        this.tint = tint;
        this.width = this.height = SQUARE_SIZE;
        this.x = SQUARE_SIZE*row;
        this.y = SQUARE_SIZE*col;
    }
}