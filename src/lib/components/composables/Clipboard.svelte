<script lang="ts">
	import { Clipboard, Tooltip } from 'flowbite-svelte';
	import { CheckOutline, ClipboardCleanSolid } from 'flowbite-svelte-icons';
	let {
		copyText,
		beforeCopy = 'Click to copy',
		onCopySuccess = 'Copied to clipboard'
	}: {
		copyText: string;
		beforeCopy?: string;
		onCopySuccess?: string;
	} = $props();
</script>

<Clipboard
	size="xs"
	color="alternative"
	onclick={(event) => event.stopPropagation()}
	value={copyText}
	class="-mr-1 w-20 focus:ring-0"
>
	{#snippet children(success)}
		<Tooltip class="whitespace-nowrap">{success ? onCopySuccess : beforeCopy}</Tooltip>
		{#if success}
			<CheckOutline class="h-3 w-3" />
		{:else}
			<ClipboardCleanSolid class="h-3 w-3" />
		{/if}
	{/snippet}
</Clipboard>
