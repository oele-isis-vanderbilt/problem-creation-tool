<script lang="ts">
	import { Button, MultiSelect, type SelectOptionType } from 'flowbite-svelte';
	import AddTag from '$lib/components/tag/add-edit-tag.svelte';

	import { store } from '$lib/services/knowLearningStore.svelte';

	const { getTagsFn } = store!;

	let {
		selectedTagIds = $bindable()
	}: {
		selectedTagIds: string[];
	} = $props();

	let isTagAdderOpen = $state(false);

	let tagItems = $derived.by(() => {
		const tags = getTagsFn()();
		const items = Object.values(tags).map((tag) => {
			return {
				value: tag.id,
				name: tag.tagName
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
	<MultiSelect
		class="flex-1"
		bind:value={selectedTagIds}
		items={tagItems}
		placeholder="Select tags related to this problem"
	></MultiSelect>
	<Button
		onclick={() => {
			isTagAdderOpen = !isTagAdderOpen;
		}}
	>
		Add new tag
	</Button>
</div>

<AddTag bind:open={isTagAdderOpen}></AddTag>
