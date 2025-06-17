import { omit, pick } from 'underscore';
import type { KLProblem, KLProblemRunState, Problem, ProblemMetadata } from './models';
import Agent from '@knowlearning/agents/browser.js';

const NAMED_PROBLEM_STATE = 'oecd.match-rct.problems';
const OLD_NAMED_STATE = 'mathProblems';
const RUN_STATE_PREFIX = 'oecd.math-rct.problems.run-state';

type WatchCallBackType = (update: { state: Record<string, Problem> }) => void;

export type ProblemStore = {
	getFn: () => Record<string, Problem>;
	getProblemMetadata: (id: string) => Promise<ProblemMetadata>;
	getProblem: (id: string) => Problem;
	addEmptyProblem: (problem: Problem) => Promise<void>;
	updateProblem: (problem: Problem) => Promise<void>;
	deleteProblem: (id: string) => void;
	getProblems: () => Problem[];
	watch: (cb: WatchCallBackType) => void;
	getProblemRunState: (id: string) => Promise<KLProblemRunState>;
};

export let store: ProblemStore | null = null;

export async function initProblemStore() {
	store = await initializeProblemStore(NAMED_PROBLEM_STATE);
	return store;
}

export async function migrateProblems() {
	const _problemsState = (await Agent.state(OLD_NAMED_STATE)) as {
		problems: Record<string, Problem>;
	};

	const newProblemsState = (await Agent.state(NAMED_PROBLEM_STATE)) as Record<
		string,
		ProblemMetadata
	>;

	const problemMetadataArray = await Promise.all(
		Object.entries(_problemsState.problems || {}).map(async ([id, problem]) => {
			const metadata: ProblemMetadata = {
				id,
				createdAt: problem.createdAt || new Date().toISOString(),
				updatedAt: problem.updatedAt || new Date().toISOString(),
				createdBy: problem.createdBy || 'unknown'
			};
			const problemState = await Agent.state(metadata.id);
			const klProblem: KLProblem = omit(problem, Object.keys(metadata)) as KLProblem;

			await Agent.state(metadata.id);
			Object.assign(problemState, JSON.parse(JSON.stringify(klProblem)));
			return metadata;
		})
	);

	problemMetadataArray.forEach((metadata) => (newProblemsState[metadata.id] = metadata));
}

async function composeProblemsState(_problemsState: Record<string, ProblemMetadata>) {
	const idProblemPairs = await Promise.all(
		Object.entries(_problemsState).map(async ([id, metadata]) => {
			const problemState = (await Agent.state(id)) as KLProblem;
			const problem: Problem = {
				...metadata,
				...problemState
			};
			return [id, problem];
		})
	);

	return Object.fromEntries(idProblemPairs);
}

async function initializeProblemStore(namedState: string) {
	const _problemsState = (await Agent.state(namedState)) as Record<string, ProblemMetadata>;
	const problemsState = await composeProblemsState(_problemsState);
	let readableState: Record<string, Problem> = $state(problemsState);
	let watchers: WatchCallBackType[] = [];

	Agent.watch(namedState, ({ state }) => {
		const newState = state as Record<string, ProblemMetadata>;
		const newProblemsPromise = composeProblemsState(newState);
		newProblemsPromise.then((problems) => {
			readableState = problems;
		});
	});

	return {
		getFn: () => readableState,
		getProblemMetadata: async (id: string) => {
			const metadata = _problemsState[id];
			if (!metadata) {
				throw new Error('Problem not found');
			}
			return metadata;
		},
		getProblem: (id: string) => readableState[id],
		addEmptyProblem: async (problem: Problem) => {
			const metadata: ProblemMetadata = pick(problem, [
				'id',
				'createdAt',
				'updatedAt',
				'createdBy'
			]);
			const newProblem: Problem = omit(problem, Object.keys(metadata)) as Problem;
			const newProblemState = await Agent.state(metadata.id);
			Object.assign(newProblemState, JSON.parse(JSON.stringify(newProblem)));
			readableState[metadata.id] = problem;
			_problemsState[metadata.id] = metadata;
		},
		updateProblem: async (problem: Problem) => {
			const metadata = _problemsState[problem.id];
			if (!metadata) {
				console.error(`Problem with id ${problem.id} not found`);
				return;
			}
			const newProblem: KLProblem = omit(problem, Object.keys(metadata)) as KLProblem;
			const newProblemState = (await Agent.state(metadata.id)) as KLProblem;
			Object.assign(newProblemState, JSON.parse(JSON.stringify(newProblem)));
			metadata.updatedAt = new Date().toISOString();
			readableState[metadata.id] = Object.assign({}, metadata, newProblemState);
			Object.assign(_problemsState[metadata.id], JSON.parse(JSON.stringify(metadata)));
		},
		deleteProblem: (id: string) => {
			if (!_problemsState[id]) {
				console.error(`Problem with id ${id} not found`);
				return;
			}
			delete _problemsState[id];
			// Also delete the state associated with the problem
		},
		getProblems: () => Object.values(readableState),
		watch: (cb: WatchCallBackType) => watchers.push(cb),
		getProblemRunState: async (id: string): Promise<KLProblemRunState> => {
			const runState = await Agent.state(`${RUN_STATE_PREFIX}-${id}`);
			return runState as KLProblemRunState;
		}
	};
}
