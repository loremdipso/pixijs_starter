import * as PIXI from 'pixi.js';
import star from "../../images/star.svg";
import type { IUpdatable } from "../types";

export class Spinner extends PIXI.Sprite implements IUpdatable {
    constructor(options: {x: number, y: number, size?: number}) {
        super(PIXI.Texture.from(star));
        this.anchor.set(0.5);
        this.x = options.x;
        this.y = options.y;

        if (options.size) {
            this.width = this.height = options.size;
        }
    }

    update(delta: number) {
        this.rotation += 0.01 * delta;
    }
}
