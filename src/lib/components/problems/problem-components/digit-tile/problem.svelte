<script lang="ts">
	import BaseProblem, { type BaseProblemProps } from '../base-problem/problem.svelte';
	import { Operator, type DigitTileProblem } from '$lib/services/models';
	import validateProblem from './validator';
	import { Button, Input, Select, type SelectOptionType } from 'flowbite-svelte';
	import ProblemTerms from './terms.svelte';

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
		editedProblem.tiles;
		editedProblem.terms;
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
			<div class="mb-4 flex flex-row items-center justify-between">
				<h2 class="text-2xl font-bold">Tiles</h2>
				<Button
					onclick={() => {
						editedProblem.tiles = [...editedProblem.tiles, 0];
					}}>Add Tiles</Button
				>
			</div>
			<div class="align-center mb-4 flex flex-row items-start justify-start gap-4">
				{#each editedProblem.tiles as tile, index}
					<div>
						<Input
							type="number"
							placeholder="Enter value"
							bind:value={editedProblem.tiles[index]}
							class="mb-2 w-32"
						/>
					</div>
					<div>
						<Button
							color="red"
							onclick={() => {
								editedProblem.tiles.splice(index, 1);
							}}>Remove</Button
						>
					</div>
				{/each}
			</div>
			<div class="mb-4 flex flex-row items-center justify-between">
				<h2 class="text-2xl font-bold">Terms</h2>
				<Button
					onclick={() => {
						editedProblem.terms = [...editedProblem.terms, { digitSlots: 1, role: 'subtrahend' }];
					}}>Add Terms</Button
				>
			</div>
			<!-- {#each problem.tiles as tile, index}
					<Input
						type="number"
						placeholder="Enter value"
						bind:value={editedProblem.tiles[index]}
						class="mb-2 w-32"
					/>
            {/each} -->
			<ProblemTerms bind:terms={editedProblem.terms} operator={editedProblem.operator} />
		{/if}
	{/snippet}
</BaseProblem>
