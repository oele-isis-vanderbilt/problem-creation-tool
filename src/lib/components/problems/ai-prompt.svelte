<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import IcBaselineChatBubbleOutline from 'virtual:icons/ic/baseline-chat-bubble-outline';

	let { aiPrompt = $bindable() }: { aiPrompt: string } = $props();
</script>

<Button
	class="cdark:text-white flex flex-col bg-gray-400 p-2 text-center text-lg text-gray-100 dark:bg-gray-700"
	onclick={() => alert('AI Prompt clicked but not implemented yet!')}
>
	<IcBaselineChatBubbleOutline />
	<span class="text-sm">AI Prompt</span>
</Button>
