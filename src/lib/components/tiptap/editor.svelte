<script lang="ts">
	import type { Readable } from 'svelte/store';
	import StarterKit from '@tiptap/starter-kit';
	import PlaceHolder from '@tiptap/extension-placeholder';
	import type { JSONContent } from '@tiptap/core';
	import { Editor, EditorContent, createEditor } from 'svelte-tiptap';
	import { onMount, onDestroy } from 'svelte';
	import TopMenu from './top-menu.svelte';
	import { Image as TipTapImage } from '@tiptap/extension-image';
	import TextAlign from '@tiptap/extension-text-align';

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

	let editor = $state() as Readable<Editor>;

	const getEditorClass = () => {
		if (readOnly) {
			return 'block w-full rtl:text-right p-2.5 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 bg-gray-50 text-gray-900 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 border border-gray-300 dark:border-gray-500';
		}
		return 'min-h-96 block w-full rtl:text-right p-2.5 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 bg-gray-50 text-gray-900 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 border border-gray-300 dark:border-gray-500';
	};

	onMount(() => {
		editor = createEditor({
			extensions: [
				StarterKit,
				PlaceHolder.configure({
					placeholder: placeholder || 'Type something...'
				}),
				TipTapImage.configure({
					HTMLAttributes: {
						class: 'mx-auto object-contain px-10 click:border-2 border-primary-500'
					}
				}),
				TextAlign.configure({
					types: ['heading', 'paragraph']
				})
			],
			content: content,
			editorProps: {
				attributes: {
					class: getEditorClass()
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

	onDestroy(() => {
		if (editor) {
			$editor.destroy();
		}
	});
</script>

<div class="mb-3 flex h-full w-full flex-col rounded-lg">
	{#if editor && !readOnly}
		<TopMenu bind:editor={$editor} />
	{/if}
	<EditorContent editor={$editor} />
</div>
