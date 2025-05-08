<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { Editor } from '@tiptap/core';

	const {
		editor = $bindable()
	}: {
		editor: Readable<Editor>;
	} = $props();
</script>
