<script lang="ts">
	import type { FillInTheBlankProblem, FillInTheBlankProblemRunState } from '$lib/services/models';
	import type { MathfieldElement } from 'mathlive';
	import MathField from '$lib/components/problems/MathField.svelte';
	import { onMount } from 'svelte';

	let {
		problem,
		blankValues = $bindable({}),
		mfElement = $bindable(null)
	}: {
		problem: FillInTheBlankProblem;
		blankValues: Record<string, string>;
		mfElement?: MathfieldElement | null;
		locked?: boolean;
	} = $props();

	onMount(() => {
		if (mfElement) {
			mfElement.focus();
			mfElement.insert(problem.latex, {
				feedback: false,
				focus: true,
				insertionMode: 'replaceAll'
			});

			const prompts = mfElement.getPrompts();
			prompts.forEach((prompt) => {
				if (blankValues[prompt]) {
					mfElement?.setPromptValue(prompt, blankValues[prompt], {
						feedback: false,
						focus: true
					});

					mfElement?.setPromptState(prompt, 'correct');
				}
			});

			mfElement?.addEventListener('input', () => {
				const prompts = mfElement?.getPrompts();
				prompts?.forEach((prompt) => {
					const value = mfElement?.getPromptValue(prompt);
					if (!value || value.trim() === '?') {
						mfElement?.setPromptState(prompt, 'incorrect');
					} else {
						mfElement?.setPromptState(prompt, 'correct');
						blankValues[prompt] = value;
					}
				});
			});
		}
	});
</script>

<div class="flex h-full w-full flex-col gap-10 py-2">
	<MathField
		bind:mfElement
		read-only
		placeholder="Type your equation here"
		style="width: 100%; height: 100px;"
		class="p-4 text-4xl"
	/>
</div>
