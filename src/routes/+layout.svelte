<script lang="ts">
	import '../app.css';
	import { onMount, setContext } from 'svelte';
	import { goto } from '$app/navigation';

	import { ModeWatcher } from 'mode-watcher';
	import { isAnonUser } from '$lib/utils';
	import AuthButton from '$lib/components/auth-button.svelte';

	import type { LayoutProps } from './$types';
	import DarkModeToggle from '$lib/components/dark-mode-toggle.svelte';
	import { logout } from '$lib/services/knowLearningStore.svelte';
	import type { AgentEnvironment } from '@knowlearning/agents/browser';
	import { prependBaseUrl } from '$lib/utils';
	import { A } from 'flowbite-svelte';
	import { page } from '$app/state';

	let { data, children }: LayoutProps = $props();
	let env = $state<AgentEnvironment | null>(data.env);
	setContext('appEnv', env);

	onMount(async () => {
		if (isAnonUser(env.auth)) {
			goto(prependBaseUrl('/login'));
		}
	});

	const isActive = (url: string) => {
		const currentPath = page.url.pathname;
		console.log('Current Path:', currentPath, currentPath.startsWith(url + '/'), url);
		return currentPath === url || currentPath.startsWith(url + '/');
	};

	async function handleLogout() {
		await logout();
	}
</script>

<ModeWatcher defaultMode={'dark'} />
<header
	class="bg-primary-100 dark:bg-secondary-800 sticky top-0 z-40 mx-auto flex w-full flex-row justify-between border-b border-gray-200 px-2 py-4"
>
	<div class="container mx-auto flex w-full justify-between">
		<div class="flex items-center">
			<A class="dark:text-secondary-200 text-lg font-bold" href={prependBaseUrl('/')}
				>Betty's Brain Mathematics</A
			>
		</div>
		<div class="flex items-center justify-center gap-4 text-center">
			<A
				href="/"
				class={[
					'dark:text-primary-600 font-bold',
					isActive('/') && 'text-primary-800 dark:text-secondary-100 font-bold',
					isActive('/modules') && 'text-primary-800 dark:text-secondary-100 font-bold'
				]}
			>
				Modules
			</A>
			<A
				href="/concepts"
				class={[
					'dark:text-primary-600 font-bold',
					isActive('/concepts') && 'text-primary-800 dark:text-secondary-100 text-lg font-bold'
				]}
			>
				Concepts and Misconceptions
			</A>
		</div>
		<div class="flex items-center justify-end gap-2">
			{#if env}
				<AuthButton
					user={env.auth}
					onLogin={() => goto(prependBaseUrl('/login'))}
					onLogout={() => handleLogout()}
				/>
			{/if}
			<DarkModeToggle />
		</div>
	</div>
</header>

<main
	class="mb-20 h-full min-w-0 flex-auto divide-y overflow-auto p-2 lg:static lg:max-h-full lg:overflow-visible dark:divide-gray-700"
>
	{@render children()}
</main>
<footer class="footer bg-primary-100 dark:bg-secondary-800 fixed bottom-0 w-full p-4 text-center">
	<div class="container mx-auto">
		<span class="text-primary-500 dark:text-secondary-400 text-sm">
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
