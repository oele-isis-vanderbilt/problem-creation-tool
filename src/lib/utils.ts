import type { AgentAuth } from '@knowlearning/agents/browser';

export const isAnonUser = (auth: AgentAuth) => {
	return auth.info?.name === 'anonymous';
};
