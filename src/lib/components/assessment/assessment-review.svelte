<script lang="ts">
	import type { Problem, ProblemRunState, StateAssessment } from '$lib/services/models';
	import {
		AttemptEvents,
		type QuizResponseEvent as AssessmentAttemptEvents
	} from 'xstate-quiz-machine';
	import Indicator, { type IndicatorType } from './progress/indicator.svelte';
	import { getProblemComponent } from '$lib/components/problems/problem-components/utils';
	import { timestampToDate } from '$lib/utils';

	let {
		events,
		assessment
	}: {
		events: AssessmentAttemptEvents<Problem, ProblemRunState>[];
		assessment: StateAssessment;
	} = $props();

	let currentProblem = $state<Problem | null>(null);

	let eventsByProblemId = $derived.by(() => {
		const map: Record<string, AssessmentAttemptEvents<Problem, ProblemRunState>[]> = {};
		for (const event of events) {
			if (!map[event.question?.id]) {
				map[event.question?.id] = [];
			}
			map[event.question?.id].push(event);
		}
		return map;
	});

	function getIndicatorType(
		events: AssessmentAttemptEvents<Problem, ProblemRunState>[]
	): IndicatorType {
		if (events.length === 0) {
			return 'notAttempted';
		}
		const skipped = events.some((event) => event.type === AttemptEvents.SKIP);
		if (skipped) {
			return 'skipped';
		}

		const wasCorrect = events.some((event) => event.response?.correct);
		if (wasCorrect) {
			return 'correct';
		} else {
			return 'incorrect';
		}
	}

	let items = $derived.by(() => {
		return assessment.problems.map((problem) => {
			const eventsOfInterest = eventsByProblemId[problem.id] || [];
			return {
				title: problem.title,
				indicator: getIndicatorType(eventsOfInterest),
				onclick: () => {
					setCurrentProblem(problem.id);
				}
			};
		});
	});

	function setCurrentProblem(id: string) {
		currentProblem = assessment.problems.find((p) => p.id === id) || null;
	}

	function getProblemSnapshots(id: string): ProblemRunState[] {
		const eventsOfInterest = eventsByProblemId[id] || [];
		return eventsOfInterest
			.map((event) => event.response?.payload)
			.filter((snapshot) => !!snapshot);
	}
</script>

<div
	class="bg-primary-200 flex h-full w-full flex-row items-center justify-between gap-4 shadow-lg"
>
	<div class="w-1/4">
		<div class="bg-primary-300 w-full divide-y-2 rounded-lg p-0 shadow-lg">
			<h3 class="p-1 text-center text-xl font-black text-gray-900 dark:text-white">
				Your Attempts
			</h3>
			{#each items as item (item.title)}
				<div class="flex flex-row justify-between gap-2 p-2 text-base font-semibold">
					<span class="text-gray-900 dark:text-white">{item.title}</span>
					<Indicator type={item.indicator as IndicatorType} withTooltip onclick={item.onclick} />
				</div>
			{/each}
		</div>
	</div>
	<div class="h-full w-1/2 bg-red-50">
		<div class="flex h-full flex-col overflow-hidden">
			<!-- Fix Me: This scroll behavior is a hack -->
			<div class="h-[700px] w-full overflow-auto p-4">
				{#if currentProblem}
					{@const ProblemComponent = getProblemComponent(currentProblem.kind)}
					{#key currentProblem.id}
						{#each eventsByProblemId[currentProblem.id] as problemSnapshot, index (index)}
							<div class="mb-4 flex flex-col justify-between gap-4 divide-y">
								<h3 class="text-lg font-bold">
									{currentProblem.title} - Attempt {index + 1} - at {timestampToDate(
										problemSnapshot.timestamp
									)}
								</h3>
								<Indicator type={getIndicatorType([problemSnapshot])} withTooltip />
							</div>
							<ProblemComponent
								mode="snapshot"
								problem={currentProblem}
								problemSnapshot={problemSnapshot.response?.payload}
							/>
						{/each}
						{#if eventsByProblemId[currentProblem.id].length === 0}
							<ProblemComponent mode="snapshot" problem={currentProblem} problemSnapshot={null} />
						{/if}
					{/key}
				{/if}
			</div>
		</div>
	</div>
	<div class="w-1/4">LLM Chat</div>
</div>
