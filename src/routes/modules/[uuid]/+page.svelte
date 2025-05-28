<script lang="ts">
	import AddProblemsButton from '$lib/components/problems/add-problems-button.svelte';
	import type { PageProps } from './$types';
	import HeadingDescriptionEditor from '$lib/components/module/name-description-editor.svelte';
	import { ProblemKind, type MultipleChoiceProblem, type Problem } from '$lib/services/models';
	import { getContext } from 'svelte';
	import type { AgentEnvironment } from '@knowlearning/agents/browser';
	import ProblemComponent from '$lib/components/problems/problem/problem.svelte';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import ProblemHeader from '$lib/components/problems/problem-header.svelte';
	import { debounce, friendlyDateTime } from '$lib/utils';
	import { store } from '$lib/services/knowLearningStore.svelte';
	import SequenceWrapper from '$lib/components/assessment/sequence-wrapper.svelte';
	import CreateAssessmentButton from '$lib/components/assessment/create-edit-assessment.svelte';

	const appEnv = getContext<AgentEnvironment>('appEnv');
	let { data }: PageProps = $props();

	const { getFn, updateModuleNameDescription, addNewProblem, deleteProblem, updateProblem } =
		store!;

	let module = $derived.by(() => {
		return getFn()[data.module.id];
	});

	function onAddProblem(kind: ProblemKind) {
		addNewProblem(module.id, kind, appEnv.auth.user);
	}

	function onDeleteProblem(problemId: string) {
		deleteProblem(problemId, module.id);
	}

	function onUpdateProblem(problem: Problem) {
		const delayedFn = debounce(() => {
			updateProblem(module.id, problem);
		}, 500);

		delayedFn();
	}

	function onNameDescriptionChage(name: string, description: string) {
		updateModuleNameDescription(module.id, name, description);
	}
</script>

<div class="container mx-auto mt-2 flex h-full w-full flex-col">
	<div class="flex w-full items-center justify-between gap-2">
		<HeadingDescriptionEditor
			name={module.name}
			description={module.description}
			onChange={onNameDescriptionChage}
		/>
		<div>
			<CreateAssessmentButton {module} />
		</div>
	</div>

	<div class="flex h-full flex-col items-start justify-center gap-4 md:flex-row">
		<div class="flex w-full items-center justify-between py-2">
			<h2 class="text-lg font-bold md:text-2xl">Problems</h2>
			<AddProblemsButton onProblemKindSelected={onAddProblem} />
		</div>
	</div>
	<Accordion class="mb-20">
		{#each module?.problems as problem, index}
			<AccordionItem>
				{#snippet header()}
					<ProblemHeader
						title={problem.title}
						lastUpdated={friendlyDateTime(problem.updatedAt!)}
						kind={problem.kind}
						onProblemDeleted={() => onDeleteProblem(problem.id)}
					/>
				{/snippet}
				<ProblemComponent
					bind:problem={module.problems[index]}
					onProblemUpdated={onUpdateProblem}
				/>
			</AccordionItem>
		{/each}
	</Accordion>
</div>
