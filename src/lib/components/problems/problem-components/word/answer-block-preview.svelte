<script lang="ts">
	import type { AnswerBlock } from '$lib/services/models';
	import { onMount } from 'svelte';
	import AnswerBlockComponent from './answer-block.svelte';

	let {
		answerBlocks,
		blockValues = $bindable([])
	}: {
		answerBlocks: AnswerBlock[];
		blockValues: string[];
	} = $props();

	onMount(() => {
		// blockValues = Array(answerBlocks.length).fill('');
	});
</script>

<div class="flex w-full flex-row items-center justify-center">
	{#each answerBlocks as block, index}
		<AnswerBlockComponent mode="preview" answerBlock={block} bind:blockValue={blockValues[index]} />
	{/each}
</div>
