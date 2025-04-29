import Agent, { type AgentEnvironment } from '@knowlearning/agents/browser.js';
import type { AppUser, Module } from './models';

export class KnowlearningService {
	async getEnvironment(): Promise<AgentEnvironment> {
		const env = await Agent.environment();
		return env;
	}

	async login(provider: 'google' | 'microsoft' = 'google') {
		await Agent.login(provider);
	}

	async logout() {
		await Agent.logout();
	}

	async modulesState() {
		const state = await Agent.state('mathModules');
		return state;
	}

	async addModule(module: Module) {
		const state = await Agent.state('mathModules');
		if (!state.modules) {
			state.modules = [];
		}
		state.modules.push(module);
	}

	async uploadImage(imageFile: File): Promise<string> {
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

	async getImageUrl(uuid: string) {
		const downloadUrl = (await Agent.download(uuid)).url;
		return downloadUrl;
	}

	async getUserInfo(uuid: string) {
		const user = await Agent.state(uuid);
		return user;
	}

	uuid() {
		const uuid = Agent.uuid();
		return uuid;
	}
}
