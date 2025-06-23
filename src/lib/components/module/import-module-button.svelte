<script lang="ts">
	import { Button, Input } from 'flowbite-svelte';
	import { FileImportSolid } from 'flowbite-svelte-icons';
	import Modal from '$lib/components/modal.svelte';
	import Error from '../composables/Error.svelte';

	let isModalOpen = $state(false);
	let newModuleName = $state('');
	let newModuleUuid = $state('');
	let importing = $state(false);

	let { onImportModule }: { onImportModule: (uuid: string, name: string) => Promise<void> } =
		$props();

	let errors = $derived.by(() => {
		const errors: string[] = [];
		if (!newModuleName) {
			errors.push('Module Name is required');
		}
		if (!newModuleUuid) {
			errors.push('Module UUID is required');
		}
		return errors;
	});

	function closeModal() {
		isModalOpen = false;
		newModuleName = '';
		newModuleUuid = '';
	}

	async function handleImport() {
		if (errors.length > 0) {
			return;
		}
		// Here you would typically call a service to import the module
		// For example: importModule(newModuleUuid, newModuleName);
		importing = true;
		try {
			await onImportModule(newModuleUuid, newModuleName);
		} catch (error) {
			console.error('Error importing module:', error);
			alert('Failed to import module. Please try again later.\n' + JSON.stringify(error));
		} finally {
			importing = false;
			closeModal();
		}
	}
</script>

<Button class="gap-2" onclick={() => (isModalOpen = true)}>
	<FileImportSolid class="h-5 w-5" />
	Import Module
</Button>

<Modal open={isModalOpen} title="Import Module" onClose={closeModal}>
	{#snippet main()}
		<form id="importModuleForm">
			<div class="flex w-full flex-col gap-4">
				<Input
					class="w-full"
					type="text"
					placeholder="Enter Module UUID"
					bind:value={newModuleUuid}
					required
				/>
				<Input
					class="w-full"
					type="text"
					placeholder="Enter new Module Name"
					bind:value={newModuleName}
					required
				/>
				<Error {errors} />
			</div>
		</form>
	{/snippet}
	{#snippet footer()}
		<div class="flex w-full flex-row justify-end gap-2">
			<Button
				disabled={errors.length > 0 || importing}
				form="importModuleForm"
				onclick={handleImport}
			>
				Import Module
			</Button>

			<Button onclick={() => (isModalOpen = false)}>Close</Button>
		</div>
	{/snippet}
</Modal>
