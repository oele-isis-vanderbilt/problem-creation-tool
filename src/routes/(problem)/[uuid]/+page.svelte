<script lang="ts">
	import type { PageProps } from './$types';
	import MCQ from '$lib/components/problems/problem-components/mcq/problem.svelte';
	import Word from '$lib/components/problems/problem-components/word/problem.svelte';
	import NDigit from '$lib/components/problems/problem-components/ndigit/problem.svelte';
	import { ProblemKind } from '$lib/services/models';
	import { getProblemComponent } from '$lib/components/problems/problem-components/utils';

	const { data }: PageProps = $props();
	const ProblemComponent = getProblemComponent(data.problem.kind);
</script>

<div class="bg-primary-300 h-full w-full rounded-lg p-20 shadow-lg">
	<ProblemComponent problem={data.problem} mode="assess" />
</div>
