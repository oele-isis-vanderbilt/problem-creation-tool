<script>
	// https://www.thespatula.io/svelte/mathjax_svelte/
	import { onDestroy, onMount } from 'svelte';

	let { math, textSize = 'text-2xl' } = $props();

	onMount(() => {
		let script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
		document.head.append(script);

		script.onload = () => {
			MathJax = {
				tex: {
					inlineMath: [
						['$', '$'],
						['\\(', '\\)']
					]
				}
			};
		};
	});

	onDestroy(() => {
		let script = document.querySelector(
			'script[src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"]'
		);
		if (script) {
			script.remove();
		}
	});
</script>

<p class={textSize}>
	{math}
</p>
