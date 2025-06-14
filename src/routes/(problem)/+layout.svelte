<script lang="ts">
	import '../../app.css';
	import { onMount, setContext } from 'svelte';
	import { goto } from '$app/navigation';

	import { ModeWatcher } from 'mode-watcher';

	import { logout } from '$lib/services/modules-store.svelte';

	let { data, children } = $props();

</script>


<div
	class="w-full h-full mx-auto"
>
	{@render children()}
</div>