<script lang="ts">
	import type { Assessment, StateModule } from '$lib/services/models';
	import { Button, Input, Label, Select, Textarea, type SelectOptionType } from 'flowbite-svelte';
	import HeroiconsPlusCircle16Solid from 'virtual:icons/heroicons-solid/plus-circle';
	import Modal from '../modal.svelte';
	import { onMount } from 'svelte';

	import { store } from '$lib/services/knowLearningStore.svelte';
	import { getContext } from 'svelte';
	import type { AgentEnvironment } from '@knowlearning/agents/browser';

	const env = getContext<AgentEnvironment>('appEnv');
	let {
		module = null
	}: {
		module?: StateModule | null;
	} = $props();

	let imageFiles: FileList | null | undefined = $state<FileList | null | undefined>(null);

	const emptyAssessment: () => Assessment = () => {
		return {
			id: '',
			moduleId: '',
			title: '',
			description: '',
			problemIds: [],
			coverImageUUID: '',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			createdBy: ''
		};
	};

	let isModalOpen = $state(false);
	let submissionErrors = $state<string[]>([]);
	let currentAssessment: Assessment = $state(emptyAssessment());

	const { createAssessment, uuid, getFn, uploadImage } = store!;
	let selectedModule = $state<StateModule | null>(module || null);

	onMount(() => {
		currentAssessment = emptyAssessment();
		submissionErrors = [];
	});

	const validateAndSubmit = async () => {
		let errors = [];
		if (!currentAssessment.title) {
			errors.push('Assessment title is required');
		}
		if (!currentAssessment.description) {
			errors.push('Assessment description is required');
		}

		if (!selectedModule) {
			errors.push('Module selection is required');
		}
		submissionErrors = errors;

		if (submissionErrors.length > 0) {
			return false;
		}

		// Upload Image if provided
		if (imageFiles && imageFiles[0]) {
			try {
				const assessmentImageUUID = await uploadImage(imageFiles[0]);
				currentAssessment.coverImageUUID = assessmentImageUUID;
			} catch (error) {
				console.error('Error uploading image:', error);
				submissionErrors.push('Error uploading image');
				return false;
			}
		}

		currentAssessment.id = uuid();

		currentAssessment.moduleId = selectedModule!.id;
		currentAssessment.problemIds = selectedModule!.problems.map((problem) => problem.id);
		currentAssessment.createdBy = env.auth.user;
		currentAssessment.createdAt = new Date().toISOString();
		currentAssessment.updatedAt = new Date().toISOString();
		console.log('Creating assessment:', currentAssessment);
		await createAssessment(currentAssessment);

		return true;
	};

	const selectItems = Object.values(getFn()).map(
		(mod) =>
			({
				value: mod,
				name: mod.name
			}) as SelectOptionType<StateModule>
	);
</script>

<Button onclick={() => (isModalOpen = true)} class="gap-2 text-sm">
	Assessment
	<HeroiconsPlusCircle16Solid />
</Button>

<Modal
	bind:open={isModalOpen}
	title={module ? `Create Assessment from ${module.name}` : 'Create a new Assessment'}
	onClose={() => (isModalOpen = false)}
>
	{#snippet main()}
		<form class="flex h-full w-full flex-col">
			<Input
				type="text"
				placeholder="Assessment Name"
				class="mb-4"
				bind:value={currentAssessment.title}
			/>
			<Textarea
				placeholder="Assessment Description"
				class="mb-4"
				bind:value={currentAssessment.description}
			/>
			<label for="moduleImage" class="text-gray-500 dark:text-gray-400"
				>Select Assessment Image (Optional)</label
			>
			<input
				type="file"
				id="assessmentImage"
				name="assessmentImage"
				accept="image/png, image/jpeg"
				bind:files={imageFiles}
				class="mb-2 w-full rounded-lg border-2 border-gray-200 p-2 text-gray-500 dark:border-gray-400 dark:text-gray-400"
			/>
			{#if module === null}
				<Label class="mb-2">Select Module</Label>
				<Select
					bind:value={selectedModule}
					class="mb-4"
					placeholder="Select Module"
					items={selectItems}
				/>
			{/if}
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
		<Button
			onclick={async () => {
				let success = await validateAndSubmit();
				if (success) {
					// Reset the form
					currentAssessment = emptyAssessment();
					submissionErrors = [];
					isModalOpen = false;
				}
			}}>Create Assessment</Button
		>
	{/snippet}
</Modal>
