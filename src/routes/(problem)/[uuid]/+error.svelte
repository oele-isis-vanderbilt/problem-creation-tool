<script lang="ts">
	import { page } from '$app/state';
	import { prependBaseUrl } from '$lib/utils';
</script>

<div class="container mx-auto flex h-full w-full flex-col">
	{#if page.status === 404}
		<div class="mt-10 flex h-full flex-col items-center justify-center gap-2">
			<h2 class="text-2xl font-bold">
				Oops! The problem/assessment you are looking for does not exist.
			</h2>
			<h3 class="text-lg">
				{page.error.message}. Please check the URL or return to the
				<a href={prependBaseUrl('/')} class="underline">homepage</a>.
			</h3>
		</div>
	{:else if page.status === 400}
		<div class="mt-10 flex h-full flex-col items-center justify-center gap-2">
			<h2 class="text-2xl font-bold">Oops! The problem you are looking is not valid.</h2>
			{#each page.error.errors as error}
				<p class="text-red-500">{error}</p>
			{/each}
			<h3 class="text-lg">
				Please check the URL or return to the
				<a href={prependBaseUrl('/')} class="underline">homepage</a>.
			</h3>
		</div>
	{:else}
		<div class="mt-10 flex h-full flex-col items-center justify-center gap-2">
			<h2 class="text-2xl font-bold">Oops! Something went wrong.</h2>
			<h3 class="text-lg">
				{page.error.message}. Please check the URL or return to the
				<a href={prependBaseUrl('/')} class="underline">homepage</a>.
			</h3>
		</div>
	{/if}
</div>
