
export class FpsMeter {
	private elapsedTime: number;
	private previousTime: number;
	private htmlElement: HTMLElement;

	constructor(container: HTMLElement, private refreshDelay = 500) {
		this.htmlElement = document.createElement('div');
		this.htmlElement.classList.add('fps');
		container.appendChild(this.htmlElement);

		this.elapsedTime = 0;
		this.previousTime = performance.now();
	}

	tick(fps: number) {
		this.elapsedTime = performance.now() - this.previousTime;
		if (this.elapsedTime > this.refreshDelay) {
			this.htmlElement.innerHTML = `FPS: ${fps.toFixed(2)}`;
			this.reset();
		}
	}

	reset() {
		this.elapsedTime = 0;
		this.previousTime = performance.now();
	}
}