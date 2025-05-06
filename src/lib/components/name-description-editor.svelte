<script lang="ts">
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
			class="text-2xl font-bold text-gray-900 dark:text-white"
			ondblclick={() => (nameDisabled = false)}
			role="button"
			tabindex="0"
		>
			{name}
		</div>
	{:else}
		<input
			type="text"
			bind:value={editableName}
			class="bg-gray-200 text-2xl font-bold text-gray-900 dark:bg-gray-900 dark:text-white"
			onkeydown={(e) => handleKeyDown(e, 'name')}
		/>
	{/if}
	{#if descriptionDisabled}
		<div
			class="text-lg text-gray-900 dark:text-white"
			ondblclick={() => (descriptionDisabled = false)}
			role="button"
			tabindex="0"
		>
			{description}
		</div>
	{:else}
		<input
			type="text"
			bind:value={editableDescription}
			class="bg-gray-200 text-lg text-gray-900 dark:bg-gray-900 dark:text-white"
			onkeydown={(e) => handleKeyDown(e, 'description')}
		/>
	{/if}
</div>
