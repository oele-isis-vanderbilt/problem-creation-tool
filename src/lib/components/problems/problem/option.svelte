<script lang="ts">
	import type { MultipleChoiceOption } from '$lib/services/models';
	import { Button, Input, Toggle } from 'flowbite-svelte';
	import HeroiconsPlusCircle16Solid from 'virtual:icons/heroicons-solid/plus-circle';
	import HeroIconsTrash from 'virtual:icons/heroicons-solid/trash';
	import SelectMisconception from '$lib/components/concept/select-misconception.svelte';

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
		onAddOption: () => void;
		onToggleCorrect: () => void;
	} = $props();
</script>

<div
	class="bg-primary-50 dark:bg-primary-400 flex h-full w-full items-center justify-between gap-2 rounded-lg border-none"
>
	<div class="flex w-3/4 flex-1 flex-row gap-2">
		<Input id="value" required type="text" bind:value={option.value} placeholder="Option Value" />
		{#if !option.isCorrect}
			<SelectMisconception bind:selectedMisconceptionId={option.misconception} />
		{/if}
	</div>
	{#if isLast}
		<Button onclick={onAddOption}>
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
