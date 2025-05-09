<script lang="ts">
	import {
		ProblemKind,
		type MultipleChoiceProblem,
		type Problem,
		type WordProblem
	} from '$lib/services/models';
	import { Input, Radio, Textarea } from 'flowbite-svelte';
	import FlipEditPreview from '$lib/components/problems/flip-edit-preview.svelte';
	import { isEqual } from 'underscore';
	import DifficultyButtons from '$lib/components/problems/difficulty-buttons.svelte';
	import AiPrompt from '../ai-prompt.svelte';
	import SelectConcept from '$lib/components/concept/select-concept.svelte';
	import validateProblem from './questionValidator';
	import McqOptionAdder from './mcq-option-adder.svelte';
	import McqOptionPreview from './mcq-option-preview.svelte';

	let {
		problem = $bindable(),
		onProblemUpdated,
		previewOnly = false
	}: {
		problem: Problem;
		onProblemUpdated: (problem: Problem) => void;
		previewOnly?: boolean;
	} = $props();

	let problemState = $state<Problem>({ ...problem });

	let errors = $derived.by(() => {
		const validationErrors = validateProblem(problemState);
		return validationErrors;
	});

	$effect(() => {
		if (!isEqual(problemState, problem)) {
			onProblemUpdated(problemState);
		}
	});
</script>

<div class="mb-20 h-full w-full">
	<FlipEditPreview>
		{#snippet edit()}
			{#if previewOnly}
				<div class="flex h-full w-full items-center justify-center">
					<p class="text-gray-500 dark:text-gray-400">Can't Edit in Preview Only mode</p>
				</div>
			{:else}
				<Input type="text" placeholder="Title" bind:value={problemState.title} class="mb-2" />
				<Textarea
					placeholder="Problem Description"
					bind:value={problemState.description}
					class="mb-2"
				/>
				<div class="mb-4 flex flex-row items-center justify-between gap-2">
					<div class="w-2/3">
						<SelectConcept bind:selectedConceptIds={problemState.concepts} />
					</div>
					<DifficultyButtons bind:difficulty={problemState.difficulty} />
					<AiPrompt bind:aiPrompt={problemState.aiPrompt}></AiPrompt>
				</div>
				{#if problem.kind === ProblemKind.MULTIPLE_CHOICE}
					{@const state = problemState as MultipleChoiceProblem}
					<McqOptionAdder bind:options={state.options} />
				{:else if problem.kind === ProblemKind.WORD_PROBLEM}
					{@const state = problemState as WordProblem}
					<Input type="text" placeholder="Answer" bind:value={state.answer} class="mb-2" />
				{/if}

				{#if errors.length > 0}
					<div
						class="mb-2 w-full rounded-lg border-2 border-red-200 bg-red-100 p-2 text-red-600 dark:border-red-400 dark:bg-red-400 dark:text-white"
					>
						{#each errors as error}
							<p>{error}</p>
						{/each}
					</div>
				{/if}
			{/if}
		{/snippet}
		{#snippet preview()}
			<h2 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
				{problem.title}
			</h2>
			<Textarea
				placeholder="Problem Description"
				bind:value={problemState.description}
				class="mb-2"
				disabled
			/>
			{#if problem.kind === ProblemKind.MULTIPLE_CHOICE}
				{@const state = problemState as MultipleChoiceProblem}
				<McqOptionPreview options={state.options} />
			{:else if problem.kind === ProblemKind.WORD_PROBLEM}
				<Input type="text" placeholder="Answer" class="mb-2" />
			{/if}
		{/snippet}
	</FlipEditPreview>
</div>
