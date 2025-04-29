import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const { dataService } = await import('$lib/services');
	const state = await dataService.modulesState();
	console.log(state);
	if (!state?.modules) {
		state.modules = [];
	}

	const modulesState = {
		modulesState: state
	};

	return modulesState;
};
