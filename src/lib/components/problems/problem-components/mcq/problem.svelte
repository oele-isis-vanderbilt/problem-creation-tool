<script lang="ts">
	import type { MultipleChoiceProblem } from '$lib/services/models';
	import McqOptionAdder from './mcq-option-adder.svelte';
	import McqOptionPreview from './mcq-option-preview.svelte';
	import BaseProblem from '../base-problem/problem.svelte';
	import type { BaseProblemProps } from '../base-problem/problem.svelte';
	import validateProblem from './validator';

	let {
		problem,
		mode = 'build',
		onProblemUpdated = () => {}
	}: Omit<BaseProblemProps, 'problem'> & { problem: MultipleChoiceProblem } = $props();

	let editedProblem = $state<MultipleChoiceProblem>(JSON.parse(JSON.stringify(problem)));

	$effect(() => {
		editedProblem.options;
		editedProblem.options.forEach((option) => [option.isCorrect, option.misconception]);
		onProblemUpdated(editedProblem);
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
			<McqOptionPreview options={editedProblem.options} />
		{/if}
	{/snippet}
</BaseProblem>
