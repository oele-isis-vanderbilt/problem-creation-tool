<script lang="ts">
	import { Button, Dropdown, DropdownDivider, DropdownItem, Input } from 'flowbite-svelte';

	import type { AnswerBlock } from '$lib/services/models';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import AnswerBlockComponent from './answer-block.svelte';

	let { answerBlocks = $bindable() }: { answerBlocks: AnswerBlock[] } = $props();

	let isAnswerBlockAdderOpen = $state(false);

	function addBlock(withLabel: boolean) {
		withLabel
			? answerBlocks.push({
					value: '',
					label: ''
				} as AnswerBlock)
			: answerBlocks.push({
					value: ''
				} as AnswerBlock);

		answerBlocks = [...answerBlocks];
	}
</script>

<div class="mb-2 flex flex-row items-center justify-between gap-2">
	<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Answer</h2>
	<Button
		>Add Answer Block<ChevronDownOutline class="ms-2 h-6 w-6 text-white dark:text-white" /></Button
	>
	<Dropdown simple bind:isOpen={isAnswerBlockAdderOpen}>
		<DropdownItem onclick={() => addBlock(true)}>With Label</DropdownItem>
		<DropdownDivider />
		<DropdownItem onclick={() => addBlock(false)}>Without Label</DropdownItem>
	</Dropdown>
</div>

<div class="mb-2 grid grid-cols-1 gap-2 md:grid-cols-4">
	{#each answerBlocks as answerBlock, index}
		<AnswerBlockComponent
			bind:answerBlock={answerBlocks[index]}
			onDeleteBlock={() => {
				answerBlocks = answerBlocks.filter((block) => block !== answerBlock);
			}}
		/>
	{/each}
</div>
