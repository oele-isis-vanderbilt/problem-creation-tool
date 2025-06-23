<script lang="ts">
	let {
		errors
	}: {
		errors: string[];
	} = $props();
</script>

{#if errors.length > 0}
	<div
		class="mb-2 w-full rounded-lg border-2 border-red-200 bg-red-100 p-2 text-red-600 dark:border-red-400 dark:bg-red-400 dark:text-white"
	>
		{#each new Set(errors) as error}
			<p>{error}</p>
		{/each}
	</div>
{/if}
