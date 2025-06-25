<script lang="ts">
	import { Button, Spinner } from 'flowbite-svelte';
	import { ArchiveSolid } from 'flowbite-svelte-icons';
	import Modal from '../modal.svelte';
	import Clipboard from './Clipboard.svelte';
	let {
		onExport,
		title
	}: {
		onExport: () => Promise<string>;
		title: string;
	} = $props();

	let exporting = $state(false);
	let exportedUuid: string | null = $state(null);

	async function handleExport() {
		try {
			exporting = true;
			const uuid = await onExport();
			// Show Success With Copy Text
			exportedUuid = uuid;
		} catch (error) {
			console.error('Error exporting module:', error);
		} finally {
			exporting = false;
		}
	}
</script>

<Button class="gap-2" disabled={exporting} onclick={handleExport}>
	{#if exporting}
		<Spinner color="green" class="h-5 w-5" />
	{/if}
	<ArchiveSolid class="h-5 w-5" />
	{title}
</Button>

<Modal
	open={exportedUuid !== null}
	title="Exported successfully"
	onClose={() => {
		exportedUuid = null;
	}}
>
	{#snippet main()}
		<div class="flex w-full flex-col gap-4">
			<h2 class="text-lg font-semibold">Copy The UUID for future imports</h2>
			<div class="mb-4 flex items-center justify-between gap-0">
				<code class="flex-1 rounded bg-gray-100 p-2 break-all">
					{exportedUuid}
				</code>
				<Clipboard copyText={exportedUuid!} />
			</div>
		</div>
	{/snippet}
	{#snippet footer()}
		<Button onclick={() => (exportedUuid = null)} class="w-full">Close</Button>
	{/snippet}
</Modal>
