<script lang="ts">
	import PencilIcon from 'virtual:icons/heroicons-solid/pencil';
	import InformationCircleIcon from 'virtual:icons/heroicons-solid/information-circle';

	let {
		name = $bindable(),
		onEdit,
		onInfo
	}: {
		name: string;
		onEdit: () => void;
		onInfo: () => void;
	} = $props();
</script>

<div class="flex h-full w-full items-center justify-between">
	<h2 class="flex-1 text-lg">
		{name}
	</h2>
	<InformationCircleIcon
		role="button"
		class="m-2 text-lg hover:text-red-500"
		onclick={(event: Event) => {
			onInfo();
		}}
	></InformationCircleIcon>
	<PencilIcon
		role="button"
		class="m-2 text-lg hover:text-red-500"
		onclick={(event: Event) => {
			onEdit();
		}}
	></PencilIcon>
</div>
