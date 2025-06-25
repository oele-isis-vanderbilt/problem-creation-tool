<script lang="ts">
	import type { ProblemRunState, StateAssessment } from '$lib/services/models';
	import {
		AttemptEvents as Event,
		type QuizResponseEvent as AssessmentAttemptEvent
	} from 'xstate-quiz-machine';
	import Problem from '../problems/problem-components/base-problem/problem.svelte';
	import Indicator from './progress/indicator.svelte';
	import type { IndicatorType } from './progress/indicator.svelte';

	let {
		assessment,
		events
	}: {
		assessment: StateAssessment;
		events: AssessmentAttemptEvent<Problem, ProblemRunState>[];
	} = $props();

	let problemAttempts = $derived.by(() => {
		return assessment.problems.map((problem) => {
			const attempts = events.filter((event) => event.question?.id === problem.id);
			return [problem.title, attempts];
		});
	});

	function getIndicatorType(
		attempt: AssessmentAttemptEvent<Problem, ProblemRunState>
	): IndicatorType {
		if (attempt.type === Event.SKIP) {
			return 'skipped';
		} else if (attempt.type === Event.RESPONSE) {
			return attempt.response?.correct ? 'correct' : 'incorrect';
		}

		return 'notAttempted';
	}
</script>

<div class="flex h-full flex-col items-center justify-center gap-4 text-center">
	<div>
		<h2 class="text-4xl font-black">Thanks!!</h2>
		<p class="text-lg">Your assessment is complete.</p>
	</div>

	<div class="mt-4 grid w-full grid-cols-5 justify-between gap-2">
		{#each problemAttempts as [prob, attempts]}
			<div class="divide-y rounded-lg border-2 bg-purple-300 shadow-lg">
				<h2 class="p-2 text-lg font-bold">
					{prob}
				</h2>
				{#if attempts.length === 0}
					<div class="flex items-center justify-center p-2">
						<Indicator type="notAttempted" withTooltip></Indicator>
					</div>
				{:else}
					<div class="flex items-center justify-center gap-2 p-2">
						{#each attempts as attempt}
							<Indicator type={getIndicatorType(attempt)} withTooltip></Indicator>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
