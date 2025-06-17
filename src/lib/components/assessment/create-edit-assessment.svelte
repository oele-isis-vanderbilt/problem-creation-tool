<script lang="ts">
	import { AssessmentGroup, type Assessment, type StateModule } from '$lib/services/models';
	import {
		Button,
		Input,
		Label,
		Range,
		Select,
		Textarea,
		type SelectOptionType
	} from 'flowbite-svelte';
	import HeroiconsPlusCircle16Solid from 'virtual:icons/heroicons-solid/plus-circle';
	import HeroiconsPencil16Solid from 'virtual:icons/heroicons-solid/pencil';
	import Modal from '../modal.svelte';
	import { onMount } from 'svelte';

	import { store } from '$lib/services/knowLearningStore.svelte';
	import { getContext } from 'svelte';
	import type { AgentEnvironment } from '@knowlearning/agents/browser';

	const env = getContext<AgentEnvironment>('appEnv');
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
			createdBy: '',

			attemptTimeLimit: 30 * 60, // Default to 30 minutes
			group: AssessmentGroup.CONTROL,
			maxAttemptsPerQuestion: 2,
			reviewTimeLimit: 10 * 60 // Default to 5 minutes
		};
	};

	let {
		assessment = emptyAssessment(),
		module = null
	}: {
		assessment?: Assessment;
		module?: StateModule | null;
	} = $props();

	let imageFiles: FileList | null | undefined = $state<FileList | null | undefined>(null);

	let isModalOpen = $state(false);
	let submissionErrors = $state<string[]>([]);
	let currentAssessment: Assessment = $state(assessment || emptyAssessment());

	const { createAssessment, uuid, getFn, uploadImage, updateAssessment } = store!;
	function getSelectedModule(): StateModule | null {
		if (module) {
			return module;
		}
		return Object.values(getFn()).find((mod) => mod.id === assessment.moduleId) || null;
	}

	let selectedModule = $state<StateModule | null>(getSelectedModule() || null);

	onMount(() => {
		currentAssessment = assessment || emptyAssessment();
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

		if (currentAssessment.id) {
			currentAssessment.updatedAt = new Date().toISOString();
			currentAssessment.moduleId = selectedModule!.id;
			currentAssessment.problemIds = selectedModule!.problems.map((problem) => problem.id);
			await updateAssessment(currentAssessment);
		} else {
			currentAssessment.id = uuid();
			currentAssessment.moduleId = selectedModule!.id;
			currentAssessment.problemIds = selectedModule!.problems.map((problem) => problem.id);
			currentAssessment.createdBy = env.auth.user;
			currentAssessment.createdAt = new Date().toISOString();
			currentAssessment.updatedAt = new Date().toISOString();
			createAssessment(currentAssessment);
		}

		return true;
	};

	const selectItems = Object.values(getFn()).map(
		(mod) =>
			({
				value: mod,
				name: mod.name
			}) as SelectOptionType<StateModule>
	);

	const assessmentGroups = Object.values(AssessmentGroup).map((group) => ({
		value: group,
		name: group
	})) as SelectOptionType<AssessmentGroup>[];

	function closeModal() {
		isModalOpen = false;
		currentAssessment = assessment || emptyAssessment();
		submissionErrors = [];
	}

	function getTitle() {
		if (currentAssessment.id) {
			return `Edit Assessment: ${currentAssessment.title}`;
		}

		if (module) {
			return `Create Assessment for Module: ${module.name}`;
		}

		return 'Create a new Assessment';
	}
</script>

<Button onclick={() => (isModalOpen = true)} class="gap-2 text-sm">
	{currentAssessment.id ? 'Edit' : 'Assessment'}
	{#if !currentAssessment.id}
		<HeroiconsPlusCircle16Solid />
	{:else}
		<HeroiconsPencil16Solid />
	{/if}
</Button>

<Modal size="xl" bind:open={isModalOpen} title={getTitle()} onClose={closeModal}>
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
					disabled={!!assessment.moduleId}
				/>
			{/if}
			<Label class="mb-2">Assessment Group</Label>
			<Select bind:value={currentAssessment.group} class="mb-4" items={assessmentGroups} />

			<Label class="mb-2 text-sm">Attempt Time Limit (in minutes)</Label>
			<div class="flex flex-row items-center gap-2">
				<Range
					max="120"
					min="1"
					step="1"
					value={currentAssessment.attemptTimeLimit / 60}
					onchange={(e: Event) => {
						const target = e.target as HTMLInputElement;
						console.log('Range changed:', target.value);
						currentAssessment.attemptTimeLimit = parseInt(target.value) * 60;
					}}
				/>
				<span class="text-sm">
					{Math.round(currentAssessment.attemptTimeLimit / 60)} minutes
				</span>
			</div>
			<Label class="mb-2 text-sm">Review Time Limit (in minutes)</Label>
			<div class="flex flex-row items-center gap-2">
				<Range
					max="120"
					min="1"
					step="1"
					value={currentAssessment.reviewTimeLimit / 60}
					onchange={(e: Event) => {
						const target = e.target as HTMLInputElement;
						currentAssessment.reviewTimeLimit = parseInt(target.value) * 60; // Convert to seconds
					}}
				/>
				<span class="text-sm">
					{Math.round(currentAssessment.reviewTimeLimit / 60)} minutes
				</span>
			</div>

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
				console.log('Assessment submission success:', success);
				if (success) {
					// Reset the form
					currentAssessment = assessment || emptyAssessment();
					submissionErrors = [];
					isModalOpen = false;
				}
			}}>{currentAssessment.id ? 'Update' : 'Create'} Assessment</Button
		>
	{/snippet}
</Modal>
