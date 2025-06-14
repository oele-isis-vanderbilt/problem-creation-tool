<script module lang="ts">
	export interface IndicatorProps {
		type: 'correct' | 'error' | 'skipped' | 'notAttempted';
	}
</script>

<script lang="ts">
	let props: IndicatorProps = $props();
</script>
