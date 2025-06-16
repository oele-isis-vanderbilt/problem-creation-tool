<script lang="ts">
	import type { AnswerBlock } from '$lib/services/models';
	import { Input } from 'flowbite-svelte';
	import HeroIconsTrash from 'virtual:icons/heroicons-solid/trash';

	let {
		answerBlock = $bindable(),
		mode = 'edit',
		onDeleteBlock = () => {}
	}: {
		mode?: 'preview' | 'edit';
		answerBlock: AnswerBlock;
		onDeleteBlock?: () => void;
	} = $props();
</script>

{#if mode === 'preview'}
	<div class="flex w-full flex-row items-center justify-center gap-2">
		{#if answerBlock.hasOwnProperty('label')}
			<div class="font-bold">
				<span class="text-gray-900 dark:text-white">{' '}{answerBlock.label} {' '}</span>
			</div>
		{/if}
		<Input type="text" placeholder="Enter Answer" />
	</div>
{:else}
	<div class="flex flex-row gap-2">
		{#if answerBlock.hasOwnProperty('label')}
			<Input type="text" bind:value={answerBlock.label} placeholder="Block label" />
		{/if}
		<Input type="text" bind:value={answerBlock.value} placeholder="Answer block value" />
		<HeroIconsTrash
			role="button"
			class="my-2 text-4xl hover:text-red-500"
			onclick={(event: Event) => {
				onDeleteBlock();
			}}
		></HeroIconsTrash>
	</div>
{/if}
