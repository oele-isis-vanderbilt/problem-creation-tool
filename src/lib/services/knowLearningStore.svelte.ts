import Agent from '@knowlearning/agents/browser.js';
import {
	ProblemDifficulty,
	ProblemKind,
	type Module,
	type MultipleChoiceProblem,
	type Problem,
	type StateModule,
	type WordProblem
} from './models';

export let store: {
	getFn: () => Record<string, StateModule>;
	addEmptyModule: (module: StateModule) => Promise<void>;
	getModule: (id: string) => StateModule | undefined;
	deleteModule: (id: string) => void;
	uploadImage: (imageFile: File) => Promise<string>;
	uuid: () => string;
	updateModuleNameDescription: (id: string, name: string, description: string) => void;
	addNewProblem: (moduleId: string, kind: ProblemKind, userId: string) => Promise<void>;
	deleteProblem: (problemId: string, moduleId: string) => void;
	getImageUrl: (uuid: string) => Promise<string>;
	updateProblem: (moduleId: string, problem: Problem) => void;
} | null = null;

export async function initialize() {
	store = await initializeStore();
}

export async function getEnvironment() {
	const env = await Agent.environment();
	return env;
}

export async function login(provider: 'microsoft' | 'google') {
	await Agent.login(provider);
}

export async function logout() {
	await Agent.logout();
}

function composeStore(
	modules: Record<string, Module>,
	problems: Record<string, Problem>
): Record<string, StateModule> {
	const map = Object.entries(modules).map(([id, module]) => {
		return [
			id,
			{
				...module,
				problems: module.problems.map((problemId) => {
					return { ...problems[problemId] };
				})
			}
		];
	});
	return Object.fromEntries(map);
}

async function initializeStore() {
	const _modulesState = (await Agent.state('mathModules')) as { modules: Record<string, Module> };
	const _problemsState = (await Agent.state('mathProblems')) as {
		problems: Record<string, Problem>;
	};

	if (!_modulesState.modules) {
		_modulesState.modules = {};
	}

	if (!_problemsState.problems) {
		_problemsState.problems = {};
	}

	let state = $state<Record<string, StateModule>>(
		composeStore(_modulesState.modules, _problemsState.problems)
	);

	const modulesCallback = (update: { state: object }) => {
		const _state = update.state as { modules: Record<string, Module> };
		state = composeStore(_state.modules, _problemsState.problems);
	};

	Agent.watch('mathModules', modulesCallback);

	return {
		getFn: () => state,
		addEmptyModule: async (module: StateModule) => {
			let moduleState = (await Agent.state(module.id)) as Module;
			moduleState = {
				...moduleState,
				...module,
				problems: module.problems.map((problem) => problem.id) // This is redundant because its usually empty
			};
			_modulesState.modules[module.id] = moduleState;
		},
		deleteModule: (id: string) => {
			delete _modulesState.modules[id];
		},
		getModule: (id: string) => {
			return state[id];
		},
		uploadImage: async (imageFile: File) => {
			const name = imageFile.name;
			const uuid = Agent.uuid();
			const type = imageFile.type;

			return await Agent.upload({
				id: uuid,
				name: name,
				type: type,
				data: await imageFile.arrayBuffer()
			});
		},
		uuid: () => {
			return Agent.uuid();
		},
		updateModuleNameDescription: (id: string, name: string, description: string) => {
			const module = _modulesState.modules[id];
			if (module) {
				module.name = name;
				module.description = description;
			}
		},
		addNewProblem: async (moduleId: string, kind: ProblemKind, userId: string) => {
			const module = _modulesState.modules[moduleId];
			if (!module) {
				throw new Error(`Module with id ${moduleId} not found`);
			}
			const uuid = Agent.uuid();

			switch (kind) {
				case ProblemKind.MULTIPLE_CHOICE:
					let mcqProblem = (await Agent.state(uuid)) as MultipleChoiceProblem;
					mcqProblem = {
						...mcqProblem,
						id: uuid,
						kind: ProblemKind.MULTIPLE_CHOICE,
						title: '',
						description: '',
						difficulty: ProblemDifficulty.EASY,
						concepts: [],
						options: [],
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						createdBy: userId
					};
					_problemsState.problems[mcqProblem.id] = mcqProblem;
					module.problems = [...module.problems, mcqProblem.id];
					break;
				case ProblemKind.WORD_PROBLEM:
					let wordProblem = (await Agent.state(uuid)) as WordProblem;
					wordProblem = {
						...wordProblem,
						id: uuid,
						kind: ProblemKind.WORD_PROBLEM,
						title: '',
						description: '',
						difficulty: ProblemDifficulty.EASY,
						answer: '',
						concepts: [],
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						createdBy: userId
					};
					_problemsState.problems[wordProblem.id] = wordProblem;
					module.problems = [...module.problems, wordProblem.id];
					break;
			}
		},
		deleteProblem: (problemId: string, moduleId: string) => {
			const module = _modulesState.modules[moduleId];
			if (!module) {
				throw new Error(`Module with id ${moduleId} not found`);
			}

			const index = module.problems.indexOf(problemId);
			if (index > -1) {
				// @ts-ignore
				module.problems[index] = null;
				module.problems.splice(index, 1);
				module.problems = [...module.problems];
			}
			delete _problemsState.problems[problemId];
		},
		getImageUrl: async (uuid: string) => {
			const downloadUrl = (await Agent.download(uuid)).url;
			return downloadUrl;
		},
		updateProblem: async (moduleId: string, problem: Problem) => {
			const module = _modulesState.modules[moduleId];
			if (!module) {
				throw new Error(`Module with id ${moduleId} not found`);
			}

			let existingProblemIndex = module.problems.indexOf(problem.id);
			if (existingProblemIndex === -1) {
				throw new Error(`Problem with id ${problem.id} not found in module ${moduleId}`);
			}
			let existingProblem = _problemsState.problems[problem.id];
			existingProblem.title = problem.title;
			existingProblem.description = problem.description;
			existingProblem.concepts = [...problem.concepts];
			existingProblem.difficulty = problem.difficulty;
			existingProblem.updatedAt = new Date().toISOString();
			existingProblem.kind = problem.kind;
			if (problem.kind === ProblemKind.MULTIPLE_CHOICE) {
				let mcqProblem = problem as MultipleChoiceProblem;
				let existingMCQProblem = existingProblem as MultipleChoiceProblem;
				existingMCQProblem.options = [...mcqProblem.options];
			} else if (problem.kind === ProblemKind.WORD_PROBLEM) {
				let wordProblem = problem as WordProblem;
				let existingWordProblem = existingProblem as WordProblem;
				existingWordProblem.answer = wordProblem.answer;
			}

			state = composeStore(_modulesState.modules, _problemsState.problems);
		}
	};
}
