<script lang="ts">
	import Modal from '$lib/components/modal.svelte';
	import { store } from '$lib/services/knowLearningStore.svelte';
	import type { Tag } from '$lib/services/models';
	import { emptyTag } from '$lib/utils';
	import { Button, Input, Label, Textarea } from 'flowbite-svelte';

	const { addTag, uuid, updateTag } = store!;

	let {
		open = $bindable(),
		previewOnly = false,
		currentTag = $bindable(emptyTag()),
		onClose
	}: {
		open: boolean;
		previewOnly?: boolean;
		currentTag?: Tag;
		onClose?: () => void;
	} = $props();

	let submissionErrors = $state<string[]>([]);

	function closeModal() {
		open = false;
		currentTag = emptyTag();
		submissionErrors = [];
		if (onClose) {
			onClose();
		}
	}

	function validateAndSubmit() {
		let errors = [];
		if (!currentTag.tagName) {
			errors.push('Tag name is required');
		}
		if (!currentTag.description) {
			errors.push('Tag description is required');
		}
		submissionErrors = errors;
		if (submissionErrors.length > 0) {
			return false;
		}
		if (currentTag.id) {
			updateTag(currentTag);
		} else {
			currentTag.id = uuid();
			addTag(currentTag);
		}
		return true;
	}
</script>

<Modal {open} size="lg" onClose={closeModal} title={previewOnly ? 'Preview Tag' : 'Add a Tag'}>
	{#snippet main()}
		<form class="flex h-full min-h-64 w-full flex-col gap-2">
			<Label for="tagName" class="text-sm font-bold">Tag Name</Label>
			<Input
				id="tagName"
				required
				type="text"
				bind:value={currentTag.tagName}
				placeholder="Tag Name"
				disabled={previewOnly}
			/>
			<Label for="tagDescription" class="text-sm font-bold">Tag Description</Label>
			<Textarea
				id="tagDescription"
				required
				bind:value={currentTag.description}
				placeholder="Tag Description"
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
						currentTag = emptyTag();
						submissionErrors = [];
						open = false;
					}
				}}
				disabled={previewOnly}
			>
				{currentTag.id ? 'Update Tag' : 'Add Tag'}
			</Button>
		</div>
	{/snippet}
</Modal>
