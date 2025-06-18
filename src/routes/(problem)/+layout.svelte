<script lang="ts">
	import type { LayoutProps } from './$types';
	import '../../app.css';
	let { children }: LayoutProps = $props();
</script>

<div class="mx-auto h-screen w-screen">
	{@render children()}
</div>
