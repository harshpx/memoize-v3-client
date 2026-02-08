import { useStore } from "@/context/store";
import type { LoginRequest, SignupRequest, User } from "@/lib/commonTypes";
import { AuthError } from "@/lib/errors";
import { getUserInfo, login, logout, refresh, signup } from "@/services/apis";

const updateAuthState = (accessToken: string | null, user: User | null) => {
	useStore.getState().setAuth(accessToken, user);
};

/**
 * @access public
 * @param {LoginRequest} loginRequest
 * @returns {Promise<void>}
 * @description Logs in the user and fetches their information.
 * Sets the access token and user in the auth context.
 * @throws {Error} If login fails or fetching user info fails.
 */
export const loginAndFetchUserInfo = async (
	loginRequest: LoginRequest,
): Promise<void> => {
	const { accessToken } = await login(loginRequest);
	updateAuthState(accessToken, null);
	const user: User = await getUserInfo();
	updateAuthState(accessToken, user);
};

/**
 * @access public
 * @param {SignupRequest} signupRequest
 * @returns {Promise<void>}
 * @description Signs up the user and fetches their information.
 * Sets the access token and user in the auth context.
 * @throws {Error} If signup fails or fetching user info fails.
 */
export const signupAndFetchUserInfo = async (
	signupRequest: SignupRequest,
): Promise<void> => {
	const { accessToken } = await signup(signupRequest);
	updateAuthState(accessToken, null);
	const user: User = await getUserInfo();
	updateAuthState(accessToken, user);
};

/**
 * @access public
 * @returns {Promise<void>}
 * @description Logs out the user by calling the logout API.
 * Clears the access token and user from the auth context.
 */
export const logoutUser = async (): Promise<void> => {
	try {
		await logout();
	} finally {
		updateAuthState(null, null);
	}
};

/**
 *
 * @template T - The expected return type of the API call.
 * @template A - The type of the arguments array for the API call.
 * @param {(...args: A) => Promise<T>} apiCall - The API call function to be executed.
 * @param {A} args - The arguments to be passed to the API call function.
 * @returns {Promise<T>}
 * @description This function takes an API call and its arguments, and attempts to execute it.
 * If the API call fails with an AuthError, it will attempt to refresh the access token and retry the API call once.
 * If the second attempt also fails, it will log out the user and throw the error.
 * @throws {Error} If the API call fails for reasons other than auth, or if the token refresh fails.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const retryWithRefresh = async <T, A extends any[]>(
	apiCall: (...args: A) => Promise<T>,
	args: A,
): Promise<T> => {
	try {
		return await apiCall(...args);
	} catch (error) {
		// if not an auth error, rethrow it
		if (!(error instanceof AuthError)) {
			throw error;
		}
		try {
			// attempt to refresh the token
			const { accessToken } = await refresh();
			updateAuthState(accessToken, null);
			const user: User = await getUserInfo();
			updateAuthState(accessToken, user);
			// retry the original API call
			return await apiCall(...args);
		} catch (refreshError) {
			// log out the user on 2nd failure
			await logoutUser();
			throw refreshError;
		}
	}
};
