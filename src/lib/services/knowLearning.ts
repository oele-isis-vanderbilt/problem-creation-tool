import Agent, { type AgentEnvironment } from '@knowlearning/agents/browser.js';
import type { AppUser } from './models';

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
}
