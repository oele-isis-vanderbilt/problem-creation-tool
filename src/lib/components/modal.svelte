<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Modal, type SizeType } from 'flowbite-svelte';

	let {
		title,
		footer: modalFooter,
		main,
		open,
		onClose,
		size = 'lg'
	}: {
		title: string;
		footer: Snippet;
		main: Snippet;
		open: boolean;
		onClose: () => void;
		size?: SizeType;
	} = $props();
</script>

{#if open}
	<Modal {size} {open} {title} on:close={onClose}>
		{@render main()}
		{#snippet footer()}
			{@render modalFooter()}
		{/snippet}
	</Modal>
{/if}
