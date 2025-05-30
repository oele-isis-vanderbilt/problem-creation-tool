import Agent from '@knowlearning/agents/browser.js';
import {
	Operator,
	ProblemDifficulty,
	ProblemKind,
	type Assessment,
	type Concept,
	type Misconception,
	type Module,
	type MultipleChoiceProblem,
	type NDigitOperation,
	type Problem,
	type StateAssessment,
	type StateModule,
	type WordProblem
} from './models';
import { clone } from 'underscore';

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
	getProblem: (id: string) => Problem | undefined;

	addConcept: (concept: Concept) => Promise<void>;
	updateConcept: (concept: Concept) => void;
	getConcept: (id: string) => Concept | undefined;
	getConceptsFn: () => () => Record<string, Concept>;

	getMisconceptionsFn: () => () => Record<string, Misconception>;
	addMisconception: (misconception: Misconception) => Promise<void>;
	getMisconception: (id: string) => Misconception;
	updateMisconception: (misconception: Misconception) => void;

	getAssessmentsFn: () => () => Record<string, StateAssessment>;
	assessmentExists: (id: string) => boolean;
	updateAssessmentTitleDescription: (id: string, title: string, description: string) => void;
	getAssessment: (id: string) => StateAssessment | undefined;
	getAssessmentKL: (id: string) => Promise<Assessment>;
	createAssessment: (assessment: Assessment) => Promise<void>;
	updateAssessment: (assessment: Assessment) => Promise<void>;
	deleteAssessment: (assessmentId: string) => Promise<void>;
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

async function loadProblems(problemIds: string[]): Promise<Problem[]> {
	const { problems: allProblems } = (await Agent.state('mathProblems')) as {
		problems: Record<string, Problem>;
	};
	const problems = problemIds.map((problemId) => {
		const problem = allProblems[problemId] as Problem | undefined;
		if (!problem) {
			throw new Error(`Problem with id ${problemId} not found`);
		}
		return problem;
	});

	return problems;
}

async function composeAssessmentStore(asessments: string[]) {
	const assessments = Object.fromEntries(
		await Promise.all(
			asessments.map(async (assessmentId) => {
				const assessment = (await Agent.state(assessmentId)) as Assessment;
				const stateAssessment = {
					...assessment,
					problems: await loadProblems(assessment.problemIds)
				} as StateAssessment;
				return [assessment.id, stateAssessment];
			})
		)
	);
	return assessments;
}

