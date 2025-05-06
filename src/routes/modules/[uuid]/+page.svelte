<script lang="ts">
	import AddProblemsButton from '$lib/components/add-problems-button.svelte';
	import type { PageProps } from './$types';
	import HeadingDescriptionEditor from '$lib/components/name-description-editor.svelte';
	import {
		ProblemKind,
		type Module,
		type MultipleChoiceProblem,
		type Problem
	} from '$lib/services/models';
	import {
		addNewProblem,
		deleteProblem,
		getModule,
		getModulesState,
		updateModuleNameDescription,
		updateProblem
	} from '$lib/services/knowLearing.svelte';
	import { getContext } from 'svelte';
	import type { AgentEnvironment } from '@knowlearning/agents/browser';
	import Mcq from '$lib/components/mcq.svelte';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import ProblemHeader from '$lib/components/problem-header.svelte';
	import { debounce, friendlyDateTime } from '$lib/utils';

	const appEnv = getContext<AgentEnvironment>('appEnv');
	let { data }: PageProps = $props();

	const modules = getModulesState();

	let module: Module = $derived.by(() => {
		return modules()[data.module.id];
	});

	function onAddProblem(kind: ProblemKind) {
		if (kind === ProblemKind.MULTIPLE_CHOICE) {
			addNewProblem(module.id, kind, appEnv.auth.user);
		} else {
			alert('Problem kind not supported yet: ' + kind);
		}
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
	<HeadingDescriptionEditor
		name={module.name}
		description={module.description}
		onChange={onNameDescriptionChage}
	/>
	<div class="flex h-full flex-col items-start justify-center gap-4 md:flex-row">
		<div class="flex w-full items-center justify-between py-2">
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Problems</h2>
			<AddProblemsButton onProblemKindSelected={onAddProblem} />
		</div>
	</div>
	<Accordion>
		{#each Object.entries(module?.problems) as [id, problem], index}
			<AccordionItem>
				{#snippet header()}
					<ProblemHeader
						title={problem.title}
						lastUpdated={friendlyDateTime(problem.updatedAt!)}
						onProblemDeleted={() => onDeleteProblem(problem.id)}
					/>
				{/snippet}

				{#if problem.kind === ProblemKind.MULTIPLE_CHOICE}
					<Mcq bind:problem={module.problems[id] as MultipleChoiceProblem} />
				{/if}
			</AccordionItem>
		{/each}
	</Accordion>
</div>
