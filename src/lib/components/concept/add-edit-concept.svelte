<script lang="ts">
	import Modal from '$lib/components/modal.svelte';
	import { store } from '$lib/services/modules-store.svelte';
	import type { Concept } from '$lib/services/models';
	import {
		Button,
		Input,
		Label,
		MultiSelect,
		Textarea,
		type SelectOptionType
	} from 'flowbite-svelte';
	import { emptyConcept } from '$lib/utils';

	const { addConcept, getConceptsFn, uuid, updateConcept } = store!;

	let {
		open = $bindable(),
		previewOnly = false,
		currentConcept = $bindable(emptyConcept()),
		onClose
	}: {
		open: boolean;
		previewOnly?: boolean;
		currentConcept?: Concept;
		onClose?: () => void;
	} = $props();

	const conceptItems = $derived.by(() => {
		const concepts = getConceptsFn()();
		const items = Object.values(concepts).map((concept) => {
			return {
				value: concept.id,
				name: concept.name
			} as SelectOptionType<string>;
		});
		if (items.length === 0) {
			items.push({
				value: 'No concepts available',
				name: 'No concepts available',
				disabled: true
			});
		}
		return items;
	});

	let submissionErrors = $state<string[]>([]);

	function closeModal() {
		open = false;
		currentConcept = emptyConcept();
		submissionErrors = [];
		if (onClose) {
			onClose();
		}
	}

	function validateAndSubmit() {
		let errors = [];
		if (!currentConcept.name) {
			errors.push('Concept name is required');
		}
		if (!currentConcept.description) {
			errors.push('Concept description is required');
		}
		submissionErrors = errors;
		if (submissionErrors.length > 0) {
			return false;
		}
		if (currentConcept.id) {
			updateConcept(currentConcept);
		} else {
			currentConcept.id = uuid();
			addConcept(currentConcept);
		}
		return true;
	}
</script>

<Modal
	{open}
	size="lg"
	onClose={closeModal}
	title={previewOnly ? 'Preview Concept' : 'Add a Concept'}
>
	{#snippet main()}
		<form class="flex h-full min-h-64 w-full flex-col gap-2">
			<Label for="conceptName" class="text-sm font-bold">Concept Name</Label>
			<Input
				id="conceptName"
				required
				type="text"
				bind:value={currentConcept.name}
				placeholder="Concept Name"
				disabled={previewOnly}
			/>
			<Label for="conceptDescription" class="text-sm font-bold">Concept Description</Label>
			<Textarea
				id="conceptDescription"
				required
				bind:value={currentConcept.description}
				placeholder="Concept Description"
				disabled={previewOnly}
			/>
			<Label for="conceptAiPrompt" class="text-sm font-bold">AI Prompt</Label>
			<Textarea
				id="conceptAiPrompt"
				bind:value={currentConcept.aiPrompt}
				placeholder="AI Prompt"
				disabled={previewOnly}
			/>
			<Label for="relatedConcepts" class="text-sm font-bold">Related Concepts</Label>
			<MultiSelect
				id="relatedConcepts"
				bind:value={currentConcept.relatedConcepts}
				placeholder={'Select Related Concepts'}
				items={conceptItems}
				disabled={previewOnly}
			></MultiSelect>
			{#if submissionErrors.length > 0}
				<div class="bg-danger-600 text-primary-600 mb-2 w-full rounded-lg border-2 p-2">
					{#each submissionErrors as error}
						<p>{error}</p>
					{/each}
				</div>
			{/if}
		</form>
	{/snippet}
	{#snippet footer()}
		<div class="flex w-full items-end justify-end">
			<Button
				onclick={async () => {
					const success = await validateAndSubmit();
					if (success) {
						// Reset the form
						currentConcept = emptyConcept();
						submissionErrors = [];
						open = false;
					}
				}}
				disabled={previewOnly}
			>
				{currentConcept.id ? 'Update Concept' : 'Add Concept'}
			</Button>
		</div>
	{/snippet}
</Modal>