async function initializeStore() {
	const _modulesState = (await Agent.state('mathModules')) as { modules: Record<string, Module> };
	const _problemsState = (await Agent.state('mathProblems')) as {
		problems: Record<string, Problem>;
	};
	const _conceptsState = (await Agent.state('mathConcepts')) as {
		concepts: Record<string, Concept>;
	};

	const _assessmentsState = (await Agent.state('mathAssessments')) as {
		asessments: string[];
	};

	const _misconceptionsState = (await Agent.state('mathMisconceptions')) as {
		misconceptions: Record<string, Misconception>;
	};

	if (!_modulesState.modules) {
		_modulesState.modules = {};
	}

	if (!_problemsState.problems) {
		_problemsState.problems = {};
	}

	if (!_conceptsState.concepts) {
		_conceptsState.concepts = {};
	}

	if (!_misconceptionsState.misconceptions) {
		_misconceptionsState.misconceptions = {};
	}

	if (!_assessmentsState.asessments) {
		_assessmentsState.asessments = [];
	}

	let state = $state<Record<string, StateModule>>(
		composeStore(_modulesState.modules, _problemsState.problems)
	);

	let concepts = $state<Record<string, Concept>>(_conceptsState.concepts);
	let misconceptions = $state<Record<string, Misconception>>(_misconceptionsState.misconceptions);

	let assessments = $state<Record<string, StateAssessment>>(
		await composeAssessmentStore(_assessmentsState.asessments)
	);

	const modulesCallback = (update: { state: object }) => {
		const _state = update.state as { modules: Record<string, Module> };
		state = composeStore(_state.modules, _problemsState.problems);
	};

	const conceptsCallback = (update: { state: object }) => {
		const _state = update.state as { concepts: Record<string, Concept> };
		concepts = _state.concepts;
	};

	const misconceptionsCallback = (update: { state: object }) => {
		const _state = update.state as { misconceptions: Record<string, Misconception> };
		misconceptions = _state.misconceptions;
	};

	const assessmentsCallback = (update: { state: object }) => {
		const _state = update.state as { asessments: string[] };
		composeAssessmentStore(_state.asessments).then((asss) => {
			assessments = asss;
		});
	};

	Agent.watch('mathModules', modulesCallback);
	Agent.watch('mathConcepts', conceptsCallback);
	Agent.watch('mathMisconceptions', misconceptionsCallback);
	Agent.watch('mathAssessments', assessmentsCallback);

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
					_problemsState.problems[mcqProblem.id] = mcqProblem;
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
					_problemsState.problems[wordProblem.id] = wordProblem;
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
					_problemsState.problems[nDigitProblem.id] = nDigitProblem;
					module.problems = [...module.problems, nDigitProblem.id];
					break;
			}
		},
		getProblem: (id: string) => {
			return _problemsState.problems[id];
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
				existingMCQProblem.options = mcqProblem.options.map((option) => clone(option));
			} else if (problem.kind === ProblemKind.WORD_PROBLEM) {
				let wordProblem = problem as WordProblem;
				let existingWordProblem = existingProblem as WordProblem;
				existingWordProblem.answerBlocks = [...wordProblem.answerBlocks];
			} else if (problem.kind === ProblemKind.N_DIGIT_OPERATION) {
				let nDigitProblem = problem as NDigitOperation;
				let existingNDigitProblem = existingProblem as NDigitOperation;
				existingNDigitProblem.operand1 = nDigitProblem.operand1;
				existingNDigitProblem.operand2 = nDigitProblem.operand2;
				existingNDigitProblem.operator = nDigitProblem.operator;
				existingNDigitProblem.includeCarryAndBorrow = nDigitProblem.includeCarryAndBorrow;
			}

			state = composeStore(_modulesState.modules, _problemsState.problems);
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
		},
		getAssessmentsFn: () => {
			return () => assessments;
		},
		assessmentExists: (id: string) => {
			return !!_assessmentsState.asessments.find((assessmentId) => assessmentId === id);
		},
		getAssessment: (id: string) => {
			if (!_assessmentsState.asessments.includes(id)) {
				throw new Error(`Assessment with id ${id} not found`);
			}
			return assessments[id];
		},
		getAssessmentKL: async (id: string) => {
			if (!_assessmentsState.asessments.includes(id)) {
				throw new Error(`Assessment with id ${id} not found`);
			}
			const assessment = (await Agent.state(id)) as Assessment;
			return assessment;
		},
		updateAssessmentTitleDescription: async (id: string, title: string, description: string) => {
			const assessment = _assessmentsState.asessments.find((assessmentId) => assessmentId === id);
			if (!assessment) {
				throw new Error(`Assessment with id ${id} not found`);
			}
			const assessmentState = (await Agent.state(id)) as Assessment;
			if (!assessmentState) {
				throw new Error(`Assessment with id ${id} not found in state`);
			}
			assessmentState.title = title;
			assessmentState.description = description;
			_assessmentsState.asessments.splice(
				_assessmentsState.asessments.indexOf(assessmentState.id),
				1,
				assessmentState.id
			);
		},
		createAssessment: async (assessment: Assessment) => {
			const assessmentState = (await Agent.state(assessment.id)) as Assessment;
			Object.assign(assessmentState, assessment);
			_assessmentsState.asessments.push(assessmentState.id);
			_assessmentsState.asessments = [..._assessmentsState.asessments];
		},
		updateAssessment: async (assessment: Assessment) => {
			const assessmentState = (await Agent.state(assessment.id)) as Assessment;
			if (!assessmentState) {
				throw new Error(`Assessment with id ${assessment.id} not found`);
			}

			if (_assessmentsState.asessments.indexOf(assessmentState.id) === -1) {
				throw new Error(`Assessment with id ${assessment.id} not found in assessments`);
			}

			Object.assign(assessmentState, assessment);
			_assessmentsState.asessments.splice(
				_assessmentsState.asessments.indexOf(assessmentState.id),
				1,
				assessmentState.id
			);
			_assessmentsState.asessments = [..._assessmentsState.asessments];
		},
		deleteAssessment: async (assessmentId: string) => {
			const assessmentState = (await Agent.state(assessmentId)) as Assessment;
			if (!assessmentState) {
				throw new Error(`Assessment with id ${assessmentId} not found`);
			}
			const index = _assessmentsState.asessments.indexOf(assessmentState.id);
			if (index > -1) {
				_assessmentsState.asessments.splice(index, 1);
			}
		}
	};
}
