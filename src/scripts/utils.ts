import { EPSILON } from "./constants";

export function time(callback: Function, _label: string) {
    // const start = performance.now();
    callback();
    // console.log(`Elapsed for ${label}: ${performance.now() - start}`);
}

export async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getRandomElement<T>(array: T[]): T {
    return array[getRandomBoundedNumber(0, array.length - 1)];
}

// gets a random number within some bounds
export function getRandomBoundedNumber(min: number, max: number) {
    return Math.round(Math.random() * (max - min)) + min;
}

export function collides(a: PIXI.Rectangle, b: PIXI.Rectangle): boolean {
    return (
        // X
        (
            (a.x - b.x < EPSILON && a.x + a.width - b.x > EPSILON)
            ||
            (b.x - a.x < EPSILON && b.x + b.width - a.x > EPSILON)
        )
        &&
        // Y
        (
            (a.y - b.y < EPSILON && a.y + a.height - b.y > EPSILON)
            ||
            (b.y - a.y < EPSILON && b.y + b.height - a.y > EPSILON)
        )
    );
}