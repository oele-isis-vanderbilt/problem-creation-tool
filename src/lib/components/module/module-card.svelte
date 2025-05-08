<script lang="ts">
	import type { StateModule } from '$lib/services/models';
	import { Circle2 } from 'svelte-loading-spinners';
	import HeroIconsTrash from 'virtual:icons/heroicons-solid/trash';

	let {
		module,
		onModuleDelete,
		coverImageUrl
	}: {
		module: StateModule;
		onModuleDelete: (uuid: string) => void;
		coverImageUrl: Promise<string>;
	} = $props();
</script>

<div
	class="max-w-sm rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
>
	<!-- <img class="rounded-t-lg" src="{getModuleImageUrl()}" alt="" /> -->
	<div
		class="flex items-center justify-center rounded-lg border-1 border-gray-200 dark:border-gray-500"
	>
		{#await coverImageUrl}
			<Circle2 size="50" />
		{:then imageUrl}
			<img class="h-48 rounded-t-lg object-cover" src={imageUrl} alt="" />
		{:catch error}
			<Circle2 size="50" />
		{/await}
	</div>

	<div class="p-5">
		<a href="/modules/{module?.id}">
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				{module.name}
			</h5>
		</a>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{module.description}</p>
		<a
			href="/modules/{module?.id}"
			class="inline-flex items-center rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
		>
			Open
			<svg
				class="ms-2 h-3.5 w-3.5 rtl:rotate-180"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 14 10"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M1 5h12m0 0L9 1m4 4L9 9"
				/>
			</svg>
		</a>
		<button
			onclick={() => onModuleDelete(module.id)}
			class="inline-flex items-center justify-center gap-1 rounded-lg bg-red-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 focus:outline-none dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
		>
			Delete
			<HeroIconsTrash />
		</button>
	</div>
</div>
