<script lang="ts">
	import type { BaseProblemProps } from '../base-problem/problem.svelte';
	import BaseProblem from '../base-problem/problem.svelte';
	import NDigitOperationBlock from './n-digit-operation-block.svelte';
	import type { NDigitOperation } from '$lib/services/models';
	import validateProblem from './validator';

	let {
		problem = $bindable(),
		mode = 'build',
		onProblemUpdated = () => {}
	}: Omit<BaseProblemProps, 'problem'> & { problem: NDigitOperation } = $props();

	let editedProblem = $state(JSON.parse(JSON.stringify(problem)));

	$effect(() => {
		editedProblem.operand1;
		editedProblem.operand2;
		editedProblem.operator;
		editedProblem.includeCarryAndBorrow;
		onProblemUpdated(editedProblem);
	});
</script>

<BaseProblem
	{mode}
	bind:problem={editedProblem}
	{onProblemUpdated}
	validators={[(p) => validateProblem(p as NDigitOperation)]}
>
	{#snippet body(displayMode)}
		{#if displayMode === 'build'}
			<NDigitOperationBlock bind:problem={editedProblem} />
		{:else if displayMode === 'assess'}
			<NDigitOperationBlock {problem} mode="preview" />
		{/if}
	{/snippet}
</BaseProblem>
