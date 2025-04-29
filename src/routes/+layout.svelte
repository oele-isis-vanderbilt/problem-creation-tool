<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { ModeWatcher } from 'mode-watcher';
	import { isAnonUser } from '$lib/utils';
	import AuthButton from '$lib/components/auth-button.svelte';
	import { setContext } from 'svelte';

	import type { LayoutProps } from './$types';
	import DarkModeToggle from '$lib/components/dark-mode-toggle.svelte';
	import { dataService } from '$lib/services';
	import type { AgentEnvironment } from '@knowlearning/agents/browser';

	let { data, children }: LayoutProps = $props();

	let env = data.env;
	setContext<AgentEnvironment>('appEnv', data.env);

	onMount(() => {
		if (isAnonUser(data.env.auth)) {
			console.log('Redirecting anonymous user...');
			goto('/login');
		}
	});

	async function handleLogout() {
		await dataService.logout();
	}
</script>

<ModeWatcher defaultMode={'dark'} />
<header
	class="sticky top-0 z-40 mx-auto flex w-full flex-row justify-between border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-900"
>
	<div class="container mx-auto flex w-full justify-between">
		<div class="flex h-16 items-center">
			<button onclick={() => goto('/')} class="text-xl font-bold text-gray-900 dark:text-white">
				Betty's Brain Mathematics
			</button>
		</div>
		<div class="flex h-16 items-center justify-end gap-2">
			<AuthButton user={env.auth} onLogin={() => goto('/login')} onLogout={() => handleLogout()} />
			<DarkModeToggle />
		</div>
	</div>
</header>

<main
	class="mb-20 h-full min-w-0 flex-auto divide-y overflow-auto lg:static lg:max-h-full lg:overflow-visible dark:divide-gray-700 dark:bg-gray-900"
>
	{@render children()}
</main>
<footer class="footer fixed bottom-0 w-full p-4 text-center text-white dark:bg-gray-800">
	<div class="container mx-auto">
		<span class="text-sm text-gray-500 dark:text-gray-400">
			&copy; 2025 <a
				href="https://teachableagents.org"
				target="_blank"
				class="underline hover:shadow"
			>
				Open Ended Learning Environments
			</a>, Vanderbilt University. All rights reserved.
		</span>
	</div>
</footer>
