<script lang="ts">
	const {
		title,
		lastUpdated,
		noTitlePlaceHolder = 'Click to add title...',
		onProblemDeleted
	}: {
		title: string;
		lastUpdated: string;
		noTitlePlaceHolder?: string;
		onProblemDeleted: () => void;
	} = $props();

	import HeroIconsTrash from 'virtual:icons/heroicons-solid/trash';
</script>

<div class="flex h-full w-full items-center justify-between">
	<h2 class="flex-1 text-lg">
		{title || noTitlePlaceHolder}
	</h2>
	<div class="flex items-center justify-between">
		<span class="text-sm text-gray-500 dark:text-gray-400">
			Last Updated: {lastUpdated}
		</span>
		<HeroIconsTrash
			class="m-2 hover:text-red-500"
			onclick={(event: Event) => {
				event.stopPropagation();
				onProblemDeleted();
			}}
		></HeroIconsTrash>
	</div>
</div>
