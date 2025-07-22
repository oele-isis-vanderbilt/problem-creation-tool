<script lang="ts">
	import type { FillInTheBlankProblem, FillInTheBlankProblemRunState } from '$lib/services/models';
	import BaseProblem, { type BaseProblemProps } from '../base-problem/problem.svelte';
	import validateProblem from './validator';
	import FillInTheBlankBuilder from './builder.svelte';
	import FillInTheBlankPreview from './preview.svelte';
	import { MathfieldElement } from 'mathlive';
	import Error from '../base-problem/error.svelte';
	import FillInTheBlankSnapshot from './snapshot.svelte';
	import { isCorrect } from './grade';

	let {
		problem,
		mode = 'build',
		onProblemUpdated = () => {},
		onRunStateChange = () => {},
		problemSnapshot = null
	}: Omit<BaseProblemProps, 'problem' | 'problemSnapshot'> & {
		problem: FillInTheBlankProblem;
		problemSnapshot?: FillInTheBlankProblemRunState | null;
		onRunStateChange: (state: FillInTheBlankProblemRunState) => void;
	} = $props();

	let editedProblem = $state<FillInTheBlankProblem>(JSON.parse(JSON.stringify(problem)));
	let previewMathField: MathfieldElement | null = $state(null);
	let blankValues = $state<Record<string, string>>(problemSnapshot?.blankValues || {});

	const { canGrade, canGradeFeedback } = $derived.by(() => {
		const cg = Object.keys(blankValues).length === Object.keys(editedProblem.blanks).length;
		return {
			canGrade: cg,
			canGradeFeedback: cg ? [] : ['Not all blanks are filled']
		};
	});

	let runState = $derived.by(() => {
		const state: FillInTheBlankProblemRunState = {
			problem: $state.snapshot(editedProblem),
			blankValues: $state.snapshot(blankValues),
			isCorrect: Object.entries(blankValues).every(([key, value]) => {
				const correctValue = editedProblem.blanks[key].toString();
				const enteredValue = value.trim().toString();
				return isCorrect(enteredValue, correctValue);
			}),
			canGrade: canGrade,
			canGradeFeedback: canGradeFeedback,
			kind: problem.kind
		};
		onRunStateChange(state);
		return state;
	});

	let validator = $derived.by(() => {
		return () => runState.canGradeFeedback;
	});

	$effect(() => {
		editedProblem.blanks;
		Object.entries(editedProblem.blanks).forEach(([key, value]) => {
			key;
			value;
		});
		onProblemUpdated(editedProblem);
	});
</script>

<BaseProblem
	{mode}
	bind:problem={editedProblem}
	{onProblemUpdated}
	{problemSnapshot}
	validators={[(p) => validateProblem(p as FillInTheBlankProblem)]}
>
	{#snippet body(displayMode)}
		{#if displayMode === 'build'}
			<FillInTheBlankBuilder bind:problem={editedProblem} />
		{:else if displayMode === 'assess'}
			<FillInTheBlankPreview
				bind:mfElement={previewMathField}
				problem={editedProblem}
				bind:blankValues
			/>
			<Error validators={[validator]} />
		{:else if displayMode == 'snapshot'}
			<FillInTheBlankSnapshot problem={editedProblem} {problemSnapshot} />
		{/if}
	{/snippet}
</BaseProblem>
