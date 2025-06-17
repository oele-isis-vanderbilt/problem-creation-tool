<script lang="ts">
	import type { PageProps } from './$types';
	import { getProblemComponent } from '$lib/components/problems/problem-components/utils';
	import { omit } from 'underscore';
	import type { ProblemRunState } from '$lib/services/models';

	const { data }: PageProps = $props();
	const ProblemComponent = getProblemComponent(data.problem.kind);

	function onRunStateChange(state: ProblemRunState) {
		Object.assign(data.runState, omit(state, ['problem']));
	}
</script>

<div class="bg-primary-300 h-full w-full rounded-lg p-5 shadow-lg md:p-10">
	<ProblemComponent problem={data.problem} mode="assess" {onRunStateChange} />
</div>
