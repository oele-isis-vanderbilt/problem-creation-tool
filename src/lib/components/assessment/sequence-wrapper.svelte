<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { StateAssessment } from '$lib/services/models';
	import { Timer } from './timer.svelte';
	import SequenceHeader from './sequence-header.svelte';
	import { AssessmentState } from './models';
	import { Button, Review } from 'flowbite-svelte';
	import HeroIconsPlayCircle16Solid from 'virtual:icons/heroicons-solid/play';

	let assessmentState = $state<AssessmentState>(AssessmentState.Starting);
	const ATTEMPT_TIME_LIMIT = 30 * 60 * 60; // 30 minutes
	const REVIEW_TIME_LIMIT = 10 * 60; // 10 minutes

	let {
		assessment
	}: {
		assessment: StateAssessment;
	} = $props();

	let attemptTimer = new Timer(assessment.attemptTimeLimit || ATTEMPT_TIME_LIMIT);
	let reviewTimer = new Timer(assessment.reviewTimeLimit || REVIEW_TIME_LIMIT);
	let formattedTime = $state<string>('00:00:00');

	onMount(async () => {
		attemptTimer.subscribe((elapsed) => {
			let remainingTime = assessment.attemptTimeLimit - elapsed;
			if (remainingTime <= 0) {
				formattedTime = '00:00:00';
				attemptTimer.stop();
				return;
			}
			console.log('Remaining Time(seconds):', remainingTime);
			const remainingHours = Math.floor(remainingTime / 3600);
			const remainingMinutes = Math.floor((remainingTime % 3600) / 60);
			const remainingSeconds = remainingTime % 60;
			formattedTime = `${String(remainingHours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
		});
	});

	onDestroy(() => {
		attemptTimer.stop();
	});
</script>

{#snippet start(state: StateAssessment)}
	<div class="flex h-full w-full flex-col items-center justify-center">
		<h2 class="text-3xl font-bold">
			Welcome to the {state.title}
		</h2>
		<h3 class="mt-4 text-2xl font-semibold">
			There are {state.problems.length} problems in this assessment and you have {Math.floor(
				assessment.attemptTimeLimit / 60
			)} minutes to complete this assessment.
		</h3>
		<p class="mt-2 text-lg">
			Please click the "Start" button below to begin. You can request help at any time by clicking
			the help button in the header above.
		</p>
		<Button class="mt-6 gap-2 text-2xl font-bold" onclick="{startAssessment}}">
			Start Assessment
			<HeroIconsPlayCircle16Solid class="text-2xl" />
		</Button>
	</div>
{/snippet}

{#snippet progress(state: StateAssessment)}
	<div class="flex h-full w-full flex-col items-center justify-center"></div>
{/snippet}

<div class="flex h-full w-full flex-col justify-between gap-2">
	<SequenceHeader
		title={assessment.title}
		onClickHelpButton={() => {
			alert('Help button clicked!'); // Replace with actual help logic
		}}
	></SequenceHeader>
	<div class="flex-1">
		{#if assessmentState === AssessmentState.Starting}
			{@render start(assessment)}
		{:else if assessmentState === AssessmentState.InProgress}
			{@render progress(assessment)}
		{:else if assessmentState === AssessmentState.Reviewing}{:else if assessmentState === AssessmentState.Completed}{/if}
	</div>
	<div class="bg-primary-400 dark:bg-secondary-950 flex items-center justify-between p-5">
		<h2 class="text-2xl font-bold">{String(assessmentState).toUpperCase()}</h2>
		<p class="text-lg font-bold">Time Remaining: {formattedTime}</p>
	</div>
</div>
