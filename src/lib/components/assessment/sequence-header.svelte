<script lang="ts">
	import type { Problem, ProblemRunState } from '$lib/services/models';
	import { Tooltip } from 'flowbite-svelte';
	import HandRaiseIcon from 'virtual:icons/heroicons-solid/hand-raised';
	import { AttemptEvents, type QuizResponseEvent } from 'xstate-quiz-machine';
	import Indicator, { type IndicatorType } from './progress/indicator.svelte';

	let {
		title,
		onClickHelpButton,
		problems,
		events,
		currentProblemIdx,
		showProgressBar = true
	}: {
		title: string;
		onClickHelpButton: () => void;
		problems: Problem[];
		events: QuizResponseEvent<Problem, ProblemRunState>[];
		currentProblemIdx: number;
		showProgressBar?: boolean;
	} = $props();

	let helpRequested = $state(false);
	const MAX_PROBLEMS_FOR_PROGRESS_INDICATOR = 5;
	let currentProblems = $derived.by(() => {
		const total = problems.length;
		const windowSize = MAX_PROBLEMS_FOR_PROGRESS_INDICATOR;
		const halfWindow = Math.floor(windowSize / 2);

		let start = currentProblemIdx - halfWindow;

		if (start < 0) {
			start = 0;
		}

		if (start + windowSize > total) {
			start = Math.max(0, total - windowSize);
		}

		const end = Math.min(total, start + windowSize);
		return problems.slice(start, end);
	});

	let indicators: { type: IndicatorType }[] = $derived.by(() => {
		return currentProblems.map((problem) => {
			const eventsOfInterest = events.filter((event) => event.question?.id === problem.id);
			if (eventsOfInterest.length === 0) {
				return {
					type: 'notAttempted'
				};
			}
			const skipped = eventsOfInterest.some((event) => event.type === AttemptEvents.SKIP);
			if (skipped) {
				return {
					type: 'skipped'
				};
			}
			const wasCorrect = eventsOfInterest.some((event) => event.response?.correct);
			if (wasCorrect) {
				return {
					type: 'correct'
				};
			} else {
				return {
					type: 'incorrect'
				};
			}
		});
	});
</script>

<div class="flex w-full items-start justify-between gap-2 bg-[#2b2ed3] p-5">
	<h1 class="text-2xl font-bold text-white">{title}</h1>
	{#if showProgressBar}
		<div class="flex flex-1 items-center justify-center gap-2">
			{#each indicators as indicator, idx (idx)}
				<Indicator type={indicator.type} />
			{/each}
		</div>
	{/if}

	<HandRaiseIcon
		role="button"
		class={[
			'h-5 w-5 cursor-pointer hover:text-green-700',
			helpRequested && 'h-10 w-10 text-green-100'
		]}
		onclick={() => {
			helpRequested = true;
			onClickHelpButton();
		}}
	></HandRaiseIcon>

	<Tooltip>
		{helpRequested ? 'Someone will be with you shortly' : 'Click to request help'}
	</Tooltip>
</div>
