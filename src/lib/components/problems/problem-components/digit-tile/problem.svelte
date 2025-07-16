<script lang="ts">
	import BaseProblem, { type BaseProblemProps } from '../base-problem/problem.svelte';
	import { Operator, type DigitTileProblem } from '$lib/services/models';
	import validateProblem from './validator';
	import { Select, type SelectOptionType } from 'flowbite-svelte';
	import ProblemTerms from './terms.svelte';
	import Preview from './preview.svelte';
	import ProblemTiles from './tiles.svelte';

	let {
		problem,
		mode = 'build',
		onProblemUpdated = () => {},
		onRunStateChange = () => {},
		problemSnapshot = null
	}: Omit<BaseProblemProps, 'problem' | 'problemSnapshot'> & {
		problem: DigitTileProblem;
		problemSnapshot?: null;
		onRunStateChange: (state: any) => void;
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
		editedProblem.tiles.forEach((tile) => {
			tile;
		});
		editedProblem.terms.forEach((term) => {
			term.digitSlots;
			term.role;
		});
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
			<ProblemTiles bind:problem={editedProblem} />

			<ProblemTerms bind:problem={editedProblem} />
		{/if}
		{#if displayMode === 'assess'}
			<Preview {problem} />
		{/if}
	{/snippet}
</BaseProblem>
