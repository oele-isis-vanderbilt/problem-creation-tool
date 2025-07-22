<script lang="ts">
	import type { FillInTheBlankProblem } from '$lib/services/models';
	import MathField from '../../MathField.svelte';
	import type { MathfieldElement, Selection } from 'mathlive';
	import { onMount } from 'svelte';

	let {
		problem = $bindable()
	}: {
		problem: FillInTheBlankProblem;
	} = $props();

	let mfElement: MathfieldElement | null = $state(null);
	let placeholderCount = $state(0);

	const isEmptySelection = (selection: Selection | null | undefined) => {
		if (!selection) return true;
		return mfElement?.getValue(selection).length === 0;
	};

	const getPlaceholder = (selectionValue: string) => {
		const placeholder = `blank_${++placeholderCount}`;
		problem.blanks[placeholder] = selectionValue;
		return `\\placeholder[${placeholder}]{?}`;
	};

	onMount(() => {
		if (mfElement) {
			console.log('Mathfield Element:', mfElement);
			mfElement.menuItems = [
				{
					label: 'Mark as Blank',
					visible: () => {
						return !isEmptySelection(mfElement?.selection);
					},
					onMenuSelect: () => {
						const selection = mfElement?.selection;
						if (selection) {
							const value = mfElement?.getValue(selection);
							const placeholder = getPlaceholder(value!);
							mfElement?.insert(placeholder, {
								feedback: false,
								focus: true,
								insertionMode: 'replaceSelection'
							});
						}
					}
				},
				...mfElement.menuItems
			];

			mfElement.addEventListener('input', () => {
				const prompts = mfElement?.getPrompts();
				if (prompts) {
					problem.blanks = Object.fromEntries(
						Object.entries(problem.blanks).filter(([key]) => prompts.includes(key))
					);
				}
				problem.blanks = { ...problem.blanks };
			});
		}
	});

	let blanksJSONString = $derived.by(() => {
		return JSON.stringify(problem.blanks, null, 2);
	});
</script>

<div class="flex h-full w-full flex-col gap-10 py-2">
	<MathField
		bind:mfElement
		bind:value={problem.latex}
		placeholder="Type your equation here"
		style="width: 100%; height: 100px;"
		class="p-4 text-4xl"
	/>
	<pre class="mt-4 rounded-lg bg-gray-100 p-4">{blanksJSONString}</pre>
</div>
