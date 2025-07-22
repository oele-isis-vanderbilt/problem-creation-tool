<script lang="ts">
	import type { FillInTheBlankProblem, FillInTheBlankProblemRunState } from '$lib/services/models';
	import type { MathfieldElement } from 'mathlive';
	import MathField from '../../MathField.svelte';
	import { onMount } from 'svelte';

	let {
		problem,
		blankValues = $bindable({}),
		mfElement = $bindable(null)
	}: {
		problem: FillInTheBlankProblem;
		blankValues: Record<string, string>;
		mfElement?: MathfieldElement | null;
	} = $props();

	onMount(() => {
		if (mfElement) {
			mfElement.focus();
			mfElement?.addEventListener('input', () => {
				const prompts = mfElement?.getPrompts();
				prompts?.forEach((prompt) => {
					const value = mfElement?.getPromptValue(prompt);
					if (!value) {
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
		value={problem.latex}
		read-only
		placeholder="Type your equation here"
		style="width: 100%; height: 100px;"
		class="p-4 text-4xl"
	/>
</div>
