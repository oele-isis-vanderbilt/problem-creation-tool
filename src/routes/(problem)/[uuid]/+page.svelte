<script lang="ts">
	import ProblemComponent from '$lib/components/problems/problem/problem.svelte';
	import type { PageProps } from './$types';
	const { data }: PageProps = $props();
</script>

<div class="h-full w-full bg-primary-300 shadow-lg rounded-lg p-20">
	<ProblemComponent problem={data.problem} onProblemUpdated={() => {}} previewOnly={true} />
</div>
