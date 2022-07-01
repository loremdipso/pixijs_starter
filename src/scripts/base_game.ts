import * as PIXI from 'pixi.js';

export class BaseGame {
    constructor(protected app: PIXI.Application, protected container: HTMLElement) {

    }

	get width(): number {
		return this.app.renderer.width;
	}

	get height(): number {
		return this.app.renderer.height;
	}

	get ticker(): PIXI.Ticker {
		return this.app.ticker;
	}

	get renderer(): PIXI.Renderer {
		return this.app.renderer;
	}

	get stage(): PIXI.Container {
		return this.app.stage;
	}
}