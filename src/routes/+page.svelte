<script lang="ts">
	import AddModuleButton from '$lib/components/add-module-button.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import ModuleCard from '$lib/components/module-card.svelte';

	const { data }: PageData = $props();

	onMount(() => {
		// Initialize any necessary state or perform actions on mount
		console.log('Modules state:', data.modulesState);
	});
</script>

<div class="container mx-auto flex h-full w-full flex-col">
	<div class="flex w-full items-center justify-between py-2">
		<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Problem Modules</h2>
		<AddModuleButton />
	</div>
	<div class="grid grid-cols-1 gap-5 md:grid-cols-4">
		{#each data.modulesState?.modules || [] as module}
			<ModuleCard {module} />
		{/each}
	</div>
	<!-- <ConceptsButton/> -->
</div>
