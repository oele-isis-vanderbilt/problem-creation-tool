<script lang="ts">
	import type { PageProps } from './$types';
	import { getProblemComponent } from '$lib/components/problems/problem-components/utils';

	const { data }: PageProps = $props();
	const ProblemComponent = getProblemComponent(data.problem.kind);
</script>

<div class="bg-primary-300 h-full w-full rounded-lg  p-5 md:p-10 shadow-lg">
	<ProblemComponent problem={data.problem} mode="assess" />
</div>
