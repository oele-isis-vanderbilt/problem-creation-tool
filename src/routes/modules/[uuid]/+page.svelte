<script lang="ts">
	import AddProblemsButton from '$lib/components/add-problems-button.svelte';
	import Concepts from '$lib/components/concepts.svelte';
</script>

<div class="container mx-auto flex h-full w-full flex-col">
	<div class="flex h-full flex-col items-center justify-center md:flex-row">
		<div class="flex w-full items-center justify-between py-2">
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Problems</h2>
			<AddProblemsButton />
		</div>
		<div class="w-1/3">
			<Concepts />
		</div>
	</div>
</div>
