<script lang="ts">
	import type { DigitTileProblem } from '$lib/services/models';
	import { Button, Input } from 'flowbite-svelte';

	let { problem = $bindable() }: { problem: DigitTileProblem } = $props();
</script>

<div class="mb-4 flex flex-row items-center justify-between">
	<h2 class="text-2xl font-bold">Tiles</h2>
	<Button
		onclick={() => {
			problem.tiles = [...problem.tiles, 0];
			problem.tiles = problem.tiles;
		}}>Add Tiles</Button
	>
</div>
<div class="align-center mb-4 flex flex-row items-start justify-start gap-4">
	{#each problem.tiles as tile, index}
		<div>
			<Input
				type="number"
				placeholder="Enter value"
				bind:value={problem.tiles[index]}
				class="mb-2 w-32"
			/>
		</div>
		<div>
			<Button
				color="red"
				onclick={() => {
					problem.tiles.splice(index, 1);
					problem.tiles = problem.tiles;
				}}>Remove</Button
			>
		</div>
	{/each}
</div>
