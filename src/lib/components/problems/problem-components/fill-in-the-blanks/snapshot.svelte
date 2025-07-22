<script lang="ts">
	import type { FillInTheBlankProblem, FillInTheBlankProblemRunState } from '$lib/services/models';
	import type { MathfieldElement } from 'mathlive';
	import MathField from '$lib/components/problems/MathField.svelte';
	import { onMount } from 'svelte';
	import { isCorrect } from './grade';

	let {
		problem,
		problemSnapshot = null
	}: {
		problem: FillInTheBlankProblem;
		problemSnapshot?: FillInTheBlankProblemRunState | null;
	} = $props();

	let mfMainElement: MathfieldElement | null = $state(null);

	let mfCorrectElement: MathfieldElement | null = $state(null);

	onMount(() => {
		if (mfMainElement) {
			mfMainElement.insert(problem.latex, {
				feedback: false,
				focus: false,
				insertionMode: 'replaceAll'
			});

			const prompts = mfMainElement.getPrompts();
			prompts.forEach((prompt) => {
				if (problemSnapshot?.blankValues[prompt]) {
					mfMainElement?.setPromptValue(prompt, problemSnapshot.blankValues[prompt], {
						feedback: false,
						focus: false
					});

					mfMainElement?.setPromptState(prompt, 'correct');
				} else {
					mfMainElement?.setPromptState(prompt, 'incorrect');
				}
			});

			prompts?.forEach((prompt) => {
				const value = mfMainElement?.getPromptValue(prompt);
				if (!value || value.trim() === '?') {
					mfMainElement?.setPromptState(prompt, 'incorrect', true);
				} else {
					if (isCorrect(value, problem.blanks[prompt].toString())) {
						mfMainElement?.setPromptState(prompt, 'correct', true);
					} else {
						mfMainElement?.setPromptState(prompt, 'incorrect', true);
					}
				}
			});
		}

		if (mfCorrectElement) {
			mfCorrectElement.insert(problem.latex, {
				feedback: false,
				focus: false,
				insertionMode: 'replaceAll'
			});

			const prompts = mfCorrectElement.getPrompts();
			prompts.forEach((prompt) => {
				mfCorrectElement?.setPromptValue(prompt, problem.blanks[prompt].toString(), {
					feedback: false,
					focus: false
				});
				mfCorrectElement?.setPromptState(prompt, 'correct', true);
			});
		}
	});
</script>

<div class="flex h-full w-full flex-col gap-4 py-2">
	<MathField
		bind:mfElement={mfMainElement}
		read-only
		placeholder="Type your equation here"
		style="width: 100%; height: 100px;"
		class="p-4 text-4xl"
	/>

	{#if problemSnapshot}
		{#if problemSnapshot.isCorrect}
			<div class="flex-col gap-2 rounded-lg bg-green-600 p-4 text-white">
				<p class="text-lg font-semibold">Well Done!!</p>

				<p class="text-sm">The answer is correct for the problem, as you entered</p>
			</div>
		{:else}
			<div class="flex-col gap-2 rounded-lg bg-red-600 p-4 text-white">
				<p class="text-lg font-semibold">Incorrect Answer, You Filled</p>
				<p>
					{Object.values(problemSnapshot?.blankValues || []).join(', ')} in the blanks, which is not
					correct
				</p>
				<p class="text-sm">The correct answers are filled, as shown below:</p>
			</div>
			<MathField
				bind:mfElement={mfCorrectElement}
				read-only
				placeholder="Type your equation here"
				style="width: 100%; height: 100px;"
				class="p-4 text-4xl"
			/>
		{/if}
	{:else}
		<div class="flex-col gap-2 rounded-lg bg-yellow-600 p-4 text-white">
			<p class="text-lg font-semibold">No Input Provided.</p>
			<p class="text-sm">The correct answers are filled, as shown below:</p>
		</div>
		<MathField
			bind:mfElement={mfCorrectElement}
			read-only
			placeholder="Type your equation here"
			style="width: 100%; height: 100px;"
			class="p-4 text-4xl"
		/>
	{/if}
</div>
