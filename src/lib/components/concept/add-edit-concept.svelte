<script lang="ts">
	import Modal from '$lib/components/modal.svelte';
	import { store } from '$lib/services/knowLearningStore.svelte';
	import type { Concept } from '$lib/services/models';
	import { Button, Input, MultiSelect, Textarea, type SelectOptionType } from 'flowbite-svelte';

	const { addConcept, getConceptsFn, uuid, updateConcept } = store!;

	const emptyConcept = () => {
		return {
			id: '',
			name: '',
			description: '',
			aiPrompt: '',
			relatedConcepts: []
		} as Concept;
	};

	let {
		open = $bindable(),
		currentConcept = $bindable(emptyConcept())
	}: {
		open: boolean;
		currentConcept?: Concept;
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

<Modal {open} size="lg" onClose={closeModal} title="Add a Concept">
	{#snippet main()}
		<form class="flex h-full min-h-64 w-full flex-col gap-2">
			<Input
				id="conceptName"
				required
				type="text"
				bind:value={currentConcept.name}
				placeholder="Concept Name"
			/>
			<Textarea
				id="conceptDescription"
				required
				bind:value={currentConcept.description}
				placeholder="Concept Description"
			/>
			<Textarea id="conceptAiPrompt" bind:value={currentConcept.aiPrompt} placeholder="AI Prompt" />
			<MultiSelect
				id="relatedConcepts"
				bind:value={currentConcept.relatedConcepts}
				placeholder={'Select Related Concepts'}
				items={conceptItems}
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
			>
				{currentConcept.id ? 'Update Concept' : 'Add Concept'}
			</Button>
		</div>
	{/snippet}
</Modal>
