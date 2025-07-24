<script lang="ts">
	import { afterUpdate } from 'svelte';

	export let assessment: any;
	export let currentProblem: any;

	let userPrompt = '';
	let isLoading = false;
	let chatHistory: { type: 'user' | 'assistant'; message: string }[] = [];
	let problemsDatabase = assessment.problems || [];

	const chatMemory: Record<string, typeof chatHistory> = {};
	let chatBottom: HTMLDivElement;

	function findProblemById(problemId: string) {
		return problemsDatabase.find((p) => p.id === problemId) || null;
	}

	function extractText(doc: any): string {
		if (!doc || !doc.content) return '';
		return doc.content
			.map((node: any) =>
				node.content?.map((child: any) => child.text).join(' ') || ''
			)
			.join('\n');
	}

	function normalizeDescription(raw: any): string {
		try {
			const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
			return extractText(parsed);
		} catch (err) {
			console.warn('Invalid description JSON:', raw);
			return '[Invalid problem description]';
		}
	}

	$: if (currentProblem?.id) {
		const pid = currentProblem.id;
		chatHistory = chatMemory[pid] ? [...chatMemory[pid]] : [];
	}

	afterUpdate(() => {
		if (chatBottom) chatBottom.scrollIntoView({ behavior: 'smooth' });
	});

	async function askBot() {
		if (!userPrompt.trim()) return;

		const pid = currentProblem?.id;
		const userMessage = { type: 'user', message: userPrompt };
		const thinkingMessage = { type: 'assistant', message: '🤖 Thinking...' };

		chatHistory = [...chatHistory, userMessage];
		if (pid) chatMemory[pid] = [...chatHistory];
		chatHistory = [...chatHistory, thinkingMessage];

		isLoading = true;

		const problemData = findProblemById(pid);
		const problemText = normalizeDescription(problemData?.description);

		const payload = {
			prompt: {
				userQuestion: userPrompt,
				problemContext: {
					problemId: pid,
					problemText,
					problemType: problemData?.kind || '',
					difficulty: problemData?.difficulty || '',
					currentAnswer: '',
					misconceptions: problemData?.misconceptions || [],
					hints: problemData?.hints || []
				},
				chatHistory: chatHistory.filter((m) => m.message !== '🤖 Thinking...').slice(-6)
			}
		};

		try {
			const res = await fetch('http://localhost:8000/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			const data = await res.json();
			const raw = data.response || '⚠️ The tutor didn’t respond. Please try again.';
			const reply = raw.length > 180 ? raw.slice(0, 175).trim() + '...' : raw;

			chatHistory = chatHistory.filter((msg) => msg.message !== '🤖 Thinking...');
			chatHistory = [...chatHistory, { type: 'assistant', message: reply }];
			if (pid) chatMemory[pid] = [...chatHistory];
		} catch (err) {
			console.error('Chatbot error:', err);
			chatHistory = chatHistory.filter((msg) => msg.message !== '🤖 Thinking...');
			chatHistory = [
				...chatHistory,
				{ type: 'assistant', message: '⚠️ Server error. Try again later.' }
			];
			if (pid) chatMemory[pid] = [...chatHistory];
		} finally {
			userPrompt = '';
			isLoading = false;
		}
	}
</script>

<style>
	.bubble {
		display: inline-block;
		padding: 0.6rem 1rem;
		border-radius: 20px;
		max-width: 80%;
		word-wrap: break-word;
	}
	.user {
		align-self: flex-end;
		background-color: #e0edff;
		color: #333;
	}
	.assistant {
		align-self: flex-start;
		background-color: #dcfce7;
		color: #1a1a1a;
	}
</style>

<div class="p-4 bg-white rounded-lg shadow w-full">
	<h2 class="text-lg font-bold mb-2">💬 AI Chatbot</h2>

	<div class="mb-4">
		<p class="text-sm text-gray-700 mb-1">Current Problem:</p>
		<div class="p-3 bg-gray-100 rounded shadow text-sm whitespace-pre-line">
			{normalizeDescription(currentProblem?.description) || 'No problem loaded'}
		</div>
	</div>

	<div class="flex flex-col space-y-2 mb-4 max-h-64 overflow-y-auto px-2">
		{#each chatHistory as msg}
			<div class="flex" class:justify-end={msg.type === 'user'} class:justify-start={msg.type === 'assistant'}>
				<div class="bubble {msg.type}">
					{msg.message}
				</div>
			</div>
		{/each}
		<div bind:this={chatBottom}></div>
	</div>

	<div class="flex gap-2">
		<input
			type="text"
			class="flex-1 p-2 border border-gray-300 rounded"
			placeholder="Ask a question..."
			bind:value={userPrompt}
			on:keydown={(e) => e.key === 'Enter' && askBot()}
			disabled={isLoading}
		/>
		<button
			class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
			on:click={askBot}
			disabled={isLoading}
		>
			{isLoading ? '...' : 'Ask'}
		</button>
	</div>
</div>
