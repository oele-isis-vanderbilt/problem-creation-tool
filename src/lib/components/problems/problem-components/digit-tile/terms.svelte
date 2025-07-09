<script lang="ts">
	import type { TermConfig } from '$lib/services/models';
	import { Button, Input, Select } from 'flowbite-svelte';
	import { Operator } from '$lib/services/models';

	let {
		operator,
		terms = $bindable()
	}: {
		operator: Operator;
		terms: TermConfig[];
	} = $props();

	const selectItems = $derived.by(() => {
		switch (operator) {
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

<div class="flex flex-col">
	{#each terms as term, index}
		<div class="mb-2 flex items-center gap-2">
			<Select items={selectItems} bind:value={term.role}></Select>
			<Input type="text" placeholder="Enter number of digit slots" bind:value={term.digitSlots} />
			<Button
				color="red"
				onclick={() => {
					terms.splice(index, 1);
				}}
			>
				Remove
			</Button>
		</div>
	{/each}
</div>
