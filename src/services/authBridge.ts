let accessToken: string | null = null;
let listener: ((token: string | null) => void) | undefined;

export const registerAuthListener = (
	callBack: (token: string | null) => void,
) => {
	listener = callBack;
};

export const setAccessToken = (token: string | null) => {
	accessToken = token;
	if (listener) {
		listener(token);
	}
};

export const getAccessToken = () => accessToken;
