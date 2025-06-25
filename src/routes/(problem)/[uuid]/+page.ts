import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import Agent from '@knowlearning/agents/browser';
import { isEmpty, omit } from 'underscore';
import type { ExportedAssessment, KLProblem, Problem, StateAssessment } from '$lib/services/models';

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

	const problemOrAssessment = await Agent.state(uuid);
	if (!problemOrAssessment || isEmpty(problemOrAssessment)) {
		error(404, `Problem with id ${uuid} not found`);
	} else if (problemOrAssessment.kind === 'Assessment') {
		const assessment = problemOrAssessment as ExportedAssessment;

		const stateAssessment: StateAssessment = {
			id: uuid,
			...omit(assessment, 'kind', 'problemIds'),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			createdBy: 'system',
			moduleId: 'default',
			problems: (await Promise.all(
				assessment.problemIds.map(async (problemId) => {
					const problem = (await Agent.state(problemId)) as KLProblem;
					return {
						...problem,
						id: problemId,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						createdBy: 'system'
					} as Problem;
				})
			)) as Problem[]
		};
		return {
			problem: null,
			runState: null,
			assessment: stateAssessment
		};
	}

	let runState = await Agent.state(`${RUN_STATE_PREFIX}-${uuid}`);
	return {
		problem: problemOrAssessment,
		runState,
		assessment: null
	};
};
