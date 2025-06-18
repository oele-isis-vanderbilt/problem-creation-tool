<script lang="ts">
	import type { AnswerBlock, WordProblemRunState } from '$lib/services/models';
	import AnswerBlockComponent from './answer-block.svelte';

	let {
		answerBlocks,
		snapshot = null
	}: {
		answerBlocks: AnswerBlock[];
		snapshot?: WordProblemRunState | null;
	} = $props();

	let blockValues = $derived.by(() => {
		return snapshot ? snapshot.answerBlockValues : Array(answerBlocks.length).fill('');
	});

	let isResultCorrect = $derived.by(() => {
		if (snapshot) {
			return snapshot.isCorrect;
		}
		return false;
	});

	let correctBlockValues = $derived.by(() => {
		return answerBlocks.map((block) => block.value);
	});
</script>

<div class="flex w-full flex-row items-center justify-center">
	{#each answerBlocks as block, index}
		<AnswerBlockComponent mode="frozen" answerBlock={block} blockValue={blockValues[index]} />
	{/each}
</div>

{#if snapshot}
	{#if isResultCorrect}
		<div class="flex-col gap-2 rounded-lg bg-green-600 p-4 text-white">
			<p class="text-lg font-semibold">Well Done!!</p>
			<p class="text-sm">This input is correct for the problem, as you selected above</p>
		</div>
	{:else}
		<div class="flex-col gap-2 rounded-lg bg-red-600 p-4 text-white">
			<p class="text-lg font-semibold">Incorrect</p>
			<p class="text-sm">The correct input fields are:</p>
			{#each correctBlockValues as correctValue, index}
				<AnswerBlockComponent
					mode="frozen"
					blockValue={correctValue}
					answerBlock={answerBlocks[index]}
				/>
			{/each}
		</div>
	{/if}
{:else}
	<div class="flex-col gap-2 rounded-lg bg-yellow-600 p-4 text-white">
		<p class="text-lg font-semibold">No Input Provided</p>
		<p class="text-sm">The correct input fields are:</p>
		<div class="flex-1">
			{#each correctBlockValues as correctValue, index}
				<AnswerBlockComponent
					mode="frozen"
					blockValue={correctValue}
					answerBlock={answerBlocks[index]}
				/>
			{/each}
		</div>
	</div>
{/if}
