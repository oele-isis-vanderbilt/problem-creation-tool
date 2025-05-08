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
		placeholder,
		onContentUpdate
	}: {
		content: JSONContent;
		readOnly?: boolean;
		placeholder?: string;
		onContentUpdate?: (content: JSONContent) => void;
	} = $props();

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
					class:
						'border-2 border-black rounded-b-md p-3 outline-hidden min-h-[300px] bg-gray-200 text-black dark:bg-gray-800 dark:text-white'
				}
			},
			onUpdate: ({ editor }) => {
				const json = editor.getJSON();
				if (onContentUpdate) {
					onContentUpdate(json);
				}
			},
			editable: !readOnly
		});
	});
</script>

<div class="flex h-full w-full flex-col">
	<EditorContent editor={$editor} />
</div>
