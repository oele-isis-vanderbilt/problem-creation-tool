<script lang="ts">
	import { draggable, droppable, type DragDropState } from '@thisux/sveltednd';
	import {
		Operator,
		ProblemKind,
		type DigitTileProblem,
		type DigitTileProblemRunState
	} from '$lib/services/models';
	import Mathjax from '../../Mathjax.svelte';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import { untrack } from 'svelte';
	import Error from '../base-problem/error.svelte';

	let {
		problem,
		onRunStateChange = () => {},
		problemSnapshot = null
	}: {
		problem: DigitTileProblem;
		onRunStateChange: (state: DigitTileProblemRunState) => void;
		problemSnapshot?: DigitTileProblemRunState | null;
	} = $props();

	interface TileItem {
		id: string;
		value: number;
	}

	interface TermItem {
		tileId: string | null;
		termIndex: number;
		slotIndex: number;
		value?: number;
	}

	function randomId() {
		return Math.random().toString(36).substring(2, 15);
	}

	let tiles = $state<TileItem[]>(
		problem.terms.flatMap((term) =>
			term.digits
				.toString()
				.split('')
				.map((digit) => ({
					id: randomId(),
					value: Number(digit)
				}))
		)
	);

	let terms = $state<TermItem[][]>(
		problem.terms.map((term) => {
			return Array(term.digits.toString().split('').length)
				.fill(null)
				.map((_, slotIndex) => ({
					tileId: null,
					termIndex: problem.terms.indexOf(term),
					slotIndex
				}));
		})
	);

	if (problemSnapshot && problemSnapshot.terms) {
		problemSnapshot.terms.forEach((slot) => {
			if (slot.value) {
				const expectedTile = tiles.find((tile) => tile.value === slot.value);
				if (expectedTile) {
					terms[slot.termIndex][slot.slotIndex] = {
						tileId: expectedTile.id,
						termIndex: slot.termIndex,
						slotIndex: slot.slotIndex,
						value: slot.value
					};
					tiles = tiles.filter((tile) => tile.id !== expectedTile.id);
				}
			}
		});
	}

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

	function handleSelfDropTiles(state: DragDropState<TermItem>) {
		let { draggedItem, targetContainer } = state;
		if (!targetContainer) return;
		let termIndex = draggedItem.termIndex;
		let slotIndex = draggedItem.slotIndex;
		if (
			termIndex >= 0 &&
			slotIndex >= 0 &&
			termIndex < terms.length &&
			slotIndex < terms[termIndex].length &&
			'value' in draggedItem
		) {
			terms[termIndex][slotIndex] = {
				tileId: null,
				termIndex,
				slotIndex
			};
			tiles = [
				...tiles,
				{
					id: randomId(),
					value: draggedItem.value!
				}
			];
		}
	}

	function handleDropFromTiles(state: DragDropState<TileItem>) {
		const { draggedItem, targetContainer } = state;
		if (!targetContainer) return;
		const [termIdx, slotIdx] = targetContainer.split('-').map(Number);
		if (termIdx >= 0 && slotIdx >= 0 && termIdx < terms.length && slotIdx < terms[termIdx].length) {
			let term = terms[termIdx][slotIdx];
			if (!term.tileId && !term.value) {
				term.tileId = draggedItem.id;
				term.value = draggedItem.value;
				tiles = tiles.filter((item) => item.id !== draggedItem.id);
				terms = [...terms];
			} else {
				const newTerm = {
					tileId: draggedItem.id,
					termIndex: termIdx,
					slotIndex: slotIdx,
					value: draggedItem.value
				};
				terms[termIdx][slotIdx] = newTerm;
				tiles = tiles.filter((item) => item.id !== draggedItem.id);
				tiles = [
					...tiles,
					{
						id: randomId(),
						value: term.value!
					}
				];
			}
		}
	}

	function handleDropFromTerms(state: DragDropState<TermItem>) {
		const { draggedItem, targetContainer } = state;
		if (!targetContainer) return;
		const [targetTermIdx, targetSlotIdx] = targetContainer.split('-').map(Number);

		// Find source term position
		const sourceTermIdx = draggedItem.termIndex;
		const sourceSlotIdx = draggedItem.slotIndex;

		// Swap the terms
		const sourceTerm = terms[sourceTermIdx][sourceSlotIdx];
		const targetTerm = terms[targetTermIdx][targetSlotIdx];

		terms[sourceTermIdx][sourceSlotIdx] = {
			...targetTerm,
			termIndex: sourceTermIdx,
			slotIndex: sourceSlotIdx
		};
		terms[targetTermIdx][targetSlotIdx] = {
			...sourceTerm,
			termIndex: targetTermIdx,
			slotIndex: targetSlotIdx
		};
		terms = [...terms];
	}

	function handleDropFromTileOrTerms(state: DragDropState<TileItem | TermItem>) {
		const { draggedItem, targetContainer } = state;
		if (!targetContainer) return;
		if ('tileId' in draggedItem) {
			handleDropFromTerms(state as DragDropState<TermItem>);
		} else {
			handleDropFromTiles(state as DragDropState<TileItem>);
		}
	}

	const maxSlots = Math.max(
		...problem.terms.map((line) => line.digits.toString().split('').length)
	);
	const totalCols = maxSlots + 1;

	const isCorrect = (terms: TermItem[][], solution: number): boolean => {
		let operands = terms
			.map((line) => {
				return line.map((term) => term.value || 0).join('');
			})
			.map((operand) => parseInt(operand, 10));
		let result;
		if (operands.length === 0) {
			result = 0;
		} else if (problem.operator === Operator.PLUS) {
			result = operands.reduce((acc, curr) => acc + curr, 0);
		} else if (problem.operator === Operator.MULTIPLY) {
			result = operands.reduce((acc, curr) => acc * curr, 1);
		} else if (problem.operator === Operator.MINUS) {
			result = operands.slice(1).reduce((acc, curr) => acc - curr, operands[0]);
		} else {
			result = operands[0];
		}
		return result === solution;
	};

	let runState = $derived.by(() => {
		const canGrade = terms.every((line) => line.every((term) => term.tileId && term.value));
		const state: DigitTileProblemRunState = {
			kind: ProblemKind.DIGIT_TILE_PROBLEM,
			canGrade: canGrade,
			canGradeFeedback: canGrade ? [] : ['All terms must be filled with tiles before grading.'],
			terms: terms.flatMap((line, termIndex) =>
				line.map((term, slotIndex) => ({
					slotIndex,
					termIndex,
					value: term.value || null
				}))
			),
			isCorrect: canGrade && isCorrect(terms, problem.solution),
			problem: $state.snapshot(problem)
		};
		onRunStateChange(state);
		return state;
	});

	let validator = $derived.by(() => {
		return (p) => runState?.canGradeFeedback || [];
	});
