<script lang="ts">
	import type { MultipleChoiceProblem } from '$lib/services/models';
	import { Input } from 'flowbite-svelte';
	import FlipEditPreview from './flip-edit-preview.svelte';
	import Editor from './tiptap/editor.svelte';

	let {
		problem = $bindable(),
		previewOnly = false
	}: {
		problem: MultipleChoiceProblem;
		previewOnly?: boolean;
	} = $props();
</script>

<div class="h-full w-full">
	<FlipEditPreview>
		{#snippet edit()}
			{#if previewOnly}
				<div class="flex h-full w-full items-center justify-center">
					<p class="text-gray-500 dark:text-gray-400">Can't Edit in Preview Only mode</p>
				</div>
			{:else}
				<Input type="text" placeholder="Title" bind:value={problem.title} class="mb-2" />
				<Editor content={problem.description}></Editor>
			{/if}
		{/snippet}
		{#snippet preview()}
			<h2 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
				{problem.title}
			</h2>
			<Editor content={problem.description} readOnly={true}></Editor>
		{/snippet}
	</FlipEditPreview>
</div>
