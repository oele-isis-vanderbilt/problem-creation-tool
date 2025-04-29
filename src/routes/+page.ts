import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const { dataService } = await import('$lib/services');
	const env = await dataService.getEnvironment();
	return {
		env
	};
};
