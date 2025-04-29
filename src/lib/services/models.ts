export interface AppUser {
	id: string;
	name: string;
	picture?: string | null | undefined;
	provider: string;
}

export interface Module {
	id: string;
	name: string;
	description: string;
	icon?: string;
	type: string;
	coverImage?: string;
	createdAt?: string;
	updatedAt?: string;
	createdBy?: string;
	problems: string[];
}
