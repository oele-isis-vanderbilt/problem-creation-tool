<script lang="ts">
	import AddProblemsButton from '$lib/components/problems/add-problems-button.svelte';
	import type { PageProps } from './$types';
	import HeadingDescriptionEditor from '$lib/components/module/name-description-editor.svelte';
	import { ProblemKind, type Problem } from '$lib/services/models';
	import { getContext } from 'svelte';
	import type { AgentEnvironment } from '@knowlearning/agents/browser';

	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import ProblemHeader from '$lib/components/problems/problem-header.svelte';
	import { debounce, friendlyDateTime } from '$lib/utils';
	import { store } from '$lib/services/knowLearningStore.svelte';
	import { getProblemComponent } from '$lib/components/problems/problem-components/utils';
	import CreateAssessmentButton from '$lib/components/assessment/create-edit-assessment.svelte';
	import ExportButton from '$lib/components/composables/ExportButton.svelte';

	const appEnv = getContext<AgentEnvironment>('appEnv');
	let { data }: PageProps = $props();

	const {
		getFn,
		updateModuleNameDescription,
		addNewProblem,
		deleteProblem,
		updateProblem,
		exportModule
	} = store!;

	let module = $derived.by(() => {
		return getFn()[data.module.id];
	});

	function onAddProblem(kind: ProblemKind) {
		addNewProblem(module.id, kind, appEnv.auth.user);
	}

	function onDeleteProblem(problemId: string) {
		deleteProblem(problemId, module.id);
	}

	const delayedUpdateFn = debounce((problem: Problem) => {
		updateProblem(module.id, problem);
	}, 500);

	function onUpdateProblem(problem: Problem) {
		delayedUpdateFn(problem);
	}

	function onNameDescriptionChage(name: string, description: string) {
		updateModuleNameDescription(module.id, name, description);
	}

	async function onExportModule() {
		const uuid = await exportModule($state.snapshot(module));
		return uuid;
	}

	$inspect(module.problems);
</script>

<div class="container mx-auto mt-2 flex h-full w-full flex-col">
	<div class="flex gap-2">
		<HeadingDescriptionEditor
			name={module.name}
			description={module.description}
			onChange={onNameDescriptionChage}
		/>
		<div class="flex items-center gap-2">
			<CreateAssessmentButton {module} />
		</div>
	</div>
	<div class="flex h-full flex-col items-start justify-center gap-4 md:flex-row">
		<div class="flex w-full items-center justify-between py-2">
			<h2 class="text-lg font-bold md:text-2xl">Problems</h2>
			<div class="flex items-center gap-2">
				<ExportButton onExport={onExportModule} title="Export Module"></ExportButton>
				<AddProblemsButton onProblemKindSelected={onAddProblem} />
			</div>
		</div>
	</div>
	<Accordion class="mb-20">
		{#each module?.problems as problem, index (problem.id)}
			{@const ProblemComponent = getProblemComponent(problem.kind)}
			<AccordionItem>
				{#snippet header()}
					<ProblemHeader
						id={problem.id}
						title={problem.title}
						lastUpdated={friendlyDateTime(problem.updatedAt!)}
						kind={problem.kind}
						onProblemDeleted={() => onDeleteProblem(problem.id)}
					/>
				{/snippet}
				<ProblemComponent problem={module.problems[index]} onProblemUpdated={onUpdateProblem} />
			</AccordionItem>
		{/each}
	</Accordion>
</div>
