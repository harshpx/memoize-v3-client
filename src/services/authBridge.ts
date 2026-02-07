import type { User } from "@/lib/commonTypes";

let accessToken: string | null = null;
let user: User | null = null;

let tokenListener: ((token: string | null) => void) | undefined;
let userListener: ((user: User | null) => void) | undefined;

export const registerAuthListener = (
	onToken?: (token: string | null) => void,
	onUser?: (user: User | null) => void,
) => {
	if (onToken) {
		tokenListener = onToken;
		onToken(accessToken);
	}
	if (onUser) {
		userListener = onUser;
		onUser(user);
	}

	return () => {
		if (onToken) tokenListener = undefined;
		if (onUser) userListener = undefined;
	};
};

export const getAccessToken = () => accessToken;
export const setAccessToken = (token: string | null) => {
	accessToken = token;
	if (tokenListener) {
		tokenListener(token);
	}
};

export const getUser = () => user;
export const setUser = (newUser: User | null) => {
	user = newUser;
	if (userListener) {
		userListener(newUser);
	}
};
