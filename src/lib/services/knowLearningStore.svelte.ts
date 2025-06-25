import Agent from '@knowlearning/agents/browser.js';
import {
	Operator,
	ProblemDifficulty,
	ProblemKind,
	type Assessment,
	type Concept,
	type ExportedAssessment,
	type ExportedModule,
	type Misconception,
	type Module,
	type MultipleChoiceProblem,
	type NDigitOperation,
	type Problem,
	type StateAssessment,
	type StateModule,
	type Tag,
	type WordProblem
} from './models';
import { clone, isEmpty, omit } from 'underscore';
import type { ProblemStore } from './problem-store.svelte';
const NAMED_MODULES_STATE = 'oecd.math-rct.modules';
const NAMED_CONCEPTS_STATE = 'oecd.math-rct.concepts';
const NAMED_MISCONCEPTIONS_STATE = 'oecd.math-rct.misconceptions';
const NAMED_ASSESSMENTS_STATE = 'oecd.math-rct.assessments';
const NAMED_TAGS_STATE = 'oecd.math-rct.tags';

export let store: {
	getFn: () => Record<string, StateModule>;
	addEmptyModule: (module: StateModule) => Promise<void>;
	getModule: (id: string) => StateModule | undefined;
	deleteModule: (id: string) => void;
	uploadImage: (imageFile: File) => Promise<string>;
	uuid: () => string;
	getImageUrl: (uuid: string) => Promise<string>;
	exportModule: (module: StateModule) => Promise<string>;
	importModule: (uuid: string, newName: string) => Promise<void>;

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

	getTagsFn: () => () => Record<string, Tag>;
	addTag: (tag: Tag) => Promise<void>;
	getTag: (id: string) => Tag;
	updateTag: (tag: Tag) => void;

	getAssessmentsFn: () => Record<string, StateAssessment>;
	assessmentExists: (id: string) => boolean;
	updateAssessmentTitleDescription: (id: string, title: string, description: string) => void;
	getAssessment: (id: string) => StateAssessment | undefined;
	getAssessmentKL: (id: string) => Promise<Assessment>;
	createAssessment: (assessment: Assessment) => void;
	updateAssessment: (assessment: Assessment) => void;
	deleteAssessment: (assessmentId: string) => void;
	exportAssessment: (assessment: StateAssessment) => Promise<string>;
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

async function composeStore(
	modules: Record<string, Module>,
	problems: ProblemStore
): Promise<Record<string, StateModule>> {
	const allProblemIds = Object.values(modules).flatMap((module) => module.problems);
	const nonExistingProblems = allProblemIds.filter((id) => !problems.getProblem(id));

	await Promise.all(
		nonExistingProblems.map(async (problemId) => {
			await problems.createProblemMetadata(problemId);
		})
	);

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

function composeAssessmentStore(
	asessments: Record<string, Assessment>,
	problems: ProblemStore
): Record<string, StateAssessment> {
	const displayProblems = problems.getFn()();
	const map = Object.entries(asessments).map(([id, assessment]) => {
		return [
			id,
			{
				...omit(assessment, ['problems']),
				problems: assessment.problemIds
					.map((id) => displayProblems[id])
					.filter((problem) => problem !== undefined)
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
	const _misconceptionsState = (await Agent.state(NAMED_MISCONCEPTIONS_STATE)) as {
		misconceptions: Record<string, Misconception>;
	};

	const _assessmentsState = (await Agent.state(NAMED_ASSESSMENTS_STATE)) as {
		assessments: Record<string, Assessment>;
	};

	const _tagsState = (await Agent.state(NAMED_TAGS_STATE)) as {
		tags: Record<string, Tag>;
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

	if (!_tagsState.tags) {
		_tagsState.tags = {};
	}

	if (!_assessmentsState.assessments) {
		_assessmentsState.assessments = {};
	}

	let state = $state<Record<string, StateModule>>(
		await composeStore(_modulesState.modules, problemsStore)
	);

	let concepts = $state<Record<string, Concept>>(_conceptsState.concepts);
	let misconceptions = $state<Record<string, Misconception>>(_misconceptionsState.misconceptions);
	let tags = $state<Record<string, Tag>>(_tagsState.tags);
	let assessments = $state<Record<string, StateAssessment>>(
		composeAssessmentStore(_assessmentsState.assessments, problemsStore)
	);

	const modulesCallback = (update: { state: object }) => {
		const _state = update.state as { modules: Record<string, Module> };
		// state = composeStore(_state.modules, problemsStore);
		composeStore(_state.modules, problemsStore).then((newState) => {
			state = newState;
		});
	};

	const conceptsCallback = (update: { state: object }) => {
		const _state = update.state as { concepts: Record<string, Concept> };
		concepts = _state.concepts;
	};

	const misconceptionsCallback = (update: { state: object }) => {
		const _state = update.state as { misconceptions: Record<string, Misconception> };
		misconceptions = _state.misconceptions;
	};

	const tagsCallback = (update: { state: object }) => {
		const _state = update.state as { tags: Record<string, Tag> };
		tags = _state.tags;
	};

	const assessmentsCallback = (update: { state: object }) => {
		const _state = update.state as { assessments: Record<string, Assessment> };
		assessments = composeAssessmentStore(_state.assessments || {}, problemsStore);
	};

	Agent.watch(NAMED_MODULES_STATE, modulesCallback);
	Agent.watch(NAMED_CONCEPTS_STATE, conceptsCallback);
	Agent.watch(NAMED_MISCONCEPTIONS_STATE, misconceptionsCallback);
	Agent.watch(NAMED_TAGS_STATE, tagsCallback);
	Agent.watch(NAMED_ASSESSMENTS_STATE, assessmentsCallback);

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
				delete _modulesState.modules[id];
			}
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
		exportModule: async (module: StateModule) => {
			const uuid = Agent.uuid();
			const exportedModulesState = (await Agent.state(uuid)) as ExportedModule;
			const exportedModule: ExportedModule = {
				concepts: Object.values(_conceptsState.concepts),
				misconceptions: Object.values(_misconceptionsState.misconceptions),
				tags: Object.values(_tagsState.tags),
				description: module.description,
				name: module.name,
				problems: module.problems.map((problem) => problem.id),
				coverImageUUID: module.coverImageUUID
			};
			Object.assign(exportedModulesState, JSON.parse(JSON.stringify(exportedModule)));

			return uuid;
		},
		importModule: async (uuid: string, newName: string) => {
			const importedModule = (await Agent.state(uuid)) as ExportedModule;
			if (isEmpty(importedModule)) {
				throw new Error('Module is empty or invalid');
			}
			const allProblems = await Promise.all(
				importedModule.problems.map(async (problemId) => {
					return await problemsStore.loadProblem(problemId);
				})
			);

			const storedProblems = problemsStore.getFn()();
			const user = (await getEnvironment()).auth.user;
			for (const problemId of importedModule.problems) {
				if (!storedProblems[problemId]) {
					problemsStore.addProblemMetadata(
						{
							id: problemId,
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
							createdBy: user
						},
						false
					);
				}
			}

			if (allProblems.some((problem) => isEmpty(problem))) {
				throw new Error('One or more problems in the module are empty or invalid');
			}

			const problemConcepts = allProblems.map((problem) => problem.concepts).flat();
			const problemMisconceptions = allProblems.map((problem) => problem.misconceptions).flat();
			const problemTags = allProblems.map((problem) => problem.tags).flat();

			problemConcepts.forEach((conceptId) => {
				if (!_conceptsState.concepts[conceptId]) {
					const concept = importedModule.concepts.find((c) => c.id === conceptId);
					if (concept) {
						_conceptsState.concepts[conceptId] = JSON.parse(
							JSON.stringify({
								id: concept.id,
								name: concept.name,
								description: concept.description,
								relatedConcepts: concept.relatedConcepts || [],
								aiPrompt: concept.aiPrompt || ''
							})
						);
					}
				}
			});

			problemMisconceptions.forEach((misconceptionId) => {
				if (!_misconceptionsState.misconceptions[misconceptionId]) {
					const misconception = importedModule.misconceptions.find((m) => m.id === misconceptionId);
					if (misconception) {
						_misconceptionsState.misconceptions[misconceptionId] = JSON.parse(
							JSON.stringify({
								id: misconception.id,
								name: misconception.name,
								aiDefinition: misconception.aiDefinition,
								aiFeedback: misconception.aiFeedback
							})
						);
					}
				}
			});

			problemTags.forEach((tagId) => {
				if (!_tagsState.tags[tagId]) {
					const tag = importedModule.tags.find((t) => t.id === tagId);
					if (tag) {
						_tagsState.tags[tagId] = JSON.parse(
							JSON.stringify({
								id: tag.id,
								tagName: tag.tagName,
								description: tag.description || ''
							})
						);
					}
				}
			});

			const newModuleId = Agent.uuid();

			const newModule: Module = {
				id: newModuleId,
				name: importedModule.name,
				description: importedModule.description,
				coverImageUUID: importedModule.coverImageUUID,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				createdBy: (await getEnvironment()).auth.user,
				problems: importedModule.problems
			};

			newModule.name = newName || newModule.name;

			_modulesState.modules[newModuleId] = JSON.parse(JSON.stringify(newModule));
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
						tags: [],
						misconceptions: [],
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
						tags: [],
						misconceptions: [],
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
						tags: [],
						misconceptions: [],
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
		},
		getTagsFn: () => {
			return () => tags;
		},
		addTag: async (tag: Tag) => {
			let newTag = (await Agent.state(tag.id)) as Tag;
			Object.assign(newTag, tag);
			_tagsState.tags[newTag.id] = newTag;
		},
		updateTag: (tag: Tag) => {
			const existingTag = _tagsState.tags[tag.id];
			if (!existingTag) {
				throw new Error(`Tag with id ${tag.id} not found`);
			}
			existingTag.tagName = tag.tagName;
			existingTag.description = tag.description;
			existingTag.id = tag.id; // Ensure the id is updated
		},
		getTag: (id: string) => {
			return _tagsState.tags[id];
		},
		getAssessmentsFn: () => {
			return assessments;
		},
		assessmentExists: (id: string) => {
			return !!_assessmentsState.assessments[id];
		},
		getAssessment: (id: string) => {
			return assessments[id];
		},
		updateAssessmentTitleDescription: (id: string, title: string, description: string) => {
			const assessment = _assessmentsState.assessments[id];
			if (!assessment) {
				throw new Error(`Assessment with id ${id} not found`);
			}
			assessment.title = title;
			assessment.description = description;
		},
		getAssessmentKL: async (id: string) => {
			const assessment = _assessmentsState.assessments[id];
			if (!assessment) {
				throw new Error(`Assessment with id ${id} not found`);
			}
			return assessment;
		},
		createAssessment: (assessment: Assessment) => {
			_assessmentsState.assessments[assessment.id] = Object.assign({}, assessment);
		},
		updateAssessment: (assessment: Assessment) => {
			const existingAssessment = _assessmentsState.assessments[assessment.id];
			if (!existingAssessment) {
				throw new Error(`Assessment with id ${assessment.id} not found`);
			}
			Object.assign(existingAssessment, assessment);
		},
		deleteAssessment: async (assessmentId: string) => {
			if (!_assessmentsState.assessments[assessmentId]) {
				throw new Error(`Assessment with id ${assessmentId} not found`);
			}
			delete _assessmentsState.assessments[assessmentId];
		},
		exportAssessment: async (assessment: StateAssessment) => {
			const uuid = Agent.uuid();
			const exportedAssessment: ExportedAssessment = {
				kind: 'Assessment',
				attemptTimeLimit: assessment.attemptTimeLimit,
				description: assessment.description,
				group: assessment.group,
				maxAttemptsPerQuestion: assessment.maxAttemptsPerQuestion,
				reviewTimeLimit: assessment.reviewTimeLimit,
				problemIds: assessment.problems.map((problem) => problem.id),
				title: assessment.title,
				coverImageUUID: assessment.coverImageUUID
			};
			const exportedAssessmentState = (await Agent.state(uuid)) as ExportedAssessment;
			Object.assign(exportedAssessmentState, JSON.parse(JSON.stringify(exportedAssessment)));
			return uuid;
		}
	};
}
