<script lang="ts">
	import {
		MCQOptionKind,
		ProblemKind,
		type MCQProblemRunState,
		type MultipleChoiceOptionFraction,
		type MultipleChoiceOptionImage,
		type MultipleChoiceOptionText,
		type MultipleChoiceProblem
	} from '$lib/services/models';
	import McqOptionAdder from './mcq-option-adder.svelte';
	import McqOptionPreview from './mcq-option-preview.svelte';
	import BaseProblem from '../base-problem/problem.svelte';
	import type { BaseProblemProps } from '../base-problem/problem.svelte';
	import validateProblem from './validator';
	import Error from '../base-problem/error.svelte';
	import McqOptionSnapshot from './mcq-option-snapshot.svelte';

	let {
		problem,
		mode = 'build',
		onProblemUpdated = () => {},
		onRunStateChange = () => {},
		problemSnapshot = null
	}: Omit<BaseProblemProps, 'problem' | 'problemSnapshot'> & {
		problem: MultipleChoiceProblem;
		problemSnapshot?: MCQProblemRunState | null;
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

	$effect(() => {
		editedProblem.options.forEach((option) => {
			option.isCorrect;
			let opt;
			switch (option.kind) {
				case MCQOptionKind.TEXT:
					opt = option as MultipleChoiceOptionText;
					option.displayName;
					option.value;
				case MCQOptionKind.FRACTION:
					opt = option as MultipleChoiceOptionFraction;
					opt.numerator;
					opt.denominator;
					opt.wholeNumber;
				case MCQOptionKind.IMAGE:
					opt = option as MultipleChoiceOptionImage; // Assuming image options are handled similarly to text
					opt.imageUUID;
					opt.altText;
			}
			option.id;
			option.misconception;
		});
		onProblemUpdated(editedProblem);
	});
</script>

<BaseProblem
	{mode}
	bind:problem={editedProblem}
	{onProblemUpdated}
	{problemSnapshot}
	validators={[(p) => validateProblem(p as MultipleChoiceProblem)]}
>
	{#snippet body(displayMode)}
		{#if displayMode === 'build'}
			<McqOptionAdder bind:options={editedProblem.options} />
		{:else if displayMode === 'assess'}
			<McqOptionPreview options={editedProblem.options} bind:selectedOptionId />
			<Error validators={[validator]} />
		{:else if displayMode === 'snapshot'}
			<McqOptionSnapshot
				options={editedProblem.options}
				selectedOptionId={problemSnapshot?.selectedOptionId}
			/>
		{/if}
	{/snippet}
</BaseProblem>
