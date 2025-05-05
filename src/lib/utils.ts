import type { AgentAuth } from '@knowlearning/agents/browser';

export const isAnonUser = (auth: AgentAuth) => {
	return auth.info?.name === 'anonymous';
};

export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
	func: F,
	waitFor: number
) => {
	let timeout: NodeJS.Timeout;

	const debounced = (...args: Parameters<F>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), waitFor);
	};

	return debounced;
};
