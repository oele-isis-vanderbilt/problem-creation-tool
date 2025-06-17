<script lang="ts">
	import type { BaseProblemProps } from '../base-problem/problem.svelte';
	import BaseProblem from '../base-problem/problem.svelte';
	import NDigitOperationBlock from './n-digit-operation-block.svelte';
	import type { NDigitOperation, NDigitOperationRunState } from '$lib/services/models';
	import validateProblem from './validator';
	import Error from '../base-problem/error.svelte';

	let {
		problem,
		mode = 'build',
		onProblemUpdated = () => {},
		onRunStateChange = () => {}
	}: Omit<BaseProblemProps, 'problem'> & {
		problem: NDigitOperation;
		onRunStateChange: (state: NDigitOperationRunState) => void;
	} = $props();

	let editedProblem = $state(JSON.parse(JSON.stringify(problem)));

	let carryBlockValues: string[] = $state([]);
	let resultBlockValues: string[] = $state([]);

	function getCanGrade(): boolean {
		return resultBlockValues.length > 0 && resultBlockValues.every((value) => value.trim() !== '');
	}

	function isCorrect(): boolean {
		if (!getCanGrade()) {
			return false;
		}
		const expectedResult = eval(
			`${editedProblem.operand1} ${editedProblem.operator} ${editedProblem.operand2}`
		) as number;
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
		{/if}
	{/snippet}
</BaseProblem>
