<script lang="ts">
	import { Editor } from 'svelte-tiptap';
	import ImageIcon from 'virtual:icons/ic/baseline-image';
	import { store } from '$lib/services/knowLearningStore.svelte';

	let { editor = $bindable() }: { editor: Editor } = $props();
	const { uploadImage, getImageUrl } = store!;

	let fileInput: HTMLInputElement | null = $state(null);
	const onFileSelected = async (e: Event) => {
		let target = e.target as HTMLInputElement;
		if (!target.files || target.files.length === 0) {
			return;
		}
		let image = target.files[0];
		let uuid = await uploadImage(image);
		let imageUrl = await getImageUrl(uuid);
		editor.commands.setImage({ src: imageUrl });
		editor.commands.focus('end');
		fileInput!.value = '';
	};

	const onClick = () => {
		fileInput?.click();
	};
</script>

<button
	type="button"
	class={[
		'h-7 w-7 rounded-sm text-black hover:bg-white hover:text-black  dark:hover:bg-black dark:hover:text-white'
	]}
	onclick={onClick}
>
	<ImageIcon class="ml-1 text-center" />
	<input
		style="display:none"
		aria-label="lorem ipsum"
		type="file"
		accept=".jpg, .jpeg, .png"
		onchange={(e) => onFileSelected(e)}
		bind:this={fileInput}
	/>
</button>
