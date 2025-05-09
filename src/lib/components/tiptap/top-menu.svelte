<script lang="ts">
	import { Editor } from '@tiptap/core';
	import BulletIcon from 'virtual:icons/ic/baseline-format-list-bulleted';
	import NumberIcon from 'virtual:icons/ic/baseline-format-list-numbered';
	import CenterIcon from 'virtual:icons/ic/outline-format-align-center';
	import LeftIcon from 'virtual:icons/ic/outline-format-align-left';
	import RightIcon from 'virtual:icons/ic/outline-format-align-right';

	import ImageUploadButton from './upload-image-button.svelte';

	let {
		editor = $bindable()
	}: {
		editor: Editor;
	} = $props();

	const toggleHeading = (level: 1 | 2 | 3) => {
		return () => {
			editor.chain().focus().toggleHeading({ level }).run();
		};
	};

	const toggleBold = () => {
		editor.chain().focus().toggleBold().run();
	};

	const toggleItalic = () => {
		editor.chain().focus().toggleItalic().run();
	};

	const setParagraph = () => {
		editor.chain().focus().setParagraph().run();
	};

	const isActive = (name: string, attrs = {}) => editor.isActive(name, attrs);

	const menuItems = $derived([
		{
			name: 'heading-1',
			command: toggleHeading(1),
			content: 'H1',
			active: () => isActive('heading', { level: 1 })
		},
		{
			name: 'heading-2',
			command: toggleHeading(2),
			content: 'H2',
			active: () => isActive('heading', { level: 2 })
		},
		{
			name: 'heading-3',
			command: toggleHeading(3),
			content: 'H3',
			active: () => isActive('heading', { level: 3 })
		},
		{
			name: 'bold',
			command: toggleBold,
			content: 'B',
			active: () => isActive('bold')
		},
		{
			name: 'italic',
			command: toggleItalic,
			content: 'I',
			active: () => isActive('italic')
		},
		{
			name: 'paragraph',
			command: setParagraph,
			content: 'P',
			active: () => isActive('paragraph')
		},
		{
			name: 'bullet-list',
			command: () => editor.chain().focus().toggleBulletList().run(),
			content: 'Bullet',
			component: BulletIcon,
			active: () => isActive('bulletList')
		},
		{
			name: 'ordered-list',
			command: () => editor.chain().focus().toggleOrderedList().run(),
			content: 'Numbered',
			component: NumberIcon,
			active: () => isActive('orderedList')
		},
		{
			name: 'align-left',
			command: () => editor.chain().focus().setTextAlign('left').run(),
			content: 'Left',
			component: LeftIcon,
			active: () => isActive('textAlign', { textAlign: 'left' })
		},
		{
			name: 'align-center',
			command: () => editor.chain().focus().setTextAlign('center').run(),
			content: 'Center',
			component: CenterIcon,
			active: () => isActive('textAlign', { textAlign: 'center' })
		},
		{
			name: 'align-right',
			command: () => editor.chain().focus().setTextAlign('right').run(),
			content: 'Right',
			component: RightIcon,
			active: () => isActive('textAlign', { textAlign: 'right' })
		}
	]);
</script>

<div
	class="bg-primary-200 dark:bg-primary-400 flex flex-row items-center justify-start gap-2 p-2 shadow-lg"
>
	{#each menuItems as item (item.name)}
		<button
			type="button"
			class={[
				'h-7 w-7 rounded-sm text-black hover:bg-white hover:text-black  dark:hover:bg-black dark:hover:text-white',
				{
					'bg-black text-white': item.active()
				}
			]}
			onclick={item.command}
		>
			{#if item.component}
				<item.component class="ml-1 text-center" />
			{:else}
				{item.content}
			{/if}
		</button>
	{/each}
	<ImageUploadButton bind:editor />
</div>
