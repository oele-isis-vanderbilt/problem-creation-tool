import Agent from '@knowlearning/agents/browser.js';
import {
	Operator,
	ProblemDifficulty,
	ProblemKind,
	type Concept,
	type KLProblem,
	type Misconception,
	type Module,
	type MultipleChoiceProblem,
	type NDigitOperation,
	type Problem,
	type StateModule,
	type WordProblem
} from './models';
import { clone } from 'underscore';
import type { ProblemStore } from './problem-store.svelte';
const NAMED_MODULES_STATE = 'oecd.math-rct.modules';
const NAMED_CONCEPTS_STATE = 'oecd.math-rct.concepts';
const NAMED_MISCONCEPTIONS_STATE = 'oecd.math-rct.misconceptions';

export let store: {
	getFn: () => Record<string, StateModule>;
	addEmptyModule: (module: StateModule) => Promise<void>;
	getModule: (id: string) => StateModule | undefined;
	deleteModule: (id: string) => void;
	uploadImage: (imageFile: File) => Promise<string>;
	uuid: () => string;
	getImageUrl: (uuid: string) => Promise<string>;

	updateModuleNameDescription: (id: string, name: string, description: string) => void;

	addNewProblem: (moduleId: string, kind: ProblemKind, userId: string) => Promise<void>;
	deleteProblem: (problemId: string, moduleId: string) => void;
	updateProblem: (moduleId: string, problem: Problem) => void;

	addConcept: (concept: Concept) => Promise<void>;
	updateConcept: (concept: Concept) => void;
	getConcept: (id: string) => Concept | undefined;
	getConceptsFn: () => () => Record<string, Concept>;

	getMisconceptionsFn: () => () => Record<string, Misconception>;
	addMisconception: (misconception: Misconception) => Promise<void>;
	getMisconception: (id: string) => Misconception;
	updateMisconception: (misconception: Misconception) => void;
} | null = null;

export async function initialize(problemsStore: ProblemStore) {
	store = await initializeStore(problemsStore);
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
	problems: ProblemStore
): Record<string, StateModule> {
	const map = Object.entries(modules).map(([id, module]) => {
		return [
			id,
			{
				...module,
				problems: module.problems.map((problemId) => {
					return problems.getProblem(problemId);
				})
			}
		];
	});
	return Object.fromEntries(map);
}

