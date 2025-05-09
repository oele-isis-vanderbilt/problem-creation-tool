<script lang="ts">
	import { Input } from 'flowbite-svelte';

	let { name, description, onChange } = $props();
	let nameDisabled = $state(true);
	let descriptionDisabled = $state(true);

	let editableName = $state(name);
	let editableDescription = $state(description);

	function handleKeyDown(event: KeyboardEvent, field: string) {
		if (event.key === 'Enter' && field === 'name') {
			onChange(editableName, editableDescription);
			nameDisabled = true;
		} else if (event.key === 'Enter' && field === 'description') {
			onChange(editableName, editableDescription);
			descriptionDisabled = true;
		} else if (event.key === 'Escape' && field === 'name') {
			editableName = name;
			nameDisabled = true;
		} else if (event.key === 'Escape' && field === 'description') {
			editableDescription = description;
			descriptionDisabled = true;
		}
	}
</script>

<div class="flex w-full flex-col gap-2">
	{#if nameDisabled}
		<div
			class="text-2xl font-bold"
			ondblclick={() => (nameDisabled = false)}
			role="button"
			tabindex="0"
		>
			{name}
		</div>
	{:else}
		<Input
			type="text"
			bind:value={editableName}
			class="text-2xl font-bold"
			onkeydown={(e) => handleKeyDown(e, 'name')}
		/>
	{/if}
	{#if descriptionDisabled}
		<div
			class="text-lg"
			ondblclick={() => (descriptionDisabled = false)}
			role="button"
			tabindex="0"
		>
			{description}
		</div>
	{:else}
		<Input
			type="text"
			bind:value={editableDescription}
			class="text-lg"
			onkeydown={(e) => handleKeyDown(e, 'description')}
		/>
	{/if}
</div>
