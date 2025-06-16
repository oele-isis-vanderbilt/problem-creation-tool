<script lang="ts">
	import type { WordProblem } from '$lib/services/models';
	import AnswerBlockPreview from './answer-block-preview.svelte';
	import AnswerBlocksAdder from './answer-blocks-adder.svelte';
	import type { BaseProblemProps } from '../base-problem/problem.svelte';
	import BaseProblem from '../base-problem/problem.svelte';
	import validateProblem from './validator';

	let {
		problem = $bindable(),
		mode = 'build',
		onProblemUpdated = () => {}
	}: Omit<BaseProblemProps, 'problem'> & { problem: WordProblem } = $props();

	let editedProblem = $state<WordProblem>(JSON.parse(JSON.stringify(problem)));

	$effect(() => {
		editedProblem.answerBlocks;
		editedProblem.answerBlocks.forEach((block) => [block.value, block.label]);
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
			<AnswerBlockPreview answerBlocks={editedProblem.answerBlocks} />
		{/if}
	{/snippet}
</BaseProblem>
