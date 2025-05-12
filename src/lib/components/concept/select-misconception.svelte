<script lang="ts">
	import { store } from '$lib/services/knowLearningStore.svelte';
	import { Button, Select, type SelectOptionType } from 'flowbite-svelte';

	let { selectedMisconceptionId = $bindable() }: { selectedMisconceptionId: string } = $props();
	import AddEditMisconception from './add-edit-misconception.svelte';

	const { getMisconceptionsFn } = store!;

	let misconceptionItems = $derived.by(() => {
		const misconceptions = getMisconceptionsFn()();

		const items = Object.values(misconceptions).map((misconception) => {
			return {
				value: misconception.id,
				name: misconception.name
			} as SelectOptionType<string>;
		});
		if (items.length === 0) {
			items.push({
				value: 'No misconceptions available',
				name: 'No misconceptions available',
				disabled: true
			} as SelectOptionType<string>);
		}
		return items;
	});

	let isMisconceptionAdderOpen = $state(false);
</script>

<div class="flex h-full w-full flex-row gap-2">
	<Select
		class="w-32 flex-1"
		bind:value={selectedMisconceptionId}
		items={misconceptionItems}
		clearable
	/>
	<Button
		onclick={() => {
			isMisconceptionAdderOpen = !isMisconceptionAdderOpen;
		}}
	>
		Add new misconception
	</Button>
</div>

<AddEditMisconception bind:open={isMisconceptionAdderOpen}></AddEditMisconception>
