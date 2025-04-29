<script lang="ts">
	import { setMode, mode } from 'mode-watcher';
	import Sun from 'virtual:icons/heroicons-solid/sun';
	import Moon from 'virtual:icons/heroicons-solid/moon';

	function handleModeChange() {
		if (mode.current === 'dark') {
			setMode('light');
		} else {
			setMode('dark');
		}
	}
</script>

<button
	onclick={handleModeChange}
	class="has-tooltip rounded-lg border-2 border-gray-200 p-2 text-black dark:border-gray-400 dark:text-white"
>
	<span class="tooltip mt-[50px] -ml-25 bg-gray-200 p-2 dark:bg-gray-800">Toggle Dark Mode</span>
	{#if mode.current === 'dark'}
		<Moon />
	{:else}
		<Sun />
	{/if}
</button>
