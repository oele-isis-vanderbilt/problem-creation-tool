<script lang="ts">
	import type { NDigitOperation } from '$lib/services/models';
	import { Operator } from '$lib/services/models';
	import { Input, Select, Toggle, type SelectOptionType } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { getExpectedResult } from './utils';

	let {
		problem = $bindable(),
		mode = 'edit',
		resultBlockValues = $bindable([]),
		carryBlockValues = $bindable([])
	}: {
		problem: NDigitOperation;
		mode?: 'edit' | 'preview' | 'frozen';
		resultBlockValues?: string[];
		carryBlockValues?: string[];
	} = $props();

	onMount(() => {
		if (mode === 'preview') {
			if (!carryBlockValues?.length) {
				carryBlockValues = Array(getCarryBurrowBlocks(problem.operand1).length).fill('');
			}
			if (!resultBlockValues?.length) {
				resultBlockValues = Array(getInputBlocks().length).fill('');
			}
		} else if (mode === 'frozen' && !carryBlockValues?.length) {
			carryBlockValues = Array(getCarryBurrowBlocks(problem.operand1).length).fill('');
		}
	});

	let selectItems = Object.values(Operator).map((operator) => {
		return {
			name: operator as string,
			value: operator
		} as SelectOptionType<Operator>;
	});

	function getOperator(operator: Operator) {
		switch (operator) {
			case Operator.PLUS:
				return '+';
			case Operator.MINUS:
				return '-';
			case Operator.MULTIPLY:
				return '\u2A09';
			default:
				return '';
		}
	}

	function getInputBlocks() {
		let result = getExpectedResult(problem);

		let blocks = `${result}`.split('').map((digit) => {
			return {
				digit: digit,
				carry: false,
				borrow: false
			};
		});
		return blocks;
	}

	function getCarryBurrowBlocks(operand: string) {
		let blocks = operand
			.trim()
			.split('')
			.map((digit) => {
				return {
					digit: digit
				};
			});
		blocks.push({
			digit: ''
		});

		return blocks;
	}

	function getBlock(operand: string) {
		return operand
			.trim()
			.split('')
			.map((digit) => {
				return {
					digit: digit
				};
			});
	}

	let isFrozen = $derived(mode === 'frozen');
</script>

{#if mode === 'preview' || mode === 'frozen'}
	<div class="flex w-64 flex-col">
		{#if problem.includeCarryAndBorrow}
			<div class="mb-2 flex flex-1 flex-row justify-end gap-2">
				{#each getCarryBurrowBlocks(problem.operand1) as _block, index}
					<Input
						disabled={isFrozen}
						type="text"
						class="w-10 text-xl"
						bind:value={carryBlockValues[index]}
					/>
				{/each}
			</div>
		{/if}
		<div class="mb-2 flex flex-1 flex-row justify-end gap-2">
			{#each getBlock(problem.operand1) as block}
				<Input type="text" class="w-10 text-xl" value={block.digit} disabled />
			{/each}
		</div>
		<div class="mb-2 flex flex-row justify-end gap-2">
			<Input type="text" class="w-10 text-xl" value={getOperator(problem.operator)} disabled />
			{#each getBlock(problem.operand2) as block}
				<Input type="text" class="w-10 text-xl" value={block.digit} disabled />
			{/each}
		</div>
		<hr class="m-2 w-64 self-center-safe" />
		<div class="flex flex-row items-end justify-end gap-2">
			{#each getInputBlocks() as block, index}
				{#if isFrozen}
					<Input type="text" class="w-10 text-xl" value={resultBlockValues[index]} disabled />
				{:else}
					<Input type="text" class="w-10 text-xl" bind:value={resultBlockValues[index]} />
				{/if}
			{/each}
		</div>
	</div>
{:else}
	<div class="mb-2 flex w-full flex-row items-center justify-between gap-2">
		<Input bind:value={problem.operand1} placeholder="Operand 1" />
		<Select
			bind:value={problem.operator}
			items={selectItems}
			placeholder="Operator"
			class="min-w-16"
		/>
		<Input bind:value={problem.operand2} placeholder="Operand 2" />
		<Toggle bind:checked={problem.includeCarryAndBorrow} class="min-w-72"
			>Include carry and burrow blocks</Toggle
		>
	</div>
{/if}
