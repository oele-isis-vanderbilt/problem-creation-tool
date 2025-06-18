<script lang="ts">
	import type { AnswerBlock } from '$lib/services/models';
	import { Input } from 'flowbite-svelte';
	import HeroIconsTrash from 'virtual:icons/heroicons-solid/trash';

	let {
		answerBlock = $bindable(),
		mode = 'edit',
		onDeleteBlock = () => {},
		blockValue = $bindable('')
	}: {
		mode?: 'preview' | 'edit' | 'frozen';
		answerBlock: AnswerBlock;
		onDeleteBlock?: () => void;
		blockValue?: string;
	} = $props();
</script>

{#if mode === 'preview'}
	<div class="flex w-full flex-row items-center justify-center gap-2">
		{#if answerBlock.hasOwnProperty('label')}
			<div class="font-bold">
				<span class="text-gray-900 dark:text-white">{' '}{answerBlock.label} {' '}</span>
			</div>
		{/if}
		<Input type="text" placeholder="Enter Answer" bind:value={blockValue} />
	</div>
{:else if mode === 'frozen'}
	<div class="flex w-full flex-row items-center justify-center gap-2">
		{#if answerBlock.hasOwnProperty('label')}
			<div class="font-bold">
				<span class="text-gray-900 dark:text-white">{' '}{answerBlock.label} {' '}</span>
			</div>
		{/if}
		<div class="text-gray-900 dark:text-white">
			<Input type="text" placeholder="Enter Answer" value={blockValue} disabled />
		</div>
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
