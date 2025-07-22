<script lang="ts">
	import 'mathlive';
	import 'katex/dist/katex.min.css';
	import type { MathfieldElement, MathfieldElementAttributes, Selection } from 'mathlive';
	import { on } from 'svelte/events';

	type Props = {
		value?: string;
		mfElement?: MathfieldElement | null;
	} & Partial<MathfieldElementAttributes>;

	let { value = $bindable(), mfElement = $bindable(), ...rest }: Props = $props();

	const init = (node: MathfieldElement) => {
		$effect(() => {
			if (value) node.value = value;
		});
		$effect(() => {
			return on(node, 'input', () => {
				value = node.value;
			});
		});
	};
</script>

<math-field bind:this={mfElement} use:init {...rest}></math-field>
