<script lang="ts">
	import {
		ProblemKind,
		type MCQProblemRunState,
		type MultipleChoiceProblem
	} from '$lib/services/models';
	import McqOptionAdder from './mcq-option-adder.svelte';
	import McqOptionPreview from './mcq-option-preview.svelte';
	import BaseProblem from '../base-problem/problem.svelte';
	import type { BaseProblemProps } from '../base-problem/problem.svelte';
	import validateProblem from './validator';
	import Error from '../base-problem/error.svelte';

	let {
		problem,
		mode = 'build',
		onProblemUpdated = () => {},
		onRunStateChange = () => {}
	}: Omit<BaseProblemProps, 'problem'> & {
		problem: MultipleChoiceProblem;
		onRunStateChange: (state: MCQProblemRunState) => void;
	} = $props();

	let editedProblem = $state<MultipleChoiceProblem>(JSON.parse(JSON.stringify(problem)));
	let selectedOptionId = $state<string | null>(null);

	const isCorrectOption = (optionId: string | null): boolean => {
		const correctOption = editedProblem.options.find((option) => option.isCorrect);
		return correctOption ? correctOption.id === optionId : false;
	};

	let runState: MCQProblemRunState = $derived.by(() => {
		const state = {
			canGrade: selectedOptionId !== null,
			canGradeFeedback: selectedOptionId === null ? ['No option selected'] : [],
			selectedOptionId,
			isCorrect: isCorrectOption(selectedOptionId),
			problem: $state.snapshot(editedProblem)
		} as MCQProblemRunState;
		onRunStateChange(state);
		return state;
	});

	let validator = $derived.by(() => {
		return (p) => runState.canGradeFeedback;
	});
</script>

<BaseProblem
	{mode}
	bind:problem={editedProblem}
	{onProblemUpdated}
	validators={[(p) => validateProblem(p as MultipleChoiceProblem)]}
>
	{#snippet body(displayMode)}
		{#if displayMode === 'build'}
			<McqOptionAdder bind:options={editedProblem.options} />
		{:else if displayMode === 'assess'}
			<McqOptionPreview options={editedProblem.options} bind:selectedOptionId />
			<Error validators={[validator]} />
		{/if}
	{/snippet}
</BaseProblem>
