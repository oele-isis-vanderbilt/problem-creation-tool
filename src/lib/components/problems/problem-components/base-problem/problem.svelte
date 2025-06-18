<script module lang="ts">
	import { type Snippet } from 'svelte';
	import type { Problem, ProblemRunState } from '$lib/services/models';

	export interface BaseProblemProps {
		problem: Problem;
		mode: 'build' | 'assess' | 'snapshot';
		onProblemUpdated?: (problem: Problem) => void;
		validators?: ((problem: Problem) => string[])[];
		problemSnapshot?: ProblemRunState | null;
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
	import SelectTags from '$lib/components/tag/select-tags.svelte';
	import SelectMisconception from '$lib/components/concept/select-misconception.svelte';
	import baseValidator from './validator';

	let {
		problem = $bindable(),
		mode = 'build',
		onProblemUpdated = () => {},
		validators = [],
		body,
		problemSnapshot = null
	}: BaseProblemProps & {
		body: Snippet<['build' | 'assess' | 'snapshot']>;
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
		problem?.tags;
		problem?.misconceptions;
		if (problem) {
			onProblemUpdated(problem);
		}
	});
</script>

<div class="mb-20 w-full">
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
				<div class="mb-4 flex flex-row items-center justify-between gap-2">
					<SelectTags bind:selectedTagIds={problem.tags} />
				</div>
				<div class="mb-4 flex flex-row items-center justify-between gap-2">
					<SelectMisconception bind:selectedMisconceptionId={problem.misconceptions} />
				</div>
				{@render body('build')}
				<ProblemError {problem} validators={[baseValidator, ...validators]} />
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
	{:else if mode === 'snapshot'}
		<h2 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
			{problem.title}
		</h2>
		<Editor
			placeholder="Problem Description"
			readOnly
			content={getEditorContent(problem.description)}
		/>
		{@render body('snapshot')}
	{/if}
</div>
