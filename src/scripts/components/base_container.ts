import * as PIXI from 'pixi.js';
import { COLOR_GREEN } from '../constants';

export interface IBaseContainerOptions {
    draw_bounding_boxes?: boolean;
}

export class BaseContainer extends PIXI.Container {
    constructor(private options: IBaseContainerOptions = {}) {
        super();
    }

    addChild<TChildren extends PIXI.DisplayObject[]>(...children: TChildren): TChildren[0] {
        const returnValue = super.addChild(...children);

        if (this.options.draw_bounding_boxes) {
            for (const child of children) {
                const bounds = child.getLocalBounds();

                const box = new PIXI.Graphics();
                box.beginFill(COLOR_GREEN, 0.2);
                box.drawRect(
                    bounds.x,
                    bounds.y,
                    bounds.width,
                    bounds.height
                );
                console.log(bounds);
                super.addChild(box);
            }
        }

        return returnValue;
    }
}