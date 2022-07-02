import * as PIXI from 'pixi.js';
import { FpsMeter } from './fps_meter';
import { time } from './utils';
import { BaseGame } from './base_game';
import { Keyboard } from './utils/keyboard';
import { Tetromino, ITetrominoType, getRandomTetromino } from './components/tetromino';
import { WIDTH, HEIGHT, TIME_STEP_MS } from './constants';
import type { IUpdatable } from "./types";
import '../css/style.scss';
import { Mouse } from './utils/mouse';
declare var IS_DEBUG: boolean;


export class Game extends BaseGame {
	pieces: Tetromino[] = [];

	public fall_delay = TIME_STEP_MS;
	public active_tetromino: Tetromino;
	public shadow_tetromino: Tetromino;
	public dead_pieces: Tetromino[] = [];

	public mouse: Mouse;
	public keyboard: Keyboard;
	get keys() {
		return this.keyboard.keys;
	}

	public collidesWith(tetromino: Tetromino): boolean {
		for (const piece of this.dead_pieces) {
			if (piece.collidesWith(tetromino)) {
				return true;
			}
		}

		return false;
	}

	constructor(app: PIXI.Application, container: HTMLElement) {
		super(app, container);
		this.keyboard = new Keyboard(window);
		this.mouse = new Mouse(container);
		this.active_tetromino = getRandomTetromino(this);
		this.stage.addChild(this.active_tetromino);

		this.shadow_tetromino = new Tetromino(this, this.active_tetromino.type);
		this.stage.addChild(this.shadow_tetromino);

		// NOTE: if we want to load assets async this is how we'd do it
		// .add('logo', 'images/logo.png')
		// .load(async (_, resources) => {
		// const sprite = new PIXI.Sprite(resources.logo!.texture);

		this.app.loader
			.load(async () => {
				this.ticker.add((delta) => {
					if (!this.active_tetromino.alive) {
						this.dead_pieces.push(this.active_tetromino);
						this.active_tetromino = getRandomTetromino(this);
						this.stage.addChild(this.active_tetromino);

						this.stage.removeChild(this.shadow_tetromino);
						this.shadow_tetromino = new Tetromino(this, this.active_tetromino.type);
						this.stage.addChild(this.shadow_tetromino);
					}

					this.active_tetromino.consumeInputs();
					this.active_tetromino.update(delta);
					this.shadow_tetromino.updateShadow(this.active_tetromino);

					this.renderer.render(app.stage);
				});

				if (IS_DEBUG) {
					const fpsMeter = new FpsMeter(this.container);
					this.ticker.add((_) => {
						fpsMeter.tick(app.ticker.FPS);
					});
					(window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__ && (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
				}

				// only start once everything's ready
				this.app.start();
			});
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