</script>

<div
	class="flex h-full w-full flex-row items-center justify-center gap-8 rounded px-2 py-20 shadow-lg"
>
	<div
		class="flex w-1/2 flex-row items-center justify-center gap-2 rounded-lg bg-gray-50 p-10 py-10 shadow-lg"
		use:droppable={{
			container: 'tiles',
			callbacks: { onDrop: handleSelfDropTiles }
		}}
	>
		{#if tiles.length === 0}
			<span class="text-gray-300">No tiles</span>
		{/if}
		{#each tiles as tile, index (tile.id)}
			<div
				use:draggable={{
					container: tile.id,
					dragData: tile
				}}
				animate:flip={{ duration: 200 }}
				in:fade={{ duration: 150 }}
				out:fade={{ duration: 150 }}
				class="flex h-32 w-32 cursor-grab items-center justify-center rounded-lg border bg-white text-4xl shadow"
			>
				<Mathjax math={`\$${tile.value}\$`} textSize="text-4xl" />
			</div>
		{/each}
	</div>
	<div class="flex w-1/2 flex-col items-center justify-end gap-2">
		{#each terms as line, rowIdx}
			<div class="flex flex-row items-center gap-4">
				{#if rowIdx == problem.terms.length - 1}
					{#each Array(Math.max(totalCols - line.length - 1, 0))}
						<div class="h-32 w-32"></div>
					{/each}
					<div
						class="flex h-32 w-32 items-center justify-center rounded border-dashed bg-red-50 text-8xl"
					>
						{getOperatorSymbol(problem.operator)}
					</div>
				{:else}
					{#each Array(Math.max(totalCols - line.length, 0)) as _, emptyIdx}
						<div class="h-32 w-32"></div>
					{/each}
				{/if}

				{#each line as term, slotIdx (`${rowIdx}-${slotIdx}`)}
					<div
						use:droppable={{
							container: `${rowIdx}-${slotIdx}`,
							callbacks: {
								onDrop: handleDropFromTileOrTerms
							}
						}}
						use:draggable={{
							container: 'tiles',
							dragData: term,
							disabled: term.tileId == null
						}}
						animate:flip={{ duration: 200 }}
						in:fade={{ duration: 150 }}
						out:fade={{ duration: 150 }}
						class="flex h-32 w-32 cursor-grab items-center justify-center rounded border-3 border-dashed bg-green-50"
					>
						{#if term.value}
							{#key term.tileId}
								<Mathjax math={`\$${term.value}\$`} textSize="text-4xl" />
							{/key}
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>
<Error validators={[validator]} />

<style>
	:global(.dragging) {
		opacity: 0.5;
		box-shadow:
			0 4px 6px rgba(0, 0, 0.1),
			0 1px 3px rgba(0, 0, 0, 0.08);
		border: 2px solid #3b82f6;
	}
</style>
