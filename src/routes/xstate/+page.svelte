<script lang="ts">
	import { useActor } from '@xstate/svelte';
	import { getTimerMachine } from '$lib/components/assessment/assessment-machine';
	import { Button } from 'flowbite-svelte';

	const { snapshot, send, actorRef } = useActor(getTimerMachine(5));
	let display = $state({
		remaining: 0,
		currentFSMState: ''
	});

	snapshot.subscribe((state) => {
		display.remaining = state.context.remaining;
		display.currentFSMState = state.value;
	});

	let inProgress = $state(false);
	actorRef.subscribe((actor) => {
		if (actor.matches('DONE') || actor.matches('STARTING')) {
			inProgress = false;
		} else if (actor.matches('IN_PROGRESS')) {
			inProgress = true;
		}
	});

	function sendEvent() {
		if (inProgress) {
			send({ type: 'STOP' });
		} else {
			send({ type: 'START' });
		}
	}
</script>

<div class="container mx-auto flex h-full w-full flex-col items-center justify-center gap-4">
	<!-- <div class="flex w-full items-center justify-between py-2">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">XState Timer Example</h2>
    </div>
    <div class="flex flex-col items-center justify-center gap-4">
        <p class="text-lg">Timer {remainingSeconds} seconds</p>
    </div> -->
	<Button class="gap-2 text-2xl font-bold" onclick={sendEvent}>
		{inProgress ? 'Stop' : 'Start'} Timer
	</Button>

	<div class="text-lg font-semibold">
		Current State: {display.currentFSMState}
	</div>

	<!-- Huge Timer -->
	<div class="text-8xl font-black">
		<!-- HH:MM::SS -->
		{Math.floor(display.remaining / 3600)
			.toString()
			.padStart(2, '0')}:
		{Math.floor((display.remaining % 3600) / 60)
			.toString()
			.padStart(2, '0')}:
		{(display.remaining % 60).toString().padStart(2, '0')}
	</div>
</div>
