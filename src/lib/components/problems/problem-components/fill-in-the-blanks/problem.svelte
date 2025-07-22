<script lang="ts">
	import type { FillInTheBlankProblem, FillInTheBlankProblemRunState } from '$lib/services/models';
	import BaseProblem, { type BaseProblemProps } from '../base-problem/problem.svelte';
	import validateProblem from './validator';
	import FillInTheBlankBuilder from './builder.svelte';
	import FillInTheBlankPreview from './preview.svelte';
	import { MathfieldElement } from 'mathlive';
	import { Circle3 } from 'svelte-loading-spinners';
	import { on } from 'svelte/events';
	import Error from '../base-problem/error.svelte';

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
	let blankValues = $state<Record<string, string>>({});

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
				const ce = MathfieldElement.computeEngine;
				if (!ce || !previewMathField) return false;
				const promptValue = previewMathField.getPromptValue(key);
				const answer = ce.parse(promptValue);
				const correctAnswer = ce.parse(problem.blanks[key] as LatexString);
				const isCorrect = answer.isSame(correctAnswer);
				return isCorrect;
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
		{:else if displayMode == 'snapshot'}{/if}
	{/snippet}
</BaseProblem>
