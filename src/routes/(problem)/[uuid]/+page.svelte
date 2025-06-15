<script lang="ts">
	import ProblemComponent from '$lib/components/problems/problem/problem.svelte';
	import type { PageProps } from './$types';
	const { data }: PageProps = $props();
</script>

<div class="bg-primary-300 h-full w-full rounded-lg p-20 shadow-lg">
	<ProblemComponent problem={data.problem} onProblemUpdated={() => {}} previewOnly={true} />
</div>
