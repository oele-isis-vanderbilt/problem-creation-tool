<script lang="ts">
	import type {
		MultipleChoiceOption,
		MultipleChoiceOptionFraction,
		MultipleChoiceOptionImage,
		MultipleChoiceOptionText
	} from '$lib/services/models';
	import { Button, Dropdown, DropdownDivider, DropdownItem } from 'flowbite-svelte';
	import Option from './option.svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { MCQOptionKind } from '$lib/services/models';
	import { store } from '$lib/services/knowLearningStore.svelte';

	const { uuid } = store!;
	let {
		options = $bindable()
	}: {
		options: MultipleChoiceOption[];
	} = $props();

	function addOption(kind: MCQOptionKind) {
		switch (kind) {
			case MCQOptionKind.TEXT:
				options.push({
					id: uuid(),
					kind: MCQOptionKind.TEXT,
					value: '',
					displayName: '',
					isCorrect: false,
					misconception: ''
				} as MultipleChoiceOptionText);
				options = [...options];
				break;
			case MCQOptionKind.IMAGE:
				options.push({
					id: uuid(),
					kind: MCQOptionKind.IMAGE,
					imageUUID: '',
					isCorrect: false,
					misconception: ''
				} as MultipleChoiceOptionImage);
				options = [...options];
				break;
			case MCQOptionKind.FRACTION:
				options.push({
					id: uuid(),
					kind: MCQOptionKind.FRACTION,
					numerator: '',
					denominator: '',
					wholeNumber: '',
					isCorrect: false,
					misconception: ''
				} as MultipleChoiceOptionFraction);
				options = [...options];
				break;
		}
	}

	let isOptionAdderOpen = $state(false);
</script>

<div class="mb-2 flex flex-row items-center justify-between gap-2">
	<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Options</h2>

	<Button>Add Option<ChevronDownOutline class="ms-2 h-6 w-6 text-white dark:text-white" /></Button>
	<Dropdown simple bind:isOpen={isOptionAdderOpen}>
		{#each Object.values(MCQOptionKind) as optionKind}
			<DropdownItem
				onclick={() => {
					addOption(optionKind);
					isOptionAdderOpen = !isOptionAdderOpen;
				}}
			>
				{optionKind}
			</DropdownItem>
			<DropdownDivider />
		{/each}
	</Dropdown>
</div>
<div class="mb-2 flex flex-col gap-4">
	{#each options as _, index}
		<Option
			bind:option={options[index]}
			isLast={index === options.length - 1}
			onDeleteOption={() => {
				options = options.filter((_, i) => i !== index);
			}}
			onAddOption={(kind) => {
				addOption(kind);
			}}
			onToggleCorrect={() => {
				options = options.map((option, i) => {
					if (i !== index) {
						option.isCorrect = false;
					}
					return option;
				});
			}}
		/>
	{/each}
</div>
{#if options.length === 0}
	<p class="text-gray-500 dark:text-gray-400">No options available</p>
{/if}
