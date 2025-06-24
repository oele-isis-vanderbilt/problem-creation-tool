<script lang="ts">
	import AddModuleButton from '$lib/components/module/add-module-button.svelte';
	import ImportModuleButton from '$lib/components/module/import-module-button.svelte';
	import ModuleCard from '$lib/components/module/module-card.svelte';
	import { store } from '$lib/services/knowLearningStore.svelte';
	import { prependBaseUrl } from '$lib/utils';

	const { getFn, deleteModule, getImageUrl, importModule } = store!;

	let modules = $derived.by(() => {
		return getFn();
	});

	async function getModuleImageUrl(uuid: string | undefined) {
		if (!uuid) {
			return prependBaseUrl('/default-module.png');
		}
		try {
			return await getImageUrl(uuid);
		} catch (error) {
			console.error('Error fetching image URL:', error);
			return prependBaseUrl('/default-module.png');
		}
	}
</script>

<div class="container mx-auto flex h-full w-full flex-col">
	<div class="flex w-full items-center justify-between py-2">
		<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Problem Modules</h2>
		<div class="flex gap-2">
			<AddModuleButton />
			<ImportModuleButton onImportModule={importModule} />
		</div>
	</div>
	<div class="grid grid-cols-1 gap-5 md:grid-cols-4">
		{#each Object.values(modules) as module}
			<ModuleCard
				{module}
				onModuleDelete={deleteModule}
				coverImageUrl={getModuleImageUrl(module?.coverImageUUID)}
			/>
		{/each}
	</div>
</div>
