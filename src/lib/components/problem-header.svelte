<script lang="ts">
	const {
		title,
		noTitlePlaceHolder = 'Click to add title...',
		onProblemDeleted
	}: {
		title: string;
		noTitlePlaceHolder?: string;
		onProblemDeleted: () => void;
	} = $props();

	import HeroIconsTrash from 'virtual:icons/heroicons-solid/trash';
</script>

<div class="flex h-full w-full items-center justify-between">
	<h2 class="text-lg">
		{title || noTitlePlaceHolder}
	</h2>
	<HeroIconsTrash class="m-2 hover:text-red-500" onclick={onProblemDeleted}></HeroIconsTrash>
</div>
