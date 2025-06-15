<script lang="ts">
	import type { AnswerBlock } from '$lib/services/models';
	import AnswerBlockComponent from './answer-block.svelte';

	let {
		answerBlocks
	}: {
		answerBlocks: AnswerBlock[];
	} = $props();

	let blockValues = $state<Record<string, string>>(
		Object.fromEntries(answerBlocks.map((block, index) => [index, '']))
	);

	export function canGradeProblem() {
		const errors: string[] = [];
		const noValues = Object.values(blockValues).filter((value) => value.trim() === '');
		if (noValues.length > 0) {
			errors.push('Answer block values cannot be empty');
		}
		return { can: errors.length === 0, errors };
	}

	export function getAnswerBlockValues(): Record<string, string> {
		return Object.fromEntries(
			answerBlocks.map((block, index) => {
				return [index, blockValues[index]];
			})
		);
	}
</script>

<div class="flex w-full flex-row items-center justify-center">
	{#each answerBlocks as block, index}
		<AnswerBlockComponent mode="preview" answerBlock={block} bind:blockValue={blockValues[index]} />
	{/each}
</div>