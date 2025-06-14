export class Timer {
	elapsed: number;
	limit: number;
	intervalId: ReturnType<typeof setInterval> | null;
	subscribers: ((elapsed: number) => void)[];

	constructor(limit: number) {
		this.elapsed = 0;
		this.limit = limit;
		this.intervalId = null;
		this.subscribers = [];
	}

	start() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
		this.elapsed = 0;
		setInterval(() => {
			if (this.elapsed < this.limit) {
				this.elapsed += 1;
				this.notify();
			} else {
				this.stop();
			}
		}, 1000);
	}

	stop() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
		this.elapsed = 0;
		this.subscribers = [];
		this.notify();
	}

	subscribe(callback: (elapsed: number) => void) {
		this.subscribers.push(callback);
		callback(this.elapsed);
	}

	private notify() {
		for (const subscriber of this.subscribers) {
			subscriber(this.elapsed);
		}
	}
}
