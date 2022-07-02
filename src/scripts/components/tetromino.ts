import * as PIXI from 'pixi.js';
import type { IUpdatable } from "../types";
import { NUM_ROWS, BOARD_WIDTH, BOARD_HEIGHT, SQUARE_SIZE, COLOR_BLUE, COLOR_RED, COLOR_WHITE, COLOR_GREEN, EPSILON } from '../constants';
import { Game } from '../app';
import { collides, getRandomElement } from '../utils';

export enum ITetrominoType {
    TEST,
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
    positions: { row: number, col: number }[];
}

const SHAPES: { [key: number]: IShape } = {
    [ITetrominoType.TEST]: {
        color: COLOR_GREEN,
        size: 1,
        positions: [
            { row: 0, col: 0 },
        ]
    },

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
        color: COLOR_BLUE,
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

const tetrominos = [
    ITetrominoType.I,
    ITetrominoType.L,
    ITetrominoType.REVERSE_L,
    ITetrominoType.REVERSE_S,
    ITetrominoType.SQUARE,
    ITetrominoType.S,
    ITetrominoType.T,
];

export function getRandomTetromino(game: Game): Tetromino {
    return new Tetromino(game, getRandomElement(tetrominos));
}

export class Tetromino extends PIXI.Container implements IUpdatable {
    private squares: Square[] = [];
    private last_step = 0;
    private last_move = false;
    public alive = true;

    constructor(private game: Game, public type: ITetrominoType) {
        super();

        this.last_step = performance.now();

        const shape = SHAPES[type];
        for (const pos of shape.positions) {
            this.addSquare(pos.row, pos.col, shape.color);
        }

        const delta = SQUARE_SIZE * (shape.size / 2);
        this.position.set(delta, delta);
        this.pivot.set(delta, delta);
    }

    private addSquare(row: number, col: number, color: number) {
        const square = new Square(row, col, color)
        this.squares.push(square);
        this.addChild(square);
    }

    update(delta: number) {
        if (this.alive) {
            const now = performance.now();
            if (now - this.last_step > this.game.fall_delay) {
                this.last_step = now;
                this.outOfBounds();
                if (!this.moveDown()) {
                    this.alive = false;
                }
            }
        }
    }

    updateShadow(real: Tetromino) {
        this.angle = real.angle;
        this.x = real.x;
        this.y = real.y;
        this.slamDown();
        this.alpha = 0.5;
    }

    consumeInputs() {
        if (this.game.keys.right.repeatableTrigger()) {
            this.moveRight();
        } else if (this.game.keys.left.repeatableTrigger()) {
            this.moveLeft();
        }

        if (this.game.keys.up.trigger()) {
            this.rotateLeft();
        } else if (this.game.keys.down.repeatableTrigger()) {
            this.moveDown();
        }

        if (this.game.keys.space.trigger()) {
            this.slamDown();
        }
    }

    collidesWith(other: Tetromino): boolean {
        for (const child of this.squares) {
            const childPosition = child.getBounds();
            for (const otherChild of other.squares) {
                const otherChildPosition = otherChild.getBounds();
                if (collides(childPosition, otherChildPosition)) {
                    return true;
                }
            }
        }
        return false;
    }

    rotateRight() {
        this.rotate(-90);
    }

    rotateLeft() {
        this.rotate(90);
    }

    rotate(delta: number) {
        const oldAngle = this.angle;
        this.angle = (this.angle + delta) % 360;
        if (this.outOfBounds()) {
            // try moving left or right and trying again
            if (this.moveRight() || this.moveLeft()) {
                return true;
            }

            // otherwise we're done, undo
            this.angle = oldAngle;
            return false;
        }
        return true;
    }

    moveRight() {
        this.x += SQUARE_SIZE;
        if (this.outOfBounds()) {
            this.x -= SQUARE_SIZE;
            return false;
        }
        return true;
    }

    moveLeft() {
        this.x -= SQUARE_SIZE;
        if (this.outOfBounds()) {
            this.x += SQUARE_SIZE;
            return false;
        }
        return true;
    }

    moveDown() {
        this.y += SQUARE_SIZE;
        if (this.outOfBounds()) {
            this.y -= SQUARE_SIZE;
            return false;
        }
        return true;
    }

    slamDown() {
        while (true) {
            this.y += SQUARE_SIZE;
            if (this.outOfBounds()) {
                this.y -= SQUARE_SIZE;
                this.alive = false;
                return;
            }
        }
    }

    outOfBounds() {
        for (const child of this.children) {
            const position = child.getBounds();
            if (position.y + position.height > BOARD_HEIGHT) {
                return true;
            }
            if (position.x < -EPSILON) {
                return true;
            }
            if (position.x + position.width > BOARD_WIDTH + EPSILON) {
                return true;
            }
        }

        if (this.game.collidesWith(this)) {
            return true;
        }

        return false;
    }
}

let NAME = 0;
class Square extends PIXI.Graphics {
    constructor(row: number, col: number, color: number) {
        super();
        this.beginFill(color);

        // set the line style to have a width of 5 and set the color to red
        this.lineStyle(5, COLOR_WHITE, 1 /* ALPHA */, 0 /* ALIGNMENT */);

        this.x = col*SQUARE_SIZE;
        this.y = row*SQUARE_SIZE;
        this.width = this.height = SQUARE_SIZE;

        // draw a rectangle
        this.drawRect(0, 0, SQUARE_SIZE, SQUARE_SIZE);
    }
}