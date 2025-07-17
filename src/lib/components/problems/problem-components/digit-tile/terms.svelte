<script lang="ts">
	import type { DigitTileProblem, TermConfig } from '$lib/services/models';
	import { Button, Input, Select } from 'flowbite-svelte';
	import { Operator } from '$lib/services/models';
	import { untrack } from 'svelte';

	let {
		problem = $bindable()
	}: {
		problem: DigitTileProblem;
	} = $props();

	let terms: TermConfig[] = $state(JSON.parse(JSON.stringify(problem.terms)));

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

	function updateTerms(index: number, number: number) {
		// Update the term at the specified index
		terms[index].digits = number;

		let newTerms = terms.map((term) => {
			return {
				digits: Number(term.digits),
				role: term.role
			};
		});
		problem.terms = [...newTerms];
	}

	function updateTermsRole(index: number, role: string) {
		// @ts-ignore
		terms[index].role = role;

		problem.terms = terms.map((term) => {
			return {
				digits: Number(term.digits),
				role: term.role
			};
		});
		problem.terms = [...problem.terms];
	}
</script>

<div class="mb-4 flex flex-row items-center justify-between">
	<h2 class="text-2xl font-bold">Terms</h2>
	<Button
		onclick={() => {
			// @ts-ignore
			terms = [...terms, { digits: 1, role: selectItems[0].value }];
			terms = terms;
		}}>Add Terms</Button
	>
</div>

<div class="flex flex-col">
	{#each terms as term, index}
		<div class="mb-2 flex items-center gap-2">
			<Select items={selectItems} bind:value={() => term.role, updateTermsRole.bind(null, index)}
			></Select>
			<Input
				type="number"
				placeholder="Enter value"
				bind:value={() => term.digits, updateTerms.bind(null, index)}
			/>
			<Button
				color="red"
				onclick={() => {
					terms.splice(index, 1);
					terms = problem.terms;
				}}
			>
				Remove
			</Button>
		</div>
	{/each}
</div>
