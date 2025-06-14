<script lang="ts">
	import { createAssessmentMachine } from '$lib/components/assessment/assessment-machine';
	import type { StateAssessment } from '$lib/services/models';
	import { useActor, useSelector } from '@xstate/svelte';
	import SequenceHeader from './sequence-header.svelte';
	import {
		QuizStates as AssessmentStates,
		Commands as AssessmentCommands,
		InProgressStages
	} from 'xstate-quiz-machine';
	import { Button, Popover } from 'flowbite-svelte';
	import HeroIconsPlayCircle16Solid from 'virtual:icons/heroicons-solid/play';
	import Problem from '../problems/problem/problem.svelte';
	import DottedProgressBar from './dotted-attempt-indicator.svelte';

	let {
		assessment
	}: {
		assessment: StateAssessment;
	} = $props();

	const { actorRef, send, snapshot } = useActor(createAssessmentMachine(assessment, 1000));

	let canGradeCurrentProblem = $state(false);
	let currentProblemAttempt = $state(null);

	let events = useSelector(actorRef, (state) => state.context.events);

	function isStarting(): boolean {
		return $snapshot.matches(AssessmentStates.STARTING);
	}

	function isInReview(): boolean {
		return $snapshot.matches(AssessmentStates.REVIEWING);
	}

	function isInProgress(): boolean {
		return $snapshot.matches(AssessmentStates.IN_PROGRESS);
	}

	function isSkipping(): boolean {
		return $snapshot.matches({
			[AssessmentStates.IN_PROGRESS]: InProgressStages.SKIPPING
		});
	}

	function isGrading(): boolean {
		return $snapshot.matches({
			[AssessmentStates.IN_PROGRESS]: InProgressStages.GRADING
		});
	}

	let timerText = $derived.by(() => {
		const timeLeft = $snapshot.context.timeLeft;
		if (timeLeft <= 0) {
			return 'Time is up!';
		}
		const hours = Math.floor(timeLeft / 3600);
		const minutes = Math.floor(timeLeft / 60);
		const seconds = timeLeft % 60;
		return `${hours}h ${minutes}m ${seconds}s`;
	});

	function start() {
		send({ type: AssessmentCommands.START });
	}

	let isPopOverOpen = $state(false);

	$effect(() => {
		if (isSkipping() && isPopOverOpen === false) {
			isPopOverOpen = true;
		}
	});
</script>

<div class="flex h-full w-full flex-col justify-between gap-2">
	<SequenceHeader
		title={assessment.title}
		onClickHelpButton={() => {
			alert('Help button clicked!'); // Replace with actual help logic
		}}
	></SequenceHeader>
	<div class="flex-1 px-10">
		{#if isStarting()}
			<div class="flex h-full w-full flex-col items-center justify-center">
				<h2 class="text-3xl font-bold">
					Welcome to the {assessment.title}
				</h2>
				<h3 class="mt-4 text-2xl font-semibold">
					There are {assessment.problems.length} problems in this assessment and you have {Math.floor(
						assessment.attemptTimeLimit / 60
					)} minutes to complete this assessment.
				</h3>
				<p class="mt-2 text-lg">
					Please click the "Start" button below to begin. You can request help at any time by
					clicking the help button in the header above.
				</p>
				<Button class="mt-6 gap-2 text-2xl font-bold" onclick={start}>
					Start Assessment
					<HeroIconsPlayCircle16Solid class="text-2xl" />
				</Button>
			</div>
		{/if}
		{#if isInProgress()}
			<div
				class="mx-auto grid w-full auto-cols-max grid-flow-col items-center justify-center justify-items-center gap-4"
			>
				{#each assessment.problems as problem, index}
					<DottedProgressBar attempts={$events} problemId={problem.id} />
				{/each}
			</div>

			<div class="flex h-full w-full flex-1 flex-row items-center gap-4">
				<div class="bg-primary-300 dark:bg-secondary-700 w-3/4 rounded-lg px-10 py-5 shadow-lg">
					{#key $snapshot.context.currentQuestionIdx}
						<Problem
							problem={$snapshot.context.currentQuestion}
							previewOnly={true}
							showGradingFeedbackErrors={true}
							bind:canGradeProblem={canGradeCurrentProblem}
							bind:problemAttempt={currentProblemAttempt}
						/>
					{/key}
				</div>
				<div class="w-1/4">LLM Chat</div>
			</div>
		{/if}
	</div>

	<div class="bg-primary-400 dark:bg-secondary-950 flex items-center justify-between p-5">
		<h2 class="text-2xl font-bold">
			{isInProgress()
				? 'In Progress'
				: isInReview()
					? 'Reviewing'
					: String($snapshot.value).toUpperCase()}
		</h2>
		<div class="flex items-center justify-center gap-4 align-middle">
			{#if isInProgress()}
				<Button
					disabled={isSkipping() || isGrading()}
					color="primary"
					outline
					id="skip-button"
					onclick={() =>
						send({
							type: AssessmentCommands.SKIP
						})}
				>
					Skip
				</Button>
				<Popover
					triggeredBy="#skip-button"
					trigger="click"
					title="Are you sure you want to skip?"
					placement="top"
					bind:isOpen={isPopOverOpen}
				>
					<span class="text-sm font-normal"> Skipped questions won't count as correct. </span>
					<div class="ms-3 text-sm font-normal">
						<Button
							size="xs"
							outline
							class="underline"
							onclick={() => {
								send({
									type: AssessmentCommands.CONFIRM_SKIP
								});
								isPopOverOpen = false;
							}}>Skip</Button
						>
						<Button
							size="md"
							onclick={() => {
								send({
									type: AssessmentCommands.REJECT_SKIP
								});
								isPopOverOpen = false;
							}}>Cancel</Button
						>
					</div>
				</Popover>
				{#if canGradeCurrentProblem}
					<Button disabled={isGrading()} color="green">Check Answer</Button>
				{/if}
			{/if}
			{#if isInProgress() || isInReview()}
				<div>
					<p class="text-lg font-bold">Time Remaining: {timerText}</p>
				</div>
			{/if}
		</div>
	</div>
</div>
