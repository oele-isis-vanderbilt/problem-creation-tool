<script lang="ts">
	import AddProblemsButton from '$lib/components/add-problems-button.svelte';
</script>

<div class="container mx-auto mt-10 flex h-full w-full flex-col">
	<div class="flex h-full flex-col items-start justify-center gap-4 md:flex-row">
		<div class="flex w-full items-center justify-between py-2">
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Problems</h2>
			<AddProblemsButton />
		</div>
	</div>
</div>
