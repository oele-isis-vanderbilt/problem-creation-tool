<script lang="ts">
	import type { PageProps } from './$types';
	import ProblemComponent from '$lib/components/problems/problem/problem.svelte';

	const { data } = $props<PageProps>();

    let problemAttempt = $state(null);

	$effect(() => {
		Object.assign(data.runstate, problemAttempt);
	});
</script>

<div class="p-5 bg-slate-00 dark:bg-primary-800 shadow-lg rounded-lg">
	<ProblemComponent
		problem={data.problem}
		previewOnly={true}
		showGradingFeedbackErrors={true}
		bind:problemAttempt
	/>
</div>
