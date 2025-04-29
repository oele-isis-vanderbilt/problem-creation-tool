export const ssr = false;

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	const { dataService } = await import('$lib/services');
	const env = await dataService.getEnvironment();
	return {
		env
	};
};
