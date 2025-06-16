<script lang="ts">
	import { MCQOptionKind, type MultipleChoiceOption } from '$lib/services/models';
	import { Button, Toggle } from 'flowbite-svelte';
	import HeroiconsPlusCircle16Solid from 'virtual:icons/heroicons-solid/plus-circle';
	import HeroIconsTrash from 'virtual:icons/heroicons-solid/trash';
	import SelectMisconception from '$lib/components/concept/select-misconception.svelte';
	import Text from './mcq-options/text.svelte';
	import Image from './mcq-options/image.svelte';
	import Fraction from './mcq-options/fraction.svelte';

	let {
		option = $bindable(),
		isLast = false,
		onDeleteOption,
		onAddOption,
		onToggleCorrect
	}: {
		option: MultipleChoiceOption;
		isLast: boolean;
		onDeleteOption: () => void;
		onAddOption: (kind: MCQOptionKind) => void;
		onToggleCorrect: () => void;
	} = $props();

	const OptionComponents = {
		[MCQOptionKind.TEXT]: Text,
		[MCQOptionKind.IMAGE]: Image,
		[MCQOptionKind.FRACTION]: Fraction
	};

	const OptionComponent = OptionComponents[option.kind];
</script>

<div
	class="bg-primary-50 dark:bg-primary-400 flex h-full w-full items-center justify-between gap-2 rounded-lg border-none"
>
	<div class="flex w-3/4 flex-1 flex-row items-center gap-2">
		<OptionComponent bind:option />
		{#if !option.isCorrect}
			<SelectMisconception bind:selectedMisconceptionId={option.misconception} />
		{/if}
	</div>
	{#if isLast}
		<Button onclick={() => onAddOption(option.kind)}>
			<HeroiconsPlusCircle16Solid class="text-lg" />
		</Button>
	{/if}
	<Toggle id="isCorrect" bind:checked={option.isCorrect} onchange={onToggleCorrect}></Toggle>
	<Button
		onclick={() => {
			onDeleteOption();
		}}
	>
		<HeroIconsTrash class="text-lg hover:text-red-500"></HeroIconsTrash>
	</Button>
</div>
