<script lang="ts">
	import AddProblemsButton from '$lib/components/add-problems-button.svelte';
	import type { PageProps } from './$types';
	import HeadingDescriptionEditor from '$lib/components/name-description-editor.svelte';
	import { ProblemKind, type Module, type MultipleChoiceProblem } from '$lib/services/models';
	import {
		addNewProblem,
		deleteProblem,
		getModule,
		getModulesState
	} from '$lib/services/knowLearing.svelte';
	import { getContext } from 'svelte';
	import type { AgentEnvironment } from '@knowlearning/agents/browser';
	import Mcq from '$lib/components/mcq.svelte';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import ProblemHeader from '$lib/components/problem-header.svelte';

	const appEnv = getContext<AgentEnvironment>('appEnv');
	let { data }: PageProps = $props();

	const modules = getModulesState();

	let module: Module = $derived.by(() => {
		return modules()[data.module.id];
	});

	function onAddProblem(kind: ProblemKind) {
		addNewProblem(module.id, kind, appEnv.auth.user);
	}

	function onDeleteProblem(problemId: string) {
		deleteProblem(problemId, module.id);
	}
</script>

<div class="container mx-auto mt-2 flex h-full w-full flex-col">
	<HeadingDescriptionEditor bind:name={module.name} bind:description={module.description} />
	<div class="flex h-full flex-col items-start justify-center gap-4 md:flex-row">
		<div class="flex w-full items-center justify-between py-2">
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Problems</h2>
			<AddProblemsButton onProblemKindSelected={onAddProblem} />
		</div>
	</div>
	<Accordion>
		{#each module?.problems as problem, index}
			{#if problem.kind === ProblemKind.MULTIPLE_CHOICE}
				<AccordionItem>
					{#snippet header()}
						<ProblemHeader
							title={problem.title}
							onProblemDeleted={() => onDeleteProblem(problem.id)}
						/>
					{/snippet}
					<Mcq bind:problem={module.problems[index] as MultipleChoiceProblem} />
				</AccordionItem>
				<!-- {:else if problem.kind === ProblemKind.WORD_PROBLEM}
            WORD_PROBLEM -->
			{/if}
		{/each}
	</Accordion>
</div>
