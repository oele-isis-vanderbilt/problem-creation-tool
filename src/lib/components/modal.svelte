<script lang="ts">
	import CrossIcon from 'virtual:icons/heroicons-solid/x-mark';
	import { sineIn } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	let {
		title,
		footer,
		main,
		open,
		onClose
	}: { title: string; footer: Snippet; main: Snippet; open: boolean; onClose: () => void } =
		$props();
</script>

{#if open}
	<div
		transition:fade={{ duration: 150, easing: sineIn }}
		class="absolute top-0 right-0 bottom-0 left-0 grid items-center justify-center"
	>
		<div class="absolute top-0 right-0 bottom-0 left-0 bg-gray-900/95" style="z-index: 100;"></div>
		<div
			class="bg-bglight relative h-screen w-screen divide-y divide-gray-800 rounded-lg border-1 border-gray-800 shadow-lg sm:h-auto sm:w-[80vw] sm:max-w-[800px] dark:divide-gray-600 dark:border-gray-600"
			style="z-index: 1000;"
		>
			<div class="flex h-full w-full flex-row items-center justify-between p-2">
				<h2 class="text-xl font-bold text-gray-900 dark:text-gray-300">{title}</h2>
				<button
					class="rounded-lg border-2 border-gray-200 p-1 text-sm text-black dark:text-gray-300"
					onclick={() => onClose()}
				>
					<CrossIcon />
				</button>
			</div>
			<div class="h-full min-h-32 overflow-auto p-2">
				{@render main()}
			</div>
			<div class="h-full w-full p-2">
				{@render footer()}
			</div>
		</div>
	</div>
{/if}
