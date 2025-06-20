import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import Agent from '@knowlearning/agents/browser';

const RUN_STATE_PREFIX = 'oecd.math-rct.problems.run-state';

function isEmbedded() {
	try {
		return window.self !== window.top;
	} catch (e) {
		return true;
	}
}

export const load: PageLoad = async ({ params }) => {
	const { validateProblem } = await import('$lib/components/problems/problem-components/utils');
	const uuid = params.uuid;

	const problem = await Agent.state(uuid);
	if (!problem && isEmbedded()) {
		error(404, `Problem with id ${uuid} not found`);
	}

	let runState = await Agent.state(`${RUN_STATE_PREFIX}-${uuid}`);
	return {
		problem,
		runState,
		assessment: null
	};
};
