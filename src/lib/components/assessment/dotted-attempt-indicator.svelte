<script lang="ts">
	import type { Problem, ProblemAttempt } from '$lib/services/models';
	import { AttemptEvents, type QuizResponseEvent } from 'xstate-quiz-machine';
	import { ChevronRightOutline, XSolid } from 'flowbite-svelte-icons';
	let {
		problemId,
		attempts
	}: {
		problemId: string;
		attempts: QuizResponseEvent<Problem, ProblemAttempt>[];
	} = $props();

	const lights = {
		skipped: '#808080',
		correct: '#28c940',
		error: '#ff5f57',
		notAttempted: '#ffbd2e'
	};

	let color = $derived.by(() => {
		const problemRelatedEvents = attempts.filter((event) => event.question.id === problemId);

		if (problemRelatedEvents.length === 0) {
			return lights.notAttempted; // not attempted
		}

		const isSkipped = problemRelatedEvents.some((event) => event.type === AttemptEvents.SKIP);

		const isCorrect = problemRelatedEvents.some(
			(event) => event.type === AttemptEvents.RESPONSE && event.response?.correct
		);

		if (isSkipped) {
			return lights.skipped; // skipped
		}

		if (isCorrect) {
			return lights.correct; // correct
		} else {
			return lights.error; // error
		}
	});
</script>

{#key problemId}
	<div
		role="button"
		aria-label={`Problem ${problemId} status`}
		class={[
			'flex h-7 w-7 cursor-pointer items-center justify-center rounded-full p-3 shadow-inner hover:brightness-125',
			color === lights.notAttempted && 'border-4 border-gray-400'
		]}
		style="background-color: {color || lights.notAttempted};"
	>
		{#if color === lights.skipped}
			<ChevronRightOutline size="xl" strokeWidth="3" class="ml-0.5 text-8xl text-white" />
		{/if}
		{#if color === lights.error}
			<XSolid class="ml-0.5 h-7 w-7 text-8xl font-black text-white" />
		{/if}
	</div>
{/key}
