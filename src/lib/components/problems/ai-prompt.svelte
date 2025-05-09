<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import IcBaselineChatBubbleOutline from 'virtual:icons/ic/baseline-chat-bubble-outline';

	let { aiPrompt = $bindable() }: { aiPrompt: string } = $props();
</script>

<Button
	class="flex flex-col p-2 text-center text-lg"
	onclick={() => alert('AI Prompt clicked but not implemented yet!')}
>
	<IcBaselineChatBubbleOutline />
	<span class="text-sm">AI Prompt</span>
</Button>
