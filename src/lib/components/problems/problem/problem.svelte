<script lang="ts">
	import {
		ProblemKind,
		type MultipleChoiceProblem,
		type NDigitOperation,
		type Problem,
		type WordProblem
	} from '$lib/services/models';
	import { Input } from 'flowbite-svelte';
	import FlipEditPreview from '$lib/components/problems/flip-edit-preview.svelte';
	import { isEqual } from 'underscore';
	import DifficultyButtons from '$lib/components/problems/difficulty-buttons.svelte';
	import AiPrompt from '../ai-prompt.svelte';
	import SelectConcept from '$lib/components/concept/select-concept.svelte';
	import validateProblem from './questionValidator';
	import McqOptionAdder from './mcq-option-adder.svelte';
	import McqOptionPreview from './mcq-option-preview.svelte';
	import Editor from '$lib/components/tiptap/editor.svelte';
	import AnswerBlocksAdder from './answer-blocks-adder.svelte';
	import AnswerBlockComponent from './answer-block.svelte';
	import NDigitOperationBlock from './n-digit-operation-block.svelte';

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

	function getEditorContent(content: string) {
		try {
			return JSON.parse(content);
		} catch (e) {
			return content;
		}
	}

	$effect(() => {
		if (problemState.kind === ProblemKind.MULTIPLE_CHOICE) {
			problemState.options;
		}
		if (problemState.kind === ProblemKind.WORD_PROBLEM) {
			problemState.answerBlocks;
		}
		if (problemState.kind === ProblemKind.N_DIGIT_OPERATION) {
			problemState.operand1;
			problemState.operand2;
			problemState.operator;
		}
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
				<Editor
					content={getEditorContent(problemState.description)}
					onContentUpdate={(contentJson) => {
						problemState.description = JSON.stringify(contentJson);
					}}
					placeholder="Click to Edit Problem Description"
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
					<AnswerBlocksAdder bind:answerBlocks={state.answerBlocks} />
				{:else if problem.kind === ProblemKind.N_DIGIT_OPERATION}
					<NDigitOperationBlock bind:problem={problemState as NDigitOperation} />
				{/if}

				{#if errors.length > 0}
					<div
						class="mb-2 w-full rounded-lg border-2 border-red-200 bg-red-100 p-2 text-red-600 dark:border-red-400 dark:bg-red-400 dark:text-white"
					>
						{#each new Set(errors) as error}
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
			<Editor
				placeholder="Problem Description"
				readOnly
				content={getEditorContent(problem.description)}
			/>
			{#if problem.kind === ProblemKind.MULTIPLE_CHOICE}
				{@const state = problemState as MultipleChoiceProblem}
				<McqOptionPreview options={state.options} />
			{:else if problem.kind === ProblemKind.WORD_PROBLEM}
				{@const state = problemState as WordProblem}
				<div class="flex w-full flex-row items-center justify-center">
					{#each state.answerBlocks as block}
						<AnswerBlockComponent mode="preview" answerBlock={block} />
					{/each}
				</div>
			{:else if problem.kind === ProblemKind.N_DIGIT_OPERATION}
				<div class="flex w-full flex-row items-center justify-center">
					<NDigitOperationBlock problem={problemState as NDigitOperation} mode="preview" />
				</div>
			{/if}
		{/snippet}
	</FlipEditPreview>
</div>
