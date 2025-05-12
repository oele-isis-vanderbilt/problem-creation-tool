<script lang="ts">
	import Modal from '$lib/components/modal.svelte';
	import { store } from '$lib/services/knowLearningStore.svelte';
	import type { Misconception } from '$lib/services/models';
	import { Button, Input, Textarea } from 'flowbite-svelte';

	const { uuid, updateMisconception, addMisconception } = store!;

	const emptyMisconception = () => {
		return {
			id: '',
			name: '',
			aiDefinition: '',
			aiFeedback: ''
		} as Misconception;
	};

	let {
		open = $bindable(),
		currentMisconception = $bindable(emptyMisconception())
	}: {
		open: boolean;
		currentMisconception?: Misconception;
	} = $props();

	let submissionErrors = $state<string[]>([]);

	function closeModal() {
		open = false;
		currentMisconception = emptyMisconception();
		submissionErrors = [];
	}

	function validateAndSubmit() {
		let errors = [];
		if (!currentMisconception.name) {
			errors.push('Misconception name is required');
		}
		if (!currentMisconception.aiDefinition) {
			errors.push('Misconception AI definition is required');
		}

		if (!currentMisconception.aiFeedback) {
			errors.push('Misconception AI feedback is required');
		}

		submissionErrors = errors;
		if (submissionErrors.length > 0) {
			return false;
		}
		if (currentMisconception.id) {
			updateMisconception(currentMisconception);
		} else {
			currentMisconception.id = uuid();
			addMisconception(currentMisconception);
		}
		return true;
	}
</script>

<Modal {open} size="lg" onClose={closeModal} title="Add a Misconception">
	{#snippet main()}
		<form class="flex h-full min-h-64 w-full flex-col gap-2">
			<Input
				id="misconceptionName"
				required
				type="text"
				bind:value={currentMisconception.name}
				placeholder="Misconception Name"
			/>
			<Textarea
				id="misconceptionAiDefinition"
				required
				bind:value={currentMisconception.aiDefinition}
				placeholder="Misconception Description"
			/>
			<Textarea
				id="misconceptionAiFeedback"
				bind:value={currentMisconception.aiFeedback}
				placeholder="Misconception AI Feedback"
			/>
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
						currentMisconception = emptyMisconception();
						submissionErrors = [];
						open = false;
					}
				}}
			>
				{currentMisconception.id ? 'Update Concept' : 'Add Concept'}
			</Button>
		</div>
	{/snippet}
</Modal>
