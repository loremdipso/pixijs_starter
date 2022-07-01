import { REPEAT_DELAY_MS, INITIAL_REPEAT_DELAY_MS } from '../constants';

class Key {
    private pressed = false;
    private repeatsCount = 0;
    private repeatTimer = 0;

    constructor(protected code: string) {
    }
    
    /**
     * Update repeat counters and check if action should be triggered
     * @returns {boolean} true if action should be triggered
     */
    trigger(): boolean {
        if (this.pressed) {
            this.repeatTimer--;
            if (this.repeatTimer <= 0) {
                this.repeatTimer = (this.repeatsCount > 0)
                    ? REPEAT_DELAY_MS
                    : INITIAL_REPEAT_DELAY_MS;
                this.repeatsCount++;
                return true;
            }
        }
        return false;
    }
    
    onPress() {
        this.pressed = true;
    }
    
    onRelease() {
        this.pressed = false;
        this.repeatTimer = 0;
        this.repeatsCount = 0;
    }
}

export const keys = {
    escape: new Key('Escape'),
    space: new Key(' '),
    left: new Key('ArrowLeft'),
    up: new Key('ArrowUp'),
    right: new Key('ArrowRight'),
    shift: new Key('Shift'),
    down: new Key('ArrowDown'),
};


/**
 * Handles keyboard controls for known keys
 * 
 * This class could be more generic, but its not needed for this game.
 */
export class Keyboard {
    private key_map: any = {};

    constructor(container: Window) {
        for (const k in keys) {
            if (keys.hasOwnProperty(k)) {
                const v = (keys as any)[k];
                this.key_map[v.code] = v;
            }
        }

        container.addEventListener('keydown', (evt: KeyboardEvent) => {
            const key = (this.key_map as any)[evt.key];
            if (key) {
                key.onPress();
            }
        });

        container.addEventListener('keyup', (evt: KeyboardEvent) => {
            const key = (this.key_map as any)[evt.key];
            if (key) {
                key.onRelease();
            }
        });
    }
}
