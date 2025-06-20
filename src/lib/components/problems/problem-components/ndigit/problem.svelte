<script lang="ts">
	import type { BaseProblemProps } from '../base-problem/problem.svelte';
	import BaseProblem from '../base-problem/problem.svelte';
	import NDigitOperationBlock from './n-digit-operation-block.svelte';
	import { type NDigitOperation, type NDigitOperationRunState } from '$lib/services/models';
	import validateProblem from './validator';
	import Error from '../base-problem/error.svelte';
	import { getExpectedResult } from './utils';

	let {
		problem,
		mode = 'build',
		onProblemUpdated = () => {},
		onRunStateChange = () => {},
		problemSnapshot = null
	}: Omit<BaseProblemProps, 'problem' | 'problemSnapshot'> & {
		problem: NDigitOperation;
		problemSnapshot?: NDigitOperationRunState | null;
		onRunStateChange: (state: NDigitOperationRunState) => void;
	} = $props();

	let editedProblem: NDigitOperation = $state(JSON.parse(JSON.stringify(problem)));

	let expectedResult: number = $state(getExpectedResult(problem));

	let carryBlockValues: string[] = $state([]);
	let resultBlockValues: string[] = $state([]);

	function getCanGrade(): boolean {
		return resultBlockValues.length > 0 && resultBlockValues.every((value) => value.trim() !== '');
	}

	function isCorrect(): boolean {
		if (!getCanGrade()) {
			return false;
		}
		const expectedResult = getExpectedResult(problem);
		const result = resultBlockValues.join('');
		return result === `${expectedResult}`;
	}

	let runState = $derived.by(() => {
		const state = {
			canGrade: getCanGrade(),
			canGradeFeedback: resultBlockValues
				.map((value, index) => {
					if (value.trim() === '') {
						return `Result block ${index + 1} is empty`;
					}
					return '';
				})
				.filter((msg) => msg !== ''),

			problem: $state.snapshot(editedProblem),
			carryAndBurrowBlocks: $state.snapshot(carryBlockValues),
			finalResult: getCanGrade() ? resultBlockValues.join('') : '',
			isCorrect: isCorrect()
		} as NDigitOperationRunState;

		onRunStateChange(state);
		return state;
	});

	let validator = $derived.by(() => {
		return (p) => runState.canGradeFeedback;
	});

	$effect(() => {
		editedProblem.operand1;
		editedProblem.operand2;
		editedProblem.operator;
		editedProblem.includeCarryAndBorrow;
		onProblemUpdated(editedProblem);
	});
</script>

<BaseProblem
	{mode}
	bind:problem={editedProblem}
	{onProblemUpdated}
	validators={[(p) => validateProblem(p as NDigitOperation)]}
>
	{#snippet body(displayMode)}
		{#if displayMode === 'build'}
			<NDigitOperationBlock bind:problem={editedProblem} />
		{:else if displayMode === 'assess'}
			<div class="flex w-full flex-col items-center gap-4">
				<NDigitOperationBlock
					{problem}
					mode="preview"
					bind:carryBlockValues
					bind:resultBlockValues
				/>
				<Error validators={[validator]} />
			</div>
		{:else if displayMode === 'snapshot'}
			<div class="flex w-full flex-col items-center gap-4">
				{#if problemSnapshot}
					<NDigitOperationBlock
						mode="frozen"
						{problem}
						carryBlockValues={problemSnapshot.carryAndBurrowBlocks}
						resultBlockValues={problemSnapshot.finalResult.split('')}
					/>
					{#if problemSnapshot.isCorrect}
						<div class="w-full flex-col gap-2 rounded-lg bg-green-600 p-4 text-white">
							<p class="text-lg font-semibold">Well Done!!</p>
							<p class="text-sm">
								This reuslt {problemSnapshot.finalResult} is correct for the problem, as you entered
							</p>
						</div>
					{:else}
						<div class="w-full flex-col gap-2 rounded-lg bg-red-600 p-4 text-white">
							<p class="text-lg font-semibold">Incorrect Result!!</p>
							<p class="text-sm">Your result {problemSnapshot.finalResult} is incorrect.</p>
							<p class="text-sm">
								The correct answer for this problem is {getExpectedResult(problem)}.
							</p>
						</div>
					{/if}
				{:else}
					<NDigitOperationBlock
						mode="frozen"
						{problem}
						resultBlockValues={expectedResult.toString().split('')}
					/>
					<div class="w-full flex-col gap-2 rounded-lg bg-yellow-600 p-4 text-white">
						<p class="text-lg font-semibold">No Input Provided</p>
						<p class="text-sm">The correct result is {expectedResult}.</p>
					</div>
				{/if}
			</div>
		{/if}
	{/snippet}
</BaseProblem>
