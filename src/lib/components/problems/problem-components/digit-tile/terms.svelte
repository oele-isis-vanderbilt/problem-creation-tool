<script lang="ts">
	import type { DigitTileProblem } from '$lib/services/models';
	import { Button, Input, Select } from 'flowbite-svelte';
	import { Operator } from '$lib/services/models';

	let {
		problem = $bindable()
	}: {
		problem: DigitTileProblem;
	} = $props();

	const selectItems = $derived.by(() => {
		switch (problem.operator) {
			case Operator.PLUS:
				return [
					{
						name: 'addend',
						value: 'addend'
					}
				];
			case Operator.MINUS:
				return [
					{
						name: 'minuend',
						value: 'minuend'
					},
					{
						name: 'subtrahend',
						value: 'subtrahend'
					}
				];
			case Operator.MULTIPLY:
				return [
					{
						name: 'multiplicand',
						value: 'multiplicand'
					},
					{
						name: 'multiplier',
						value: 'multiplier'
					}
				];
		}
	});
</script>

<div class="mb-4 flex flex-row items-center justify-between">
	<h2 class="text-2xl font-bold">Terms</h2>
	<Button
		onclick={() => {
			// @ts-ignore
			problem.terms = [...problem.terms, { digitSlots: 1, role: selectItems[0].value }];
			problem.terms = problem.terms;
		}}>Add Terms</Button
	>
</div>

<div class="flex flex-col">
	{#each problem.terms as term, index}
		<div class="mb-2 flex items-center gap-2">
			<Select items={selectItems} bind:value={term.role}></Select>
			<Input type="number" placeholder="Enter number of digit slots" bind:value={term.digitSlots} />
			<Button
				color="red"
				onclick={() => {
					problem.terms.splice(index, 1);
					problem.terms = problem.terms; // Trigger reactivity
				}}
			>
				Remove
			</Button>
		</div>
	{/each}
</div>
