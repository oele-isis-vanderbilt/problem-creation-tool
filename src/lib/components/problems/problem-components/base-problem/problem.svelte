<script module lang="ts">
	import { type Snippet } from 'svelte';
	import type { Problem } from '$lib/services/models';

	export interface BaseProblemProps {
		problem: Problem;
		mode: 'build' | 'assess';
		onProblemUpdated?: (problem: Problem) => void;
		validators?: ((problem: Problem) => string[])[];
	}
</script>

<script lang="ts">
	import FlipEditPreview from './flip-edit-preview.svelte';
	import Editor from '$lib/components/tiptap/editor.svelte';
	import { Input } from 'flowbite-svelte';
	import SelectConcept from '$lib/components/concept/select-concept.svelte';
	import DifficultyButtons from './difficulty-buttons.svelte';
	import AiPrompt from './ai-prompt.svelte';
	import ProblemError from './error.svelte';

	let {
		problem,
		mode = 'build',
		onProblemUpdated = () => {},
		validators = [],
		body
	}: BaseProblemProps & {
		body: Snippet<['build' | 'assess']>;
	} = $props();

	function getEditorContent(content: string) {
		try {
			return JSON.parse(content);
		} catch (e) {
			return content;
		}
	}

	$effect(() => {
		problem?.title;
		problem?.description;
		problem?.concepts;
		problem?.aiPrompt;
		problem?.difficulty;
		if (problem) {
			onProblemUpdated(problem);
		}
	});
</script>

<div class="mb-20 h-full w-full">
	{#if mode === 'build'}
		<FlipEditPreview>
			{#snippet edit()}
				<Input type="text" placeholder="Title" bind:value={problem.title} class="mb-2" />
				<Editor
					content={getEditorContent(problem.description)}
					onContentUpdate={(contentJson) => {
						problem.description = JSON.stringify(contentJson);
					}}
					placeholder="Click to Edit Problem Description"
				/>
				<div class="mb-4 flex flex-row items-center justify-between gap-2">
					<div class="w-2/3">
						<SelectConcept bind:selectedConceptIds={problem.concepts} />
					</div>
					<DifficultyButtons bind:difficulty={problem.difficulty} />
					<AiPrompt bind:aiPrompt={problem.aiPrompt}></AiPrompt>
				</div>
				{@render body('build')}
				<ProblemError {problem} {validators} />
			{/snippet}
			{#snippet preview()}
				<h2 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
					{problem.title}
				</h2>
				<Editor
					placeholder="Problem Description"
					readOnly
					content={getEditorContent(problem.description)}
				/>
				{@render body('assess')}
			{/snippet}
		</FlipEditPreview>
	{:else if mode === 'assess'}
		<h2 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
			{problem.title}
		</h2>
		<Editor
			placeholder="Problem Description"
			readOnly
			content={getEditorContent(problem.description)}
		/>
		{@render body('assess')}
	{/if}
</div>
