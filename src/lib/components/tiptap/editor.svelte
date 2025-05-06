<script lang="ts">
	import type { Readable } from 'svelte/store';
	import StarterKit from '@tiptap/starter-kit';
	import PlaceHolder from '@tiptap/extension-placeholder';
	import type { JSONContent } from '@tiptap/core';
	import { Editor, EditorContent, createEditor } from 'svelte-tiptap';
	import { onMount } from 'svelte';

	let {
		content,
		readOnly = false,
		placeholder
	}: { content: JSONContent; readOnly?: boolean; placeholder?: string } = $props();

	let editor = $state<Readable<Editor>>();

	onMount(() => {
		editor = createEditor({
			extensions: [
				StarterKit,
				PlaceHolder.configure({
					placeholder: placeholder || 'Type something...'
				})
			],
			content: content,

			editorProps: {
				attributes: {
					class: 'border-2 border-black rounded-b-md p-3 outline-hidden'
				}
			},
			onUpdate: ({ editor }) => {
				const json = editor.getJSON();
				console.log(json);
			},
			editable: !readOnly
		});
	});
</script>

<div class="flex h-full w-full flex-col">
	<div class="flex h-full w-full items-start gap-2"></div>
	<div class="min-h-[300px] w-full">
		<EditorContent editor={$editor} class="h-full w-full" />
	</div>
</div>
