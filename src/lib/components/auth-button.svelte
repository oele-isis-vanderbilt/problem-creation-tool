<script lang="ts">
	import type { AgentAuth } from '@knowlearning/agents/browser';
	import Login from 'virtual:icons/heroicons-solid/login';
	import Logout from 'virtual:icons/heroicons-solid/logout';
	import { isAnonUser } from '$lib/utils';

	type VoidFunction = () => void;

	let {
		user,
		onLogin,
		onLogout
	}: { user: AgentAuth; onLogin: VoidFunction; onLogout: VoidFunction } = $props();

	const isLoggedIn = () => {
		return !isAnonUser(user);
	};

	function handleAuth() {
		if (isLoggedIn()) {
			onLogout();
		} else {
			onLogin();
		}
	}
</script>

<button
	onclick={handleAuth}
	class="has-tooltip rounded-lg border-2 border-gray-200 p-2 text-black dark:border-gray-400 dark:text-white"
>
	{#if isLoggedIn()}
		<Login />
		<span class="tooltip mt-[30px] -ml-10 bg-gray-200 p-2 dark:bg-gray-800"
			>Logout {user.info.name}</span
		>
	{:else}
		<Logout />
		<span class="tooltip mt-[30px] -ml-10 bg-gray-200 p-2 dark:bg-gray-800">LogIn</span>
	{/if}
</button>
