<script lang="ts">
	import type { PageProps } from './$types';
	import { getProblemComponent } from '$lib/components/problems/problem-components/utils';
	import { omit } from 'underscore';
	import type { ProblemRunState } from '$lib/services/models';
	import SequenceWrapper from '$lib/components/assessment/sequence-wrapper.svelte';

	const { data }: PageProps = $props();
	const isProblem = $derived.by(() => data.problem !== null && data.runState !== null);

	function onRunStateChange(state: ProblemRunState) {
		Object.assign(data.runState!, {
			...omit(state, ['problem']),
			initialized: true,
			xapi: {
				verb: 'submitted',
				object: data.problem!.id,
				result: {
					success: state.isCorrect
				}
			}
		});
	}

	let wasRunStateInitialized = $derived.by(() => {
		return data.runState?.initialized || false;
	});
</script>

{#if isProblem}
	{@const ProblemComponent = getProblemComponent(data.problem!.kind)}
	<div class="bg-primary-300 h-full rounded-lg p-5 shadow-lg md:p-10">
		<ProblemComponent
			problem={data.problem!}
			mode="assess"
			problemSnapshot={wasRunStateInitialized ? data.runState! : null}
			{onRunStateChange}
		/>
	</div>
{:else}
	<SequenceWrapper assessment={data.assessment!} />
{/if}
