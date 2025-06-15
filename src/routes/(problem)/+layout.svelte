<script lang="ts">
	import type { LayoutProps } from './$types';
	import '../../app.css';
	let { children }: LayoutProps = $props();
</script>

<div class="mx-auto h-full w-full">
	{@render children()}
</div>
