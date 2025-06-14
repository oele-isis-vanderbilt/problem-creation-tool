<script lang="ts">
	import Problem from '$lib/components/problems/problem/problem.svelte';
	import type { ProblemAttempt } from '$lib/services/models';
	import { AttemptEvents, type QuizResponseEvent } from 'xstate-quiz-machine';

	let {
		problems,
		currentProblemIdx,
		attempts
	}: {
		problems: Problem[];
		currentProblemIdx: number;
		attempts: QuizResponseEvent<Problem, ProblemAttempt>[];
	} = $props();

	// let noOfVisibleDots = $derived(Math.max(6, problems.length));

	// from currentProblemIdx show 3 to the left and 3 to the right or else if possible
	let problemsOfInterest: Problem[] = $derived.by(() => {
		const start = Math.max(0, currentProblemIdx - 3);
		const end = Math.min(problems.length, currentProblemIdx + 4);
		return problems.slice(start, end);
	});

	const getIndicatorType = (problem: Problem) => {
		const problemRelatedEvents = attempts.filter((event) => event.question.id === problem.id);

		if (problemRelatedEvents.length === 0) {
			return 'notAttempted';
		}

		const isSkipped = problemRelatedEvents.some((event) => event.type === AttemptEvents.SKIP);
		const isCorrect = problemRelatedEvents.some(
			(event) => event.type === AttemptEvents.RESPONSE && event.response?.correct
		);

		if (isSkipped) {
			return 'skipped';
		}

		if (isCorrect) {
			return 'correct';
		} else {
			return 'error';
		}
	};
</script>

<div class="flex flex-row items-center justify-between gap-4">
	{#each problemsOfInterest as problem, idx (problem.id)}{/each}
</div>
