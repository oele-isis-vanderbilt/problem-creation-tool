<script lang="ts">
	let { name = $bindable(), description = $bindable() } = $props();

	let nameDisabled = $state(true);
	let descriptionDisabled = $state(true);

	function handleKeyDown(event: KeyboardEvent, field: string) {
		if (event.key === 'Enter' && field === 'name') {
			nameDisabled = true;
		} else if (event.key === 'Enter' && field === 'description') {
			descriptionDisabled = true;
		} else if (event.key === 'Escape' && field === 'name') {
			nameDisabled = true;
		} else if (event.key === 'Escape' && field === 'description') {
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
			bind:value={name}
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
			bind:value={description}
			class="bg-gray-200 text-lg text-gray-900 dark:bg-gray-900 dark:text-white"
			onkeydown={(e) => handleKeyDown(e, 'description')}
		/>
	{/if}
</div>
