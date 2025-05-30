<script lang="ts">
	import Modal from '$lib/components/modal.svelte';
	import { store } from '$lib/services/modules-store.svelte';
	import type { Misconception } from '$lib/services/models';
	import { Button, Input, Label, Textarea } from 'flowbite-svelte';
	import { emptyMisconception } from '$lib/utils';

	const { uuid, updateMisconception, addMisconception } = store!;

	let {
		open = $bindable(),
		currentMisconception = $bindable(emptyMisconception()),
		previewOnly = false,
		onClose
	}: {
		open: boolean;
		currentMisconception?: Misconception;
		previewOnly?: boolean;
		onClose?: () => void;
	} = $props();

	let submissionErrors = $state<string[]>([]);

	function closeModal() {
		open = false;
		currentMisconception = emptyMisconception();
		submissionErrors = [];
		if (onClose) {
			onClose();
		}
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

<Modal
	{open}
	size="lg"
	onClose={closeModal}
	title={previewOnly ? 'Preview Misconception' : 'Add a Misconception'}
>
	{#snippet main()}
		<form class="flex h-full min-h-64 w-full flex-col gap-2">
			<Label for="misconceptionName" class="text-sm font-bold">Misconception Name</Label>
			<Input
				id="misconceptionName"
				required
				type="text"
				bind:value={currentMisconception.name}
				placeholder="Misconception Name"
				disabled={previewOnly}
			/>
			<Label for="misconceptionAiDefinition" class="text-sm font-bold"
				>Misconception AI Definition</Label
			>
			<Textarea
				id="misconceptionAiDefinition"
				required
				bind:value={currentMisconception.aiDefinition}
				placeholder="Misconception Description"
				disabled={previewOnly}
			/>
			<Label for="misconceptionAiFeedback" class="text-sm font-bold"
				>Misconception AI Feedback</Label
			>
			<Textarea
				id="misconceptionAiFeedback"
				bind:value={currentMisconception.aiFeedback}
				placeholder="Misconception AI Feedback"
				disabled={previewOnly}
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
				disabled={previewOnly}
			>
				{currentMisconception.id ? 'Update Misconception' : 'Add Misconception'}
			</Button>
		</div>
	{/snippet}
</Modal>
