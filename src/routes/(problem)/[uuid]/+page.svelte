<script lang="ts">
	import type { PageProps } from './$types';
	import { getProblemComponent } from '$lib/components/problems/problem-components/utils';
	import { omit } from 'underscore';
	import type { ProblemRunState } from '$lib/services/models';
	import SequenceWrapper from '$lib/components/assessment/sequence-wrapper.svelte';

	const { data }: PageProps = $props();
	const isProblem = $derived.by(() => data.problem !== null && data.runState !== null);

	function onRunStateChange(state: ProblemRunState) {
		Object.assign(data.runState!, omit(state, ['problem']));
	}
</script>

{#if isProblem}
	{@const ProblemComponent = getProblemComponent(data.problem!.kind)}
	<div class="bg-primary-300 rounded-lg p-5 shadow-lg md:p-10">
		<ProblemComponent problem={data.problem!} mode="assess" {onRunStateChange} />
	</div>
{:else}
	<SequenceWrapper assessment={data.assessment!} />
{/if}
