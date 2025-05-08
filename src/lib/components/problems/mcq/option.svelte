<script lang="ts">
	import type { MultipleChoiceOption } from '$lib/services/models';
	import { Button, Input, Toggle } from 'flowbite-svelte';
	import HeroiconsPlusCircle16Solid from 'virtual:icons/heroicons-solid/plus-circle';
	import HeroIconsTrash from 'virtual:icons/heroicons-solid/trash';

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
	class="flex h-full w-full items-center justify-between gap-2 rounded-lg border-none bg-gray-50 dark:bg-gray-500"
>
	<Input
		id="value"
		required
		type="text"
		bind:value={option.value}
		placeholder="Option Value"
		class="dark:text-white "
	/>
	{#if isLast}
		<Button
			class="bg-gray-500 text-lg hover:bg-gray-600 dark:bg-gray-800 hover:dark:bg-gray-800"
			onclick={onAddOption}
		>
			<HeroiconsPlusCircle16Solid />
		</Button>
	{/if}
	<Toggle id="isCorrect" bind:checked={option.isCorrect} onchange={onToggleCorrect}></Toggle>
	<Button
		class="bg-gray-500 text-lg hover:bg-gray-600 dark:bg-gray-800 hover:dark:bg-gray-800"
		onclick={() => {
			console.log('Delete option clicked');
			onDeleteOption();
		}}
	>
		<HeroIconsTrash class="hover:text-red-500"></HeroIconsTrash>
	</Button>
</div>
