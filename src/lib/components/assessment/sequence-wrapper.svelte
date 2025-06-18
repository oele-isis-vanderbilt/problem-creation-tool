<script lang="ts">
	import { createAssessmentMachine } from '$lib/components/assessment/assessment-machine';
	import {
		ProblemKind,
		type MultipleChoiceProblem,
		type ProblemRunState,
		type StateAssessment,
		type WordProblem
	} from '$lib/services/models';
	import { useActor, useSelector } from '@xstate/svelte';
	import SequenceHeader from './sequence-header.svelte';
	import {
		QuizStates as AssessmentStates,
		Commands as AssessmentCommands,
		InProgressStages,
		AttemptEvents as AssessmentAttemptEvents
	} from 'xstate-quiz-machine';
	import { Button, Popover } from 'flowbite-svelte';
	import HeroIconsPlayCircle16Solid from 'virtual:icons/heroicons-solid/play';
	import MCQ from '../problems/problem-components/mcq/problem.svelte';
	import Word from '../problems/problem-components/word/problem.svelte';
	import NDigit from '../problems/problem-components/ndigit/problem.svelte';
	import AssessmentReview from './assessment-review.svelte';

	let {
		assessment
	}: {
		assessment: StateAssessment;
	} = $props();

	const { actorRef, send, snapshot } = useActor(createAssessmentMachine(assessment, 1000));

	let events = useSelector(actorRef, (state) => state.context.events);
	let questionState = useSelector(actorRef, (state) => {
		let runState: ProblemRunState | undefined = undefined;
		return {
			currentProblem: state.context.currentQuestion,
			runStateChangeHandler: (state: ProblemRunState) => {
				runState = state;
			},
			canGrade: () => {
				return runState?.canGrade || false;
			},
			runState: () => runState
		};
	});

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
	function wasLastAttemptCorrect(): boolean {
		let lastEvent = $events.at(-1);
		if (
			lastEvent &&
			lastEvent.type === AssessmentAttemptEvents.RESPONSE &&
			lastEvent.response?.correct &&
			isInProgress()
		) {
			return lastEvent.question.id === $questionState.currentProblem.id;
		}
		return false;
	}

	function wasLastAttemptIncorrect(): boolean {
		let lastEvent = $events.at(-1);
		if (
			lastEvent &&
			lastEvent.type === AssessmentAttemptEvents.RESPONSE &&
			!lastEvent.response?.correct &&
			isInProgress()
		) {
			return lastEvent.question.id === $questionState.currentProblem.id;
		}
		return false;
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

	function shouldCaution(): boolean {
		return $snapshot.context.timeLeft <= 60; // Caution if less than 1 minute left
	}

	function start() {
		send({ type: AssessmentCommands.START });
	}

	let isPopOverOpen = $state(false);

	$effect(() => {
		if (isSkipping() && isPopOverOpen === false) {
			isPopOverOpen = true;
		}
	});

	$effect(() => {
		console.log($events);
	});
</script>

<div class="flex h-full w-full flex-col justify-between gap-2">
	<SequenceHeader
		title={assessment.title}
		events={$events}
		problems={assessment.problems}
		currentProblemIdx={$snapshot.context.currentQuestionIdx}
		onClickHelpButton={() => {
			alert('Help button clicked!'); // Replace with actual help logic
		}}
		showProgressBar={isInProgress()}
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
				<Button class="mt-6 gap-2 text-2xl" color="blue" onclick={start}>
					Start Assessment
					<HeroIconsPlayCircle16Solid class="text-2xl" />
				</Button>
			</div>
		{/if}
		{#if isInProgress()}
			<div class="flex h-full w-full flex-1 flex-row items-center gap-4">
				<div class="bg-primary-300 dark:bg-secondary-700 w-2/3 rounded-lg px-10 py-5 shadow-lg">
					{#key $questionState.currentProblem.id}
						{#if $questionState.currentProblem.kind === ProblemKind.MULTIPLE_CHOICE}
							<MCQ
								mode="assess"
								problem={$questionState.currentProblem as MultipleChoiceProblem}
								onRunStateChange={$questionState.runStateChangeHandler}
							/>
						{:else if $questionState.currentProblem.kind === ProblemKind.WORD_PROBLEM}
							<Word
								mode="assess"
								problem={$questionState.currentProblem as WordProblem}
								onRunStateChange={$questionState.runStateChangeHandler}
							/>
						{:else if $questionState.currentProblem.kind === ProblemKind.N_DIGIT_OPERATION}
							<NDigit
								mode="assess"
								problem={$questionState.currentProblem}
								onRunStateChange={$questionState.runStateChangeHandler}
							/>
						{/if}
					{/key}
				</div>
				<div class="w-1/3">LLM Chat</div>
			</div>
		{/if}
		{#if isInReview()}
			<AssessmentReview {assessment} events={$events} />
		{/if}
	</div>
	{#if wasLastAttemptCorrect()}
		<div class="-mb-2 flex flex-row gap-2 bg-green-500 p-2 text-center dark:bg-green-900">
			<span>&#127882;</span>
			<span class="text-lg font-bold"
				>Congratulations! You answered the last question correctly.</span
			>
		</div>
	{/if}
	{#if wasLastAttemptIncorrect()}
		<div class="-mb-2 flex flex-row gap-2 bg-red-500 p-2 text-center dark:bg-red-900">
			<span>&#10060;</span>
			<span class="text-lg font-bold"
				>Oops! You answered the last question incorrectly. Please try again.</span
			>
		</div>
	{/if}
	<div class="flex items-center justify-between bg-[#2b2ed3] p-5">
		<h2 class="text-2xl font-bold text-white">
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
					color="light"
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
				{#if $questionState.canGrade()}
					<Button
						disabled={isGrading()}
						color="green"
						onclick={() => {
							send({
								type: AssessmentCommands.SUBMIT_ANSWER,
								response: $questionState.runState()
							});
						}}>Check Answer</Button
					>
				{/if}
			{/if}
			{#if isInProgress() || isInReview()}
				<div>
					<p class={['text-lg font-bold text-white']}>
						Time Remaining: <span class={shouldCaution() ? 'text-yellow-400' : 'text-white'}
							>{timerText}</span
						>
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
