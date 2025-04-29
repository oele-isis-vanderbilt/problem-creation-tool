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

	let { data, children }: LayoutProps = $props();

	let env = data.env;

	onMount(() => {
		if (isAnonUser(data.env.auth)) {
			console.log('Redirecting anonymous user...');
			goto('/login');
		}

		setContext('appEnv', data.env);
	});

	async function handleLogout() {
		await dataService.logout();
	}
</script>

<ModeWatcher defaultMode={'dark'} />
<header
	class="sticky top-0 z-40 mx-auto flex w-full flex-row justify-between border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-900"
>
	<div class="flex h-16 items-center px-4 lg:px-8">
		<button href="/" class="text-xl font-bold text-gray-900 dark:text-white">
			Betty's Brain Mathematics
		</button>
	</div>
	<div class="flex h-16 items-center justify-end gap-2 px-4 lg:px-8">
		<AuthButton user={env.auth} onLogin={() => goto('/login')} onLogout={() => handleLogout()} />
		<DarkModeToggle />
	</div>
</header>

<main
	class="h-full min-w-0 flex-auto divide-y overflow-auto lg:static lg:max-h-full lg:overflow-visible dark:divide-gray-700 dark:bg-gray-900"
>
	{@render children()}
</main>
