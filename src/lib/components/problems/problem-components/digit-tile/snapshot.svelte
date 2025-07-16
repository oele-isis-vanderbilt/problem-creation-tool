<script lang="ts">
	import {
		Operator,
		type DigitTileProblem,
		type DigitTileProblemRunState
	} from '$lib/services/models';
	import { getByDisplayValue } from '@testing-library/svelte';
	import Mathjax from '../../Mathjax.svelte';

	let {
		problem,
		problemSnapshot = null
	}: {
		problem: DigitTileProblem;
		problemSnapshot: DigitTileProblemRunState | null;
	} = $props();

	function getOperatorSymbol(op: Operator) {
		switch (op) {
			case Operator.PLUS:
				return '+';
			case Operator.MINUS:
				return '-';
			case Operator.MULTIPLY:
				return '×';
			default:
				return '';
		}
	}

	const maxSlots = Math.max(
		...problem.terms.map((line) => line.digits.toString().split('').length)
	);
	const totalCols = maxSlots + 1;

	function getDisplayValue(rowIdx: number, slotIdx: number) {
		if (problemSnapshot) {
			return problemSnapshot.terms.find(
				(term) => term.termIndex === rowIdx && term.slotIndex == slotIdx
			)?.value;
		}
	}

	problem.terms.forEach((line) => {
		console.log(line.digits.toString().split(''));
	});
</script>

{#snippet block(problem: DigitTileProblem, useSnapshot: boolean = true)}
	{#each problem.terms as line, rowIdx}
		<div class="flex flex-row items-center gap-4">
			{#if rowIdx == problem.terms.length - 1}
				{#each Array(Math.max(totalCols - line.digits.toString().split('').length - 1, 0))}
					<div class="h-32 w-32"></div>
				{/each}
				<div
					class="bg-red-60 flex h-32 w-32 items-center justify-center rounded border-dashed text-8xl"
				>
					{getOperatorSymbol(problem.operator)}
				</div>
			{:else}
				{#each Array(Math.max(totalCols - line.digits
								.toString()
								.split('').length, 0)) as _, emptyIdx}
					<div class="h-32 w-32"></div>
				{/each}
			{/if}

			{#each line.digits.toString().split('') as term, slotIdx (`${rowIdx}-${slotIdx}`)}
				{@const displayValue = useSnapshot ? getDisplayValue(rowIdx, slotIdx) : term}
				<div
					class="flex h-32 w-32 cursor-grab items-center justify-center rounded border-3 border-dashed bg-green-50"
				>
					{#if displayValue}
						<Mathjax math={`\$${displayValue}\$`} textSize="text-4xl" />
					{:else}
						<Mathjax math={`\$\phi\$`} textSize="text-4xl" />
					{/if}
				</div>
			{/each}
		</div>
	{/each}
{/snippet}

<div
	class="flex h-full w-full flex-col items-center justify-center gap-8 rounded px-2 py-20 shadow-lg"
>
	{#if problemSnapshot}
		{#if problemSnapshot.isCorrect}
			{@render block(problem)}
			<div class="w-full flex-col gap-2 rounded-lg bg-green-600 p-4 text-white">
				<p class="text-lg font-semibold">Well Done!!</p>
				<p class="text-sm">You organized the tiles properly for this problem</p>
			</div>
		{:else}
			{@render block(problem)}
			<div class="w-full flex-col gap-2 rounded-lg bg-red-600 p-4 text-white">
				<p class="text-lg font-semibold">Incorrect Arrangement</p>
				<p class="text-sm">The arrangement of tiles is incorrect for the problem</p>
				<p class="text-sm">The correct arrangement is shown below</p>
			</div>
			{@render block(problem, false)}
		{/if}
	{:else}
		<div class="flex-col gap-2 rounded-lg bg-yellow-600 p-4 text-white">
			<p class="text-lg font-semibold">Tiles not organized`</p>
			<p class="text-sm">The correct arrangement is:</p>
		</div>
		{@render block(problem, false)}
	{/if}
</div>
