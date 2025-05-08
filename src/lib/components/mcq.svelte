<script lang="ts">
	import type { JSONContent } from '@tiptap/core';
	import type { MultipleChoiceProblem } from '$lib/services/models';
	import { Input, Textarea } from 'flowbite-svelte';
	import FlipEditPreview from './flip-edit-preview.svelte';
	import Editor from './tiptap/editor.svelte';
	import { isEqual } from 'underscore';
	import DifficultyButtons from './difficulty-buttons.svelte';
	let {
		problem = $bindable(),
		onProblemUpdated,
		previewOnly = false
	}: {
		problem: MultipleChoiceProblem;
		onProblemUpdated: (problem: MultipleChoiceProblem) => void;
		previewOnly?: boolean;
	} = $props();

	let problemState = $state<MultipleChoiceProblem>({ ...problem });

	$effect(() => {
		if (!isEqual(problemState, problem)) {
			onProblemUpdated(problemState);
		}
	});
</script>

<div class="h-full w-full">
	<FlipEditPreview>
		{#snippet edit()}
			{#if previewOnly}
				<div class="flex h-full w-full items-center justify-center">
					<p class="text-gray-500 dark:text-gray-400">Can't Edit in Preview Only mode</p>
				</div>
			{:else}
				<Input type="text" placeholder="Title" bind:value={problemState.title} class="mb-2" />
				<!-- <Editor
					content={JSON.parse(problemState.description || '{}') as JSONContent}
					onContentUpdate={(json) => {
						problemState.description = JSON.stringify(json);
					}}
				></Editor> -->
				<Textarea
					placeholder="Problem Description"
					bind:value={problemState.description}
					class="mb-2"
				/>
				<div class="flex flex-row justify-between">
					<DifficultyButtons bind:difficulty={problemState.difficulty} />
				</div>
			{/if}
		{/snippet}
		{#snippet preview()}
			<h2 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
				{problem.title}
			</h2>
			<!-- <Editor content={JSON.parse(problem.description || '{}')} readOnly={true}></Editor> -->
			<Textarea
				placeholder="Problem Description"
				bind:value={problemState.description}
				class="mb-2"
				disabled
			/>
		{/snippet}
	</FlipEditPreview>
</div>
