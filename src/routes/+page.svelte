<script lang="ts">
	import AddModuleButton from '$lib/components/add-module-button.svelte';
	import { onMount, tick } from 'svelte';
	import ModuleCard from '$lib/components/module-card.svelte';
	import { removeModule, getModulesState, getImageUrl } from '$lib/services/knowLearing.svelte';

	let modules = getModulesState();

	async function getModuleImageUrl(uuid: string | undefined) {
		if (!uuid) {
			return '/default-module.png';
		}
		try {
			return await getImageUrl(uuid);
		} catch (error) {
			console.error('Error fetching image URL:', error);
			return '/default-module.png';
		}
	}

	$effect(() => {
		// currentModules = dataService.modules;
		// console.log('Modules updated:', currentModules);
		console.log('Modules updated:', modules);
	});
</script>

<div class="container mx-auto flex h-full w-full flex-col">
	<div class="flex w-full items-center justify-between py-2">
		<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Problem Modules</h2>
		<AddModuleButton />
	</div>
	<div class="grid grid-cols-1 gap-5 md:grid-cols-4">
		{#each Object.values(modules() || {}) as module}
			<ModuleCard
				{module}
				onModuleDelete={removeModule}
				coverImageUrl={getModuleImageUrl(module?.coverImageUUID)}
			/>
		{/each}
	</div>
</div>
