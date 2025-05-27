export class Timer {
	elapsed: number | undefined = $state(undefined);
	limit: number;
	intervalId: ReturnType<typeof setInterval> | null;

	constructor(limit: number) {
		this.elapsed = 0;
		this.limit = limit;
		this.intervalId = null;
	}

	start() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
		this.elapsed = 0;
		setInterval(() => {
			if (this.elapsed! < this.limit) {
				this.elapsed! += 1;
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
	}

	subscribe(callback: (elapsed: number) => void) {
		$effect(() => {
			callback(this.elapsed!);
		});
	}
}
