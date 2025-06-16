<script lang="ts">
	import type { MultipleChoiceProblem } from '$lib/services/models';
	import McqOptionAdder from './mcq-option-adder.svelte';
	import McqOptionPreview from './mcq-option-preview.svelte';
	import BaseProblem from '../base-problem/problem.svelte';
	import type { BaseProblemProps } from '../base-problem/problem.svelte';
	import validateProblem from './validator';

	let {
		problem = $bindable(),
		mode = 'build',
		onProblemUpdated = () => {}
	}: Omit<BaseProblemProps, 'problem'> & { problem: MultipleChoiceProblem } = $props();
</script>

<BaseProblem
	{mode}
	bind:problem
	{onProblemUpdated}
	validators={[(p) => validateProblem(p as MultipleChoiceProblem)]}
>
	{#snippet body(displayMode)}
		{#if displayMode === 'build'}
			<McqOptionAdder bind:options={problem.options} />
		{:else if displayMode === 'assess'}
			<McqOptionPreview options={problem.options} />
		{/if}
	{/snippet}
</BaseProblem>
