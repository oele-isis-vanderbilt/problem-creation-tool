<script lang="ts">
	import type { ProblemKind } from '$lib/services/models';
	import HeroIconsTrash from 'virtual:icons/heroicons-solid/trash';

	let {
		title,
		lastUpdated,
		kind,
		noTitlePlaceHolder = 'Click to add title...',
		hasErrors = false,
		onProblemDeleted
	}: {
		title: string;
		lastUpdated: string;
		hasErrors?: boolean;
		noTitlePlaceHolder?: string;
		kind: ProblemKind;
		onProblemDeleted: () => void;
	} = $props();
</script>

<div class="flex h-full w-full items-center justify-between">
	<h2 class="flex-1 text-lg">
		{title || noTitlePlaceHolder}
	</h2>
	<div class="flex items-center justify-between">
		<span class="text-sm text-gray-500 dark:text-gray-400">
			<span class="text-red-800 dark:text-red-500">{hasErrors ? '(Needs Review)' : ''} </span>
			{kind} | Last Updated: {lastUpdated}
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
