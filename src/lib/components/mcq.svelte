<script lang="ts">
	import type { MultipleChoiceProblem } from '$lib/services/models';
	import { Input } from 'flowbite-svelte';

	let { problem = $bindable() }: { problem: MultipleChoiceProblem } = $props();
</script>

<div class="h-full w-full">
	<Input type="text" placeholder="Title" bind:value={problem.title} class="mb-2" />
</div>
