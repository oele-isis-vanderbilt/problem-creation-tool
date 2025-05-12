<script lang="ts">
	import type { MultipleChoiceOption } from '$lib/services/models';
	import { Button } from 'flowbite-svelte';
	import Option from './option.svelte';

	let {
		options = $bindable()
	}: {
		options: MultipleChoiceOption[];
	} = $props();
</script>

<div class="mb-2 flex flex-row items-center justify-between gap-2">
	<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Options</h2>
	<Button
		onclick={() => {
			options.push({
				value: '',
				displayName: '',
				isCorrect: false,
				misconception: ''
			});
		}}
	>
		Add Option
	</Button>
</div>
<div class="mb-2 flex flex-col gap-4">
	{#each options as _, index}
		<Option
			bind:option={options[index]}
			isLast={index === options.length - 1}
			onDeleteOption={() => {
				options = options.filter((_, i) => i !== index);
			}}
			onAddOption={() => {
				options.push({
					value: '',
					displayName: '',
					isCorrect: false,
					misconception: ''
				});
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
