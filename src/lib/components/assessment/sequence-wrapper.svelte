<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { store } from '$lib/services/knowLearningStore.svelte';
	import type { Problem } from '$lib/services/models';
	import { Timer } from './timer.svelte';
	const TIME_LIMIT = 30 * 60 * 60; // 30 minutes

	let { getProblem } = store!;

	let {
		problemIds
	}: {
		problemIds: string[];
		title: string;
	} = $props();

	let timer = new Timer(TIME_LIMIT);
	let formattedTime = $state<string>('00:00');

	onMount(async () => {
		const problems = problemIds.map((id) => getProblem(id));
		timer.start();

		timer.subscribe((elapsed) => {
			let remainingTime = TIME_LIMIT - elapsed;
			if (remainingTime <= 0) {
				formattedTime = '00:00';
				timer.stop();
				return;
			}
			const remainingMinutes = Math.floor(remainingTime / (60 * 60));
			const remainingSeconds = remainingTime % 60;

			const minutes = String(remainingMinutes).padStart(2, '0');
			const seconds = String(remainingSeconds).padStart(2, '0');

			formattedTime = `${minutes}:${seconds}`;
		});
	});

	onDestroy(() => {
		timer.stop();
	});
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<div class="flex flex-col items-center justify-center">
		<p class="mb-2 text-lg">Time Remaining: {formattedTime}</p>
	</div>
</div>
