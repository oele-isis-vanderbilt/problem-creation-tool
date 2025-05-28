<script lang="ts">
	let { title, onClickHelpButton }: { title: string; onClickHelpButton: () => void } = $props();

	import { Tooltip } from 'flowbite-svelte';
	import HandRaiseIcon from 'virtual:icons/heroicons-solid/hand-raised';

	let helpRequested = $state(false);
</script>

<div class="bg-primary-400 dark:bg-secondary-950 flex w-full items-start justify-between gap-2 p-5">
	<h1 class="text-2xl font-bold">{title}</h1>
	<HandRaiseIcon
		role="button"
		class={[
			'h-5 w-5 cursor-pointer hover:text-green-700',
			helpRequested && 'h-10 w-10 text-green-700'
		]}
		onclick={() => {
			helpRequested = true;
			onClickHelpButton();
		}}
	></HandRaiseIcon>
	<Tooltip>
		{helpRequested ? 'Someone will be with you shortly' : 'Click to request help'}
	</Tooltip>
</div>
