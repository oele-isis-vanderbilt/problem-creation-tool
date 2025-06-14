<script lang="ts">
	import AssessmentCard from '$lib/components/assessment/assessment-card.svelte';
	import CreateAssessmentButton from '$lib/components/assessment/create-edit-assessment.svelte';
	import { store } from '$lib/services/modules-store.svelte';
	import { prependBaseUrl } from '$lib/utils';

	const { getAssessmentsFn, deleteAssessment, getImageUrl } = store!;

	async function getAssessmentImageUrl(uuid: string | undefined) {
		if (!uuid) {
			return prependBaseUrl('/default-module.png');
		}
		try {
			return await getImageUrl(uuid);
		} catch (error) {
			console.error('Error fetching image URL:', error);
			return prependBaseUrl('/default-module.png');
		}
	}
</script>

<div class="container mx-auto flex h-full w-full flex-col">
	<div class="flex w-full items-center justify-between py-2">
		<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Assessments</h2>
		<CreateAssessmentButton />
	</div>
	{#if Object.keys(getAssessmentsFn()()).length === 0}
		<p class="text-gray-500 dark:text-gray-400">
			No assessments available. Create one to get started!
		</p>
	{/if}
	<div class="grid grid-cols-1 gap-5 md:grid-cols-4">
		{#each Object.values(getAssessmentsFn()()) as assessment}
			<AssessmentCard
				{assessment}
				onAssessmentDelete={deleteAssessment}
				coverImageUrl={getAssessmentImageUrl(assessment.coverImageUUID)}
			/>
		{/each}
	</div>
</div>
