<script lang="ts">
	import type { PageProps } from './$types';
	import { store } from '$lib/services/knowLearningStore.svelte';
	import NameDescriptionEditor from '$lib/components/module/name-description-editor.svelte';
	import ProblemComponent from '$lib/components/problems/problem/problem.svelte';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import ProblemHeader from '$lib/components/problems/problem-header.svelte';
	import { friendlyDateTime } from '$lib/utils';
	import StartAssessmentButton from '$lib/components/assessment/start-assessment-button.svelte';

	let { data }: PageProps = $props();
	const { getAssessmentsFn, updateAssessmentTitleDescription } = store!;

	let assessment = $derived.by(() => {
		return getAssessmentsFn()()[data.assessment.id];
	});

	function onNameDescriptionChage(name: string, description: string) {
		updateAssessmentTitleDescription(assessment.id, name, description);
	}
</script>

<div class="container mx-auto mt-2 flex h-full w-full flex-col">
	<div class="mb-4 flex w-full items-center justify-between gap-2">
		<NameDescriptionEditor
			name={assessment.title}
			description={assessment.description}
			onChange={onNameDescriptionChage}
		/>
		<StartAssessmentButton {assessment} />
	</div>
	<Accordion class="mb-20">
		{#each assessment?.problems as problem, index}
			<AccordionItem>
				{#snippet header()}
					<ProblemHeader
						title={problem.title}
						lastUpdated={friendlyDateTime(problem.updatedAt!)}
						kind={problem.kind}
						hasDeleteButton={false}
					/>
				{/snippet}
				<ProblemComponent {problem} previewOnly={true} />
			</AccordionItem>
		{/each}
	</Accordion>
</div>
