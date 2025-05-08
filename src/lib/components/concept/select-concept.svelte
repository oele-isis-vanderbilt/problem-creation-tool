<script lang="ts">
	import { Button, MultiSelect, type SelectOptionType } from 'flowbite-svelte';
	import AddConcept from '$lib/components/concept/add-edit-concept.svelte';

	import { store } from '$lib/services/knowLearningStore.svelte';

	const { getConceptsFn } = store!;

	let {
		selectedConceptIds = $bindable()
	}: {
		selectedConceptIds: string[];
	} = $props();

	let isConceptAdderOpen = $state(false);

	let conceptItems = $derived.by(() => {
		const concepts = getConceptsFn()();
		const items = Object.values(concepts).map((concept) => {
			return {
				value: concept.id,
				name: concept.name
			} as SelectOptionType<string>;
		});
		if (items.length === 0) {
			items.push({
				value: 'No concepts available',
				name: 'No concepts available',
				disabled: true
			} as SelectOptionType<string>);
		}
		return items;
	});
</script>

<div class="flex h-full w-full flex-row gap-2">
	<MultiSelect class="flex-1" bind:value={selectedConceptIds} bind:items={conceptItems}
	></MultiSelect>
	<Button
		onclick={() => {
			isConceptAdderOpen = !isConceptAdderOpen;
		}}
		class="gap-2 rounded-lg border-2 border-gray-200 p-2 text-black dark:border-gray-400 dark:text-white"
	>
		Add new concept
	</Button>
</div>

<AddConcept bind:open={isConceptAdderOpen}></AddConcept>
