import Agent, { type AgentEnvironment } from '@knowlearning/agents/browser.js';
import type { Concept, Module } from './models';
import CONCEPTS from '$lib/components/concepts.json';

let modules = $state<Record<string, Module>>({});
let concepts = $state<Concept[]>([]);
let klModules: Record<string, Module> = {};
let klConcepts: Concept[] = [];

export function getModulesState() {
	return () => modules;
}

export function getConceptsState() {
	return () => concepts;
}

function populateConcepts(conceptsJSON: typeof CONCEPTS) {
	const validConceptNames = conceptsJSON.concepts.map((concept) => concept.name);
	const validConcepts = conceptsJSON.concepts
		.filter((concept) => {
			return concept.relatedConcepts.every((relatedConcept) => {
				console.log('relatedConcept', relatedConcept, validConceptNames);
				return validConceptNames.includes(relatedConcept);
			});
		})
		.map((concept) => {
			return {
				id: Agent.uuid(),
				...concept
			};
		});

	const conceptUuids = Object.fromEntries(
		validConcepts.map((concept) => {
			return [concept.name, concept.id];
		})
	);

	return validConcepts.map((concept) => {
		return {
			...concept,
			relatedConcepts: concept.relatedConcepts.map((relatedConcept) => {
				return conceptUuids[relatedConcept];
			})
		};
	}) as Concept[];
}

export async function initialize() {
	const modulesState = (await Agent.state('mathModules')) as {
		modules?: Record<string, Module>;
		concepts?: Concept[];
	};
	if (!modulesState.modules) {
		modulesState.modules = {};
	}
	if (!modulesState.concepts) {
		modulesState.concepts = populateConcepts(CONCEPTS);
	}

	modules = { ...modulesState.modules };
	concepts = [...modulesState.concepts];
	klModules = modulesState.modules;
	klConcepts = modulesState.concepts;
}

export async function getEnvironment(): Promise<AgentEnvironment> {
	const env = await Agent.environment();
	return env;
}

export async function login(provider: 'google' | 'microsoft' = 'google') {
	await Agent.login(provider);
}

export async function logout() {
	await Agent.logout();
}

export function addModule(module: Module) {
	klModules[module.id] = module;
	modules[module.id] = module;
	modules = { ...modules };
}

export function removeModule(id: string) {
	// delete modules[id];
	delete klModules[id];
	delete modules[id];
	modules = { ...modules };
}

export function getModule(id: string) {
	return klModules[id];
}

export async function uploadImage(imageFile: File) {
	const name = imageFile.name;
	const uuid = Agent.uuid();
	const type = imageFile.type;

	return await Agent.upload({
		id: uuid,
		name: name,
		type: type,
		data: await imageFile.arrayBuffer()
	});
}

export function uuid() {
	return Agent.uuid();
}

export async function getImageUrl(uuid: string) {
	const downloadUrl = (await Agent.download(uuid)).url;
	return downloadUrl;
}
