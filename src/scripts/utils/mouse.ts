
interface IPoint {
    x: number;
    y: number;
}

export class MouseButton {
    pressed = false;

    trigger() {
        if (this.pressed) {
            this.pressed = false;
            return true;
        }
        return false;
    }
}

export class Mouse {
    position: IPoint = {x: 0, y: 0};
    left = new MouseButton();
    right = new MouseButton();

    constructor(private container: HTMLElement) {
        this.container.addEventListener('mousedown', (evt: MouseEvent) => {
            this.left.pressed = true;
            this.position.x = evt.clientX;
            this.position.y = evt.clientY;
        });

        this.container.addEventListener('mouseup', (evt: MouseEvent) => {
            this.left.pressed = false;
        });

        // prevent default right-click behavior
        this.container.addEventListener('contextmenu', (evt: MouseEvent) => {
            this.right.pressed = true;
            this.position.x = evt.clientX;
            this.position.y = evt.clientY;
            evt.preventDefault();
        });

        this.container.addEventListener('mouseup', (evt: MouseEvent) => {
            this.left.pressed = false;
        });

        this.container.addEventListener('mousemove', (evt: MouseEvent) => {
            this.position.x = evt.clientX;
            this.position.y = evt.clientY;
        });
    }
}