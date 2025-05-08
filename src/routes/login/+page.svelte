<script lang="ts">
	import GoogleIcon from 'virtual:icons/logos/google-icon';
	import MicrosoftIcon from 'virtual:icons/logos/microsoft-icon';
	import { onMount } from 'svelte';
	import { isAnonUser } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { getContext } from 'svelte';
	import { login } from '$lib/services/knowLearningStore.svelte';

	async function handleLogin(provider: 'google' | 'microsoft') {
		login(provider);
	}

	onMount(async () => {
		const env = getContext('appEnv');
		if (!isAnonUser(env.auth)) {
			goto('/');
		}
	});
</script>

<div
	class="mt-24 flex w-full flex-col items-center justify-center gap-6 text-slate-500 dark:text-white"
>
	<div>Welcome to Betty's Brain Mathematics! Please login to continue.</div>
	<div class="flex w-full flex-col gap-4 md:w-1/2 md:flex-row">
		<button
			type="button"
			class="flex w-full flex-row justify-center gap-2 rounded-lg border-2 border-gray-200 px-10 py-2 text-xl"
			onclick={() => handleLogin('google')}
		>
			<GoogleIcon class="text-2xl" />
			<span>Login with Google</span>
		</button>
		<button
			type="button"
			class="flex w-full flex-row justify-center gap-2 rounded-lg border-2 border-gray-200 px-10 py-2 text-xl"
		>
			<MicrosoftIcon class="text-2xl" onclick={() => handleLogin('microsoft')} />
			<span>Login with Microsoft</span>
		</button>
	</div>
</div>
