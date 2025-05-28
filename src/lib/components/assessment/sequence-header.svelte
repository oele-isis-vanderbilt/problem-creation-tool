<script lang="ts">
	let { title, onClickHelpButton }: { title: string; onClickHelpButton: () => void } = $props();

	import HandRaiseIcon from 'virtual:icons/heroicons-solid/hand-raised';
</script>

<div class="bg-primary-400 dark:bg-secondary-950 flex w-full items-start justify-between gap-2 p-5">
	<h1 class="text-2xl font-bold">{title}</h1>
	<HandRaiseIcon
		class="h-6 w-6 cursor-pointer  hover:text-green-700"
		on:click={onClickHelpButton}
		title="Request Help"
	></HandRaiseIcon>
</div>
