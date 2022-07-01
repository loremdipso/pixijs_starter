import { REPEAT_DELAY_MS, INITIAL_REPEAT_DELAY_MS } from '../constants';

class Key {
    private pressed = false;
    private released = true;
    private repeatsCount = 0;
    private repeatTimer = 0;

    constructor(protected code: string) {
    }
    // Eats the event. Key must be released and then pressed to trigger again
    trigger(): boolean {
        if (this.pressed) {
            this.pressed = false;
            return true;
        }
        return false;
    }
    
    // Can fire multiple times for the same event. Has a short delay between.
    repeatableTrigger(): boolean {
        if (this.pressed) {
            this.repeatTimer--;
            if (this.repeatTimer <= 0) {
                this.repeatTimer = this.repeatsCount > 0
                    ? REPEAT_DELAY_MS
                    : INITIAL_REPEAT_DELAY_MS;
                this.repeatsCount++;
                return true;
            }
        }
        return false;
    }
    
    onPress() {
        if (this.released) {
            this.pressed = true;
            this.released = false;
        }
    }
    
    onRelease() {
        this.pressed = false;
        this.released = true;
        this.repeatTimer = 0;
        this.repeatsCount = 0;
    }
}

/**
 * Handles keyboard controls for known keys
 * 
 * This class could be more generic, but its not needed for this game.
 */
export class Keyboard {
    private key_map: any = {};

    public keys = {
        escape: new Key('Escape'),
        space: new Key(' '),
        left: new Key('ArrowLeft'),
        up: new Key('ArrowUp'),
        right: new Key('ArrowRight'),
        shift: new Key('Shift'),
        down: new Key('ArrowDown'),
    };

    constructor(container: Window) {
        for (const k in this.keys) {
            if (this.keys.hasOwnProperty(k)) {
                const v = (this.keys as any)[k];
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
