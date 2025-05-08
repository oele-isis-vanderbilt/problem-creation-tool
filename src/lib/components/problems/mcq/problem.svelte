<script lang="ts">
	import type { MultipleChoiceProblem } from '$lib/services/models';
	import { Input, Radio, Textarea } from 'flowbite-svelte';
	import FlipEditPreview from '$lib/components/problems/flip-edit-preview.svelte';
	import { isEqual } from 'underscore';
	import DifficultyButtons from '$lib/components/problems/difficulty-buttons.svelte';
	import AiPrompt from '../ai-prompt.svelte';
	import SelectConcept from '$lib/components/concept/select-concept.svelte';
	import Option from './option.svelte';
	import validateMCQ from './mcqValidator';

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

	let options = $derived.by(() => {
		return [...problemState.options];
	});

	let errors = $derived.by(() => {
		problemState.options;
		const validationErrors = validateMCQ(problemState);
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
				<div class="mb-2 flex flex-row items-center justify-between gap-2">
					<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Options</h2>
					<button
						class="flex flex-row items-center gap-2 rounded-lg border-2 border-gray-200 bg-gray-200 p-2 text-black dark:border-gray-400 dark:bg-gray-400 dark:text-slate-800"
						onclick={() => {
							problemState.options.push({
								value: '',
								displayName: '',
								isCorrect: false,
								misconceptions: []
							});
						}}
					>
						Add Option
					</button>
				</div>
				<div class="mb-2 flex flex-col gap-4">
					{#each options as _, index}
						<Option
							bind:option={problemState.options[index]}
							isLast={index === problemState.options.length - 1}
							onDeleteOption={() => {
								problemState.options = problemState.options.filter((_, i) => i !== index);
							}}
							onAddOption={() => {
								problemState.options.push({
									value: '',
									displayName: '',
									isCorrect: false,
									misconceptions: []
								});
							}}
							onToggleCorrect={() => {
								problemState.options = problemState.options.map((option, i) => {
									if (i !== index) {
										option.isCorrect = false;
									}
									return option;
								});
							}}
						/>
					{/each}
				</div>
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
			{#each problemState.options as option}
				<div class="mb-2 flex flex-row items-center gap-2">
					<Radio name="option" value={option.value} class="text-lg">{option.value}</Radio>
				</div>
			{/each}
		{/snippet}
	</FlipEditPreview>
</div>
