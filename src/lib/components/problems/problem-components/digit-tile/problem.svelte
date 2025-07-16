<script lang="ts">
	import BaseProblem, { type BaseProblemProps } from '../base-problem/problem.svelte';
	import {
		Operator,
		type DigitTileProblem,
		type DigitTileProblemRunState
	} from '$lib/services/models';
	import validateProblem from './validator';
	import { Input, Select, type SelectOptionType } from 'flowbite-svelte';
	import ProblemTerms from './terms.svelte';
	import Preview from './preview.svelte';
	import Snapshot from './snapshot.svelte';
	import Error from '../base-problem/error.svelte';

	let {
		problem,
		mode = 'build',
		onProblemUpdated = () => {},
		onRunStateChange = () => {},
		problemSnapshot = null
	}: Omit<BaseProblemProps, 'problem' | 'problemSnapshot'> & {
		problem: DigitTileProblem;
		problemSnapshot?: DigitTileProblemRunState | null;
		onRunStateChange: (state: DigitTileProblemRunState) => void;
	} = $props();

	let editedProblem = $state<DigitTileProblem>(JSON.parse(JSON.stringify(problem)));

	let selectItems = Object.values(Operator).map((operator) => {
		return {
			name: operator as string,
			value: operator
		} as SelectOptionType<Operator>;
	});

	$effect(() => {
		editedProblem.operator;
		editedProblem.terms.forEach((term) => {
			term.digits;
			term.role;
		});
		editedProblem.solution;
		onProblemUpdated(editedProblem);
	});
</script>

<BaseProblem
	{mode}
	bind:problem={editedProblem}
	{onProblemUpdated}
	{problemSnapshot}
	validators={[(p) => validateProblem(p as DigitTileProblem)]}
>
	{#snippet body(displayMode)}
		{#if displayMode === 'build'}
			<div class="mb-4 flex flex-row items-center justify-between">
				<h2 class="text-2xl font-bold">Operator</h2>
				<Select
					bind:value={editedProblem.operator}
					items={selectItems}
					placeholder="Operator"
					class="min-w-32"
				/>
			</div>
			<ProblemTerms bind:problem={editedProblem} />
			<div class="mb-4 flex flex-row items-center justify-between gap-6">
				<h2 class="text-2xl font-bold">Solution</h2>
				<Input
					type="number"
					bind:value={editedProblem.solution}
					placeholder="Solution"
					class="min-w-32"
				/>
			</div>
		{/if}
		{#if displayMode === 'assess'}
			<Preview {problem} {onRunStateChange} {problemSnapshot} />
		{/if}
		{#if displayMode === 'snapshot'}
			<Snapshot {problem} {problemSnapshot} />
		{/if}
	{/snippet}
</BaseProblem>
