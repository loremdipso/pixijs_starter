import * as PIXI from 'pixi.js'
import { FpsMeter } from './components/FpsMeter';
import { Spinner } from './components/Spinner';
import '../css/style.scss';

declare var IS_DEBUG: boolean;

const app = new PIXI.Application({
    autoStart: false,
    // TODO: this value matters a lot
    width: 800,
    height: 450,
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


const updatable: IUpdatable[] = [];

function addUpdatable(child: IUpdatable & PIXI.DisplayObject) {
    updatable.push(child);
    app.stage.addChild(child);
}

function time(callback: Function, _label: string) {
    // const start = performance.now();
    callback();
    // console.log(`Elapsed for ${label}: ${performance.now() - start}`);
}

// NOTE: if we want to load assets async this is how we'd do it
    // .add('logo', 'images/logo.png')
    // .load(async (_, resources) => {
        // const sprite = new PIXI.Sprite(resources.logo!.texture);

app.loader
    .load(async () => {
        const NUM_COLS = 10;
        const NUM_ROWS = 10;
        const width = app.renderer.width;
        const height = app.renderer.height;

        const spinner_width = width / NUM_COLS;
        const spinner_height = height / NUM_ROWS;
        const spinner_size = Math.min(spinner_width, spinner_height);

        for (let c = 0; c < NUM_COLS; c++) {
            for (let r = 0; r < NUM_ROWS; r++) {
                addUpdatable(new Spinner({
                    x: spinner_width * c + spinner_width/2.0,
                    y: spinner_height * r + spinner_height/2.0,
                    size: spinner_size,
                }));
            }
        }

        app.ticker.add((delta) => {
            time(() => {
                for (const child of updatable) {
                    child.update(delta);
                }
            }, "updates");
            time(() => {
                app.renderer.render(app.stage);
            }, "rrender")
        });

        if (IS_DEBUG) {
            const fpsMeter = new FpsMeter(container);
            app.ticker.add((_) => {
                fpsMeter.tick(app.ticker.FPS);
            });
        }

        // only start once everything's ready
        app.start();
    });
