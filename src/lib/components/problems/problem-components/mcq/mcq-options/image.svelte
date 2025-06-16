<script lang="ts">
	import type { MultipleChoiceOptionImage } from '$lib/services/models';
	import { Fileupload, Img, Spinner } from 'flowbite-svelte';
	import { store } from '$lib/services/knowLearningStore.svelte';

	const { uploadImage, getImageUrl } = store!;

	let {
		option = $bindable(),
		mode = 'edit'
	}: {
		option: MultipleChoiceOptionImage;
		mode: 'edit' | 'preview';
	} = $props();

	let imageFiles = $state<FileList | null | undefined>(null);
	let uploadingImage = $state(false);
</script>

{#if mode === 'preview'}
	{#await getImageUrl(option.imageUUID)}
		<Spinner class="h-16 w-16" color="purple" />
	{:then url}
		<Img src={url} alt={option.altText} class="h-32 w-32 rounded-lg object-cover" />
	{:catch error}
		<p class="text-danger-500">Error loading image</p>
	{/await}
{:else}
	{#if option.imageUUID}
		{#await getImageUrl(option.imageUUID)}
			<Spinner class="h-16 w-16" color="purple" />
		{:then url}
			<Img src={url} alt={option.altText} class="h-32 w-32 rounded-lg object-cover" />
		{:catch error}
			<p class="text-danger-500">Error loading image</p>
		{/await}
	{/if}
	<Fileupload
		placeholder="Upload Image"
		type="file"
		id="optionImage"
		name="optionImage"
		accept="image/png, image/jpeg"
		bind:files={imageFiles}
		onchange={() => {
			if (imageFiles && imageFiles[0]) {
				const file = imageFiles[0];
				uploadingImage = true;
				uploadImage(imageFiles[0])
					.then((uuid) => {
						uploadingImage = false;
						option = {
							...option,
							imageUUID: uuid,
							altText: file.name || 'Option Image'
						};
						imageFiles = null;
					})
					.catch((e) => {
						console.error('Error uploading image:', e);
						uploadingImage = false;
					});
			}
		}}
	/>
	{#if uploadingImage}
		<Spinner />
	{/if}
{/if}
