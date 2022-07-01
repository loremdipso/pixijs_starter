import * as PIXI from 'pixi.js';
import { FpsMeter } from './fps_meter';
import { time } from './utils';
import { BaseGame } from './base_game';
import { Keyboard } from './utils/keyboard';
import { Tetromino, ITetrominoType } from './components/tetromino';
import { WIDTH, HEIGHT } from './constants';
import type { IUpdatable } from "./types";
import '../css/style.scss';
declare var IS_DEBUG: boolean;


class Game extends BaseGame {
	pieces: Tetromino[] = [];

	private keyboard: Keyboard;

	constructor(app: PIXI.Application, container: HTMLElement) {
		super(app, container);
		this.keyboard = new Keyboard(window);

		// NOTE: if we want to load assets async this is how we'd do it
		// .add('logo', 'images/logo.png')
		// .load(async (_, resources) => {
		// const sprite = new PIXI.Sprite(resources.logo!.texture);

		this.app.loader
			.load(async () => {
				// const NUM_COLS = 10;
				// const NUM_ROWS = 10;

				// const spinner_width = this.width / NUM_COLS;
				// const spinner_height = this.height / NUM_ROWS;
				// const spinner_size = Math.min(spinner_width, spinner_height);

				// for (let c = 0; c < NUM_COLS; c++) {
				// 	for (let r = 0; r < NUM_ROWS; r++) {
				// 		this.addUpdatable(new Spinner({
				// 			x: spinner_width * c + spinner_width/2.0,
				// 			y: spinner_height * r + spinner_height/2.0,
				// 			size: spinner_size,
				// 		}));
				// 	}
				// }
				// this.addUpdatable(new Tetromino(ITetrominoType.SQUARE));
				// const active_tetromino = new Tetromino(ITetrominoType.L);
				// const active_tetromino = new Tetromino(ITetrominoType.SQUARE);
				const active_tetromino = new Tetromino(ITetrominoType.T);
				this.addUpdatable(active_tetromino);

				this.ticker.add((delta) => {
					time(() => {
						for (const child of this.updatable) {
							child.update(delta);
						}
					}, "updates");
					time(() => {
						this.renderer.render(app.stage);
					}, "rrender")
				});

				if (IS_DEBUG) {
					const fpsMeter = new FpsMeter(this.container);
					this.ticker.add((_) => {
						fpsMeter.tick(app.ticker.FPS);
					});
				}

				// only start once everything's ready
				this.app.start();
			});
	}

	private updatable: IUpdatable[] = [];
	addUpdatable(child: IUpdatable & PIXI.DisplayObject) {
		this.updatable.push(child);
		this.stage.addChild(child);
	}
}

(() => {
	const app = new PIXI.Application({
		autoStart: false,
		width: WIDTH,
		height: HEIGHT,
		antialias: true
	});

	const container = document.getElementById('game');
	if (!container) {
		throw new Error("'game' container doesn't exist. Exiting.");
	}

	// make extra sure the container is empty
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}

	container.appendChild(app.view);
	new Game(app, container);
})();

