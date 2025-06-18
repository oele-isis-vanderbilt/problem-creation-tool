<script lang="ts">
	import type { PageProps } from './$types';
	import { store } from '$lib/services/knowLearningStore.svelte';
	import NameDescriptionEditor from '$lib/components/module/name-description-editor.svelte';
	import { getProblemComponent } from '$lib/components/problems/problem-components/utils';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import ProblemHeader from '$lib/components/problems/problem-header.svelte';
	import { friendlyDateTime, prependBaseUrl } from '$lib/utils';
	import StartAssessmentButton from '$lib/components/assessment/start-assessment-button.svelte';
	import AssessmentSummary from '$lib/components/assessment/assessment-summary.svelte';
	import EditAssessmentButton from '$lib/components/assessment/create-edit-assessment.svelte';
	import Clipboard from '$lib/components/composables/Clipboard.svelte';

	let { data }: PageProps = $props();
	const { getAssessmentsFn, updateAssessmentTitleDescription, getAssessmentKL } = store!;

	let assessment = $derived.by(() => {
		return getAssessmentsFn()()[data.assessment.id];
	});

	function onNameDescriptionChage(name: string, description: string) {
		updateAssessmentTitleDescription(assessment.id, name, description);
	}

	function getAssessmentUrl() {
		return window.location.origin + prependBaseUrl(`/${assessment.id}`);
	}
</script>

<div class="container mx-auto mt-2 flex h-full w-full flex-col gap-4">
	<div class="mb-4 flex w-full items-center justify-between gap-2">
		<NameDescriptionEditor
			name={assessment.title}
			description={assessment.description}
			onChange={onNameDescriptionChage}
		/>
		<Clipboard copyText={getAssessmentUrl()} beforeCopy="Copy Assessment Url to ClipBoard" />
		{#await getAssessmentKL(assessment.id)}
			<p class="text-gray-500 dark:text-gray-400">Loading assessment...</p>
		{:then klAssessment}
			<EditAssessmentButton assessment={klAssessment} />
		{:catch error}
			<p class="text-red-500 dark:text-red-400">Error loading assessment: {error.message}</p>
		{/await}
		<StartAssessmentButton {assessment} />
	</div>
	<AssessmentSummary {assessment} />
	<Accordion class="mb-20">
		{#each assessment?.problems as problem, index}
			<AccordionItem>
				{#snippet header()}
					<ProblemHeader
						id={problem.id}
						title={problem.title}
						lastUpdated={friendlyDateTime(problem.updatedAt!)}
						kind={problem.kind}
						hasDeleteButton={false}
					/>
				{/snippet}
				{@const ProblemComponent = getProblemComponent(problem.kind)}
				<ProblemComponent {problem} mode="assess" />
			</AccordionItem>
		{/each}
	</Accordion>
</div>
