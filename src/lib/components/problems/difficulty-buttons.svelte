<script lang="ts">
	import { Button, ButtonGroup } from 'flowbite-svelte';
	import { ProblemDifficulty } from '$lib/services/models';

	let { difficulty = $bindable() }: { difficulty: ProblemDifficulty } = $props();

	const colors = {
		[ProblemDifficulty.EASY]: 'green',
		[ProblemDifficulty.MEDIUM]: 'blue',
		[ProblemDifficulty.HARD]: 'red'
	};

	const activeColor = $derived.by(() => {
		return colors[difficulty];
	});
</script>

<ButtonGroup>
	{#each Object.values(ProblemDifficulty) as value}
		<Button
			onclick={() => {
				difficulty = value;
			}}
			pill
			class={[
				difficulty === value
					? `bg-${activeColor}-500 dark:bg-${activeColor}-500 hover:bg-${activeColor}-700 dark:hover:bg-${activeColor}-700`
					: ''
			]}
		>
			{value}
		</Button>
	{/each}
</ButtonGroup>