async function initializeStore(problemsStore: ProblemStore) {
	const _modulesState = (await Agent.state(NAMED_MODULES_STATE)) as {
		modules: Record<string, Module>;
	};
	const _conceptsState = (await Agent.state(NAMED_CONCEPTS_STATE)) as {
		concepts: Record<string, Concept>;
	};
	const _misconceptionsState = (await Agent.state(NAMED_CONCEPTS_STATE)) as {
		misconceptions: Record<string, Misconception>;
	};

	if (!_modulesState.modules) {
		_modulesState.modules = {};
	}

	if (!_conceptsState.concepts) {
		_conceptsState.concepts = {};
	}

	if (!_misconceptionsState.misconceptions) {
		_misconceptionsState.misconceptions = {};
	}

	let state = $state<Record<string, StateModule>>(
		composeStore(_modulesState.modules, problemsStore)
	);

	let concepts = $state<Record<string, Concept>>(_conceptsState.concepts);
	let misconceptions = $state<Record<string, Misconception>>(_misconceptionsState.misconceptions);

	const modulesCallback = (update: { state: object }) => {
		const _state = update.state as { modules: Record<string, Module> };
		state = composeStore(_state.modules, problemsStore);
	};

	const conceptsCallback = (update: { state: object }) => {
		const _state = update.state as { concepts: Record<string, Concept> };
		concepts = _state.concepts;
	};

	const misconceptionsCallback = (update: { state: object }) => {
		const _state = update.state as { misconceptions: Record<string, Misconception> };
		misconceptions = _state.misconceptions;
	};

	Agent.watch(NAMED_MODULES_STATE, modulesCallback);
	Agent.watch(NAMED_CONCEPTS_STATE, conceptsCallback);
	Agent.watch(NAMED_CONCEPTS_STATE, misconceptionsCallback);

	return {
		getFn: () => state,
		addEmptyModule: async (module: StateModule) => {
			let moduleState = {} as Module;
			moduleState = {
				...moduleState,
				...module,
				problems: module.problems.map((problem) => problem.id) // This is redundant because its usually empty
			};
			_modulesState.modules[module.id] = moduleState;
		},
		deleteModule: (id: string) => {
			const toDeleteModule = _modulesState.modules[id];
			if (toDeleteModule) {
				toDeleteModule.problems.forEach((problemId) => store!.deleteProblem(problemId, id));
			}
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
					let mcqProblem = {} as MultipleChoiceProblem;
					mcqProblem = {
						...mcqProblem,
						id: uuid,
						kind: ProblemKind.MULTIPLE_CHOICE,
						title: '',
						description: '',
						difficulty: ProblemDifficulty.EASY,
						concepts: [],
						options: [],
						aiPrompt: '',
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						createdBy: userId
					};
					await problemsStore.addEmptyProblem(mcqProblem);
					module.problems = [...module.problems, mcqProblem.id];
					break;
				case ProblemKind.WORD_PROBLEM:
					let wordProblem = {} as WordProblem;
					wordProblem = {
						...wordProblem,
						id: uuid,
						kind: ProblemKind.WORD_PROBLEM,
						title: '',
						description: '',
						difficulty: ProblemDifficulty.EASY,
						answerBlocks: [],
						aiPrompt: '',
						concepts: [],
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						createdBy: userId
					};
					await problemsStore.addEmptyProblem(wordProblem);
					module.problems = [...module.problems, wordProblem.id];
					break;
				case ProblemKind.N_DIGIT_OPERATION:
					let nDigitProblem = {} as NDigitOperation;
					nDigitProblem = {
						...nDigitProblem,
						id: uuid,
						kind: ProblemKind.N_DIGIT_OPERATION,
						title: '',
						description: '',
						difficulty: ProblemDifficulty.EASY,
						aiPrompt: '',
						concepts: [],
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						createdBy: userId,
						operand1: '200',
						operand2: '100',
						operator: Operator.PLUS,
						includeCarryAndBorrow: false
					};
					await problemsStore.addEmptyProblem(nDigitProblem);
					module.problems = [...module.problems, nDigitProblem.id];
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
			problemsStore.deleteProblem(problemId);
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

			await problemsStore.updateProblem(problem);
			_modulesState.modules[moduleId].problems[existingProblemIndex] = problem.id;
		},
		addConcept: async (concept: Concept) => {
			let newConcept = (await Agent.state(concept.id)) as Concept;
			newConcept = {
				...newConcept,
				...concept
			};
			_conceptsState.concepts[newConcept.id] = newConcept;
		},
		getConcept: (id: string) => {
			return _conceptsState.concepts[id];
		},
		getConceptsFn: () => {
			return () => concepts;
		},
		updateConcept: (concept: Concept) => {
			const existingConcept = _conceptsState.concepts[concept.id];
			if (!existingConcept) {
				throw new Error(`Concept with id ${concept.id} not found`);
			}
			existingConcept.name = concept.name;
			existingConcept.description = concept.description;
			existingConcept.relatedConcepts = clone(concept.relatedConcepts);
			existingConcept.aiPrompt = concept.aiPrompt;
		},

		getMisconceptionsFn: () => {
			return () => misconceptions;
		},
		getMisconception: (id: string) => {
			return _misconceptionsState.misconceptions[id];
		},
		addMisconception: async (misconception: Misconception) => {
			let newMisconception = (await Agent.state(misconception.id)) as Misconception;
			newMisconception = {
				...newMisconception,
				...misconception
			};
			_misconceptionsState.misconceptions[newMisconception.id] = newMisconception;
		},
		updateMisconception: (misconception: Misconception) => {
			const existingMisconception = _misconceptionsState.misconceptions[misconception.id];
			if (!existingMisconception) {
				throw new Error(`Misconception with id ${misconception.id} not found`);
			}
			existingMisconception.name = misconception.name;
			existingMisconception.aiDefinition = misconception.aiDefinition;
			existingMisconception.aiFeedback = misconception.aiFeedback;
		}
	};
}
