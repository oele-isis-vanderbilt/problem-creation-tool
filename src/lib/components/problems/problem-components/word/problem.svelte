<script lang="ts">
	import { type WordProblem, type WordProblemRunState } from '$lib/services/models';
	import AnswerBlockPreview from './answer-block-preview.svelte';
	import AnswerBlocksAdder from './answer-blocks-adder.svelte';
	import type { BaseProblemProps } from '../base-problem/problem.svelte';
	import BaseProblem from '../base-problem/problem.svelte';
	import validateProblem from './validator';
	import Error from '../base-problem/error.svelte';
	import AnswerBlockSnapshot from './answer-block-snapshot.svelte';

	let {
		problem = $bindable(),
		mode = 'build',
		onProblemUpdated = () => {},
		onRunStateChange = () => {},
		problemSnapshot = null
	}: Omit<BaseProblemProps, 'problem' | 'problemSnapshot'> & {
		problem: WordProblem;
		problemSnapshot?: WordProblemRunState | null;
		onRunStateChange: (state: WordProblemRunState) => void;
	} = $props();

	let editedProblem = $state<WordProblem>(JSON.parse(JSON.stringify(problem)));

	let blockValues = $state(problemSnapshot ?
		problemSnapshot.answerBlockValues : 
		Array(problem.answerBlocks.length).fill('')
	);

	const isCorrect = (blockValues: string[], answerBlocks: { value: string }[]): boolean => {
		if (blockValues.length !== answerBlocks.length) {
			return false;
		}
		return blockValues.every((value, index) => value.trim() === answerBlocks[index].value.trim());
	};

	let runState: WordProblemRunState = $derived.by(() => {
		const state = {
			canGrade: blockValues.every((value) => value.trim() !== ''),
			canGradeFeedback: blockValues
				.map((value, index) => {
					if (value.trim() === '') {
						return `Answer block ${index + 1} is empty`;
					}
					return '';
				})
				.filter((msg) => msg !== ''),
			problem: {...editedProblem},
			answerBlockValues: [...blockValues],
			isCorrect: isCorrect(blockValues, editedProblem.answerBlocks)
		} as WordProblemRunState;
		onRunStateChange(state);
		return state;
	});

	let validator = $derived.by(() => {
		return (p) => runState.canGradeFeedback;
	});

	$effect(() => {
		editedProblem.answerBlocks.forEach((block) => {
			block.value;
			block.label;
		});
		onProblemUpdated(editedProblem);
	});
</script>

<BaseProblem
	{mode}
	bind:problem={editedProblem}
	{onProblemUpdated}
	validators={[(p) => validateProblem(p as WordProblem)]}
>
	{#snippet body(displayMode)}
		{#if displayMode === 'build'}
			<AnswerBlocksAdder bind:answerBlocks={editedProblem.answerBlocks} />
		{:else if displayMode === 'assess'}
			<div class="flex flex-col gap-4">
				<AnswerBlockPreview answerBlocks={editedProblem.answerBlocks} bind:blockValues />
				<Error validators={[validator]} />
			</div>
		{:else if displayMode === 'snapshot'}
			<div class="flex flex-col gap-4">
				<AnswerBlockSnapshot answerBlocks={editedProblem.answerBlocks} snapshot={problemSnapshot} />
			</div>
		{/if}
	{/snippet}
</BaseProblem>
