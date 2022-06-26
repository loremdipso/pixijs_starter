import * as PIXI from 'pixi.js'
import { FpsMeter } from './fps_meter';

const app = new PIXI.Application({
    width: 800,
    height: 450,
    antialias: true
});
app.ticker.maxFPS = 30;

const container = document.getElementById('game') || document.body;
container.appendChild(app.view);

let fpsMeter: FpsMeter;
const sprite = PIXI.Sprite.from('images/logo.png');

window.onload = load;

function load() {
    create();
}

function create() {
    /* Sprite */
    sprite.anchor.set(0.5);
    sprite.x = app.renderer.width / 2;
    sprite.y = app.renderer.height / 2;
    app.stage.addChild(sprite);

    /* FPS */
    fpsMeter = new FpsMeter(container);

    app.ticker.add(update);
}

function update(time: number) {
    fpsMeter.tick(app.ticker.FPS);
    sprite.rotation += 0.01 * time;
    app.renderer.render(app.stage);
}