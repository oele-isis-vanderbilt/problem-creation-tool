import Agent from '@knowlearning/agents/browser.js';

import type { ProblemAttempt } from './models';

export let responseStore: {} | null = null;

export async function initialize() {
	responseStore = await initializeStore();
}

export async function initializeStore() {}
