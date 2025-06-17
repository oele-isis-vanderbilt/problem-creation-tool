<script lang="ts">
	import type { StateAssessment } from '$lib/services/models';
	import { Circle2 } from 'svelte-loading-spinners';
	import HeroIconsTrash from 'virtual:icons/heroicons-solid/trash';
	import { prependBaseUrl } from '$lib/utils';
	import { Button } from 'flowbite-svelte';

	let {
		assessment,
		onAssessmentDelete,
		coverImageUrl
	}: {
		assessment: StateAssessment;
		onAssessmentDelete: (uuid: string) => void;
		coverImageUrl: Promise<string>;
	} = $props();
</script>

<div
	class="border-primary-200 bg-primary-100 dark:border-primary-700 dark:bg-primary-800 max-w-sm rounded-lg border shadow-sm"
>
	<!-- <img class="rounded-t-lg" src="{getModuleImageUrl()}" alt="" /> -->
	<div
		class="border-primary-200 dark:border-primary-500 flex items-center justify-center rounded-lg border-1"
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
		<a href={prependBaseUrl(`/assessments/${assessment?.id}`)}>
			<h5 class="mb-2 text-2xl font-bold tracking-tight">
				{assessment.title}
			</h5>
		</a>
		<p class="mb-3 font-normal">{assessment.description}</p>
		<Button href={prependBaseUrl(`/assessments/${assessment?.id}`)}>
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
		</Button>
		<Button
			onclick={() => onAssessmentDelete(assessment.id)}
			class="bg-danger-700 hover:bg-danger-800 focus:ring-danger-300 dark:bg-danger-600 dark:hover:bg-danger-700 dark:focus:ring-danger-800 inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-center text-sm font-medium text-white focus:ring-4 focus:outline-none"
		>
			Delete
			<HeroIconsTrash />
		</Button>
	</div>
</div>
