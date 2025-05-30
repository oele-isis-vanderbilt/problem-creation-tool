<script lang="ts">
	import HeroiconsPlusCircle16Solid from 'virtual:icons/heroicons-solid/plus-circle';
	import type { StateModule } from '$lib/services/models';
	import Modal from '$lib/components/modal.svelte';
	import { onMount } from 'svelte';
	import { getContext } from 'svelte';
	import type { AgentEnvironment } from '@knowlearning/agents/browser';
	import { store } from '$lib/services/modules-store.svelte';
	import { Button } from 'flowbite-svelte';
	// import { uploadImage, uuid } from '$lib/services/knowLearing.svelte';

	let isModalOpen = $state(false);
	let submissionErrors = $state<string[]>([]);
	let imageFiles = $state<FileList | null | undefined>(null);
	const env = getContext<AgentEnvironment>('appEnv');
	const { addEmptyModule, uploadImage, uuid } = store!;

	let currentModule = $state<StateModule>(emptyModule());

	function emptyModule() {
		return {
			id: '',
			name: '',
			description: '',
			coverImageUUID: '',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toDateString(),
			createdBy: '',
			problems: []
		};
	}

	onMount(() => {
		currentModule = emptyModule();
		submissionErrors = [];
	});

	const validateAndSubmit = async () => {
		let errors = [];
		if (!currentModule.name) {
			errors.push('Module name is required');
		}
		if (!currentModule.description) {
			errors.push('Module description is required');
		}

		submissionErrors = errors;
		if (submissionErrors.length > 0) {
			return false;
		}

		// Upload Image if provided
		if (imageFiles && imageFiles[0]) {
			try {
				const moduleImageUUID = await uploadImage(imageFiles[0]);
				currentModule.coverImageUUID = moduleImageUUID;
			} catch (error) {
				console.error('Error uploading image:', error);
				submissionErrors.push('Error uploading image');
				return false;
			}
		}

		currentModule.createdBy = env.auth.user;
		currentModule.createdAt = new Date().toISOString();
		currentModule.updatedAt = new Date().toISOString();
		currentModule.id = uuid();

		await addEmptyModule(currentModule);
		return true;
	};

	function closeModal() {
		isModalOpen = false;
		currentModule = emptyModule();
		submissionErrors = [];
		imageFiles = null;
	}
</script>

<Button onclick={() => (isModalOpen = true)} class="gap-2">
	Add Module
	<HeroiconsPlusCircle16Solid />
</Button>

<Modal bind:open={isModalOpen} title="Add a New Module" onClose={() => closeModal()}>
	{#snippet main()}
		<form class="flex h-full w-full flex-col">
			<input
				id="moduleName"
				required
				type="text"
				placeholder="Module Name"
				class="mb-2 w-full rounded-lg border-2 border-gray-200 p-2 text-black dark:border-gray-400 dark:bg-gray-700 dark:text-white"
				bind:value={currentModule.name}
			/>
			<textarea
				placeholder="Module Description"
				class="mb-2 w-full rounded-lg border-2 border-gray-200 p-2 text-black dark:border-gray-400 dark:bg-gray-700 dark:text-white"
				bind:value={currentModule.description}
			/>
			<label for="moduleImage" class="text-gray-500 dark:text-gray-400"
				>Select Module Cover Image (Optional)</label
			>
			<input
				type="file"
				id="moduleImage"
				name="moduleImage"
				accept="image/png, image/jpeg"
				bind:files={imageFiles}
				class="mb-2 w-full rounded-lg border-2 border-gray-200 p-2 text-gray-500 dark:border-gray-400 dark:text-gray-400"
			/>
			{#if submissionErrors.length > 0}
				<div
					class="mb-2 w-full rounded-lg border-2 border-red-200 bg-red-100 p-2 text-red-600 dark:border-red-400 dark:bg-red-400 dark:text-white"
				>
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
						currentModule = emptyModule();
						submissionErrors = [];
						isModalOpen = false;
					}
				}}
			>
				Add Module
			</Button>
		</div>
	{/snippet}
</Modal>
