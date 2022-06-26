import * as PIXI from 'pixi.js'
import { FpsMeter } from './fps_meter';

const app = new PIXI.Application({
    autoStart: false,
    width: 800,
    height: 450,
    antialias: true
});

app.loader
    .add('logo', 'images/logo.png')
    .load(async (_, resources) => {
        const sprite = new PIXI.Sprite(resources.logo!.texture);

        // Sprite
        sprite.anchor.set(0.5);
        sprite.x = app.renderer.width / 2;
        sprite.y = app.renderer.height / 2;
        app.stage.addChild(sprite);

        const container = document.getElementById('game');
        if (!container) {
            throw new Error("game container doesn't exist. Exiting.");
        }

        // make extra sure the container is empty
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(app.view);

        const fpsMeter = new FpsMeter(container);

        app.ticker.add((delta) => {
            fpsMeter.tick(app.ticker.FPS);
            sprite.rotation += 0.1 * delta;
            app.renderer.render(app.stage);
        });

        // only start once everything's ready
        app.start();
    });