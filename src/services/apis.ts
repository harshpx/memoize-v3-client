import { useStore } from "@/context/store";
import type {
	AccessTokenResponse,
	ApiResponse,
	LoginRequest,
	Note,
	NoteModifyRequest,
	SignupRequest,
	User,
} from "@/lib/commonTypes";
import { AuthError } from "@/lib/errors";

export const BASE_URL = "http://localhost:8086";

// ------------------ Auth services ------------------ //

/**
 * @access public
 * @param {LoginRequest} params - login request param
 * @param {string} params.identifier - The username or email of the user.
 * @param {string} params.password - The password of the user.
 * @returns {Promise<AccessTokenResponse>} - An object containing the access token and user ID.
 * @throws {Error} - Throws an error if the login request fails or if the response is not successful.
 * @description This function sends a POST request to the /auth/login endpoint with the provided identifier and password.
 */
export const login = async ({
	identifier,
	password,
}: LoginRequest): Promise<AccessTokenResponse> => {
	const url = `${BASE_URL}/auth/login`;
	const options: RequestInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({ identifier, password }),
	};
	const response = await fetch(url, options);
	const result: ApiResponse<AccessTokenResponse> = await response.json();
	if (!response.ok || !result.success) {
		const errorString = String(result.data);
		throw new Error(
			errorString.substring(0, Math.min(100, errorString.length)) ||
				"Unable to login",
		);
	}
	return result.data as AccessTokenResponse;
};

/**
 * @access public
 * @param {SignupRequest} params - signup request param
 * @param {string} params.name - The name of the user.
 * @param {string} params.username - The username of the user.
 * @param {string} params.email - The email of the user.
 * @param {string} params.password - The password of the user.
 * @returns {Promise<AccessTokenResponse>} - An object containing the access token and user ID.
 * @throws {Error} - Throws an error if the signup request fails or if the response is not successful.
 * @description This function sends a POST request to the /auth/signup endpoint with the provided name, username, email and password.
 */
export const signup = async ({
	name,
	username,
	email,
	password,
}: SignupRequest): Promise<AccessTokenResponse> => {
	const url = `${BASE_URL}/auth/signup`;
	const options: RequestInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({ name, username, email, password }),
	};
	const response = await fetch(url, options);
	const result: ApiResponse<AccessTokenResponse> = await response.json();
	if (!response.ok || !result.success) {
		const errorString = String(result.data);
		throw new Error(
			errorString.substring(0, Math.min(100, errorString.length)) ||
				"Unable to signup",
		);
	}
	return result.data as AccessTokenResponse;
};

/**
 * @access public
 * @returns {Promise<AccessTokenResponse>} - An object containing the new access token and optionally the user ID.
 * @throws {Error} - Throws an error if the refresh request fails or if the response is not successful.
 * @description This function sends a POST request to the /auth/refresh endpoint to refresh the access token. It includes credentials (cookies) in the request.
 * The server should validate the refresh token from the cookies and respond with a new access token if valid.
 * If the response is not successful, it throws an error with a message extracted from the response data or a default message.
 */
export const refresh = async (): Promise<AccessTokenResponse> => {
	const url = `${BASE_URL}/auth/refresh`;
	const options: RequestInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	};
	const response = await fetch(url, options);
	const result: ApiResponse<AccessTokenResponse> = await response.json();
	if (!response.ok || !result.success) {
		const errorString = String(result.data);
		throw new Error(
			errorString.substring(0, Math.min(100, errorString.length)) ||
				"Unable to refresh token",
		);
	}
	return result.data as AccessTokenResponse;
};

/**
 * @access public
 * @returns {Promise<void>} - Resolves when the logout request is complete.
 * @description This function sends a POST request to the /auth/logout endpoint to log out the user. It includes credentials (cookies) in the request.
 * The server should invalidate the refresh token from the cookies to log out the user.
 * Any errors during the fetch are caught and ignored
 */
export const logout = async (): Promise<void> => {
	const url = `${BASE_URL}/auth/logout`;
	const options: RequestInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	};
	try {
		await fetch(url, options);
	} catch (error) {
		if (error instanceof Error) {
			console.error("Logout request failed:", error.message);
		}
	}
};

/**
 * @access public
 * @param {string} username - The username to check for availability.
 * @returns {Promise<boolean>} - A promise that resolves to true if the username is available, false otherwise.
 * @throws {Error} - Throws an error if the request fails or if the response is not successful.
 * @description This function sends a GET request to the /auth/check-username?username=:username endpoint with the provided username as a query parameter.
 * It checks if the username is available for registration.
 */
export const checkUsernameAvailability = async (
	username: string,
): Promise<boolean> => {
	const url = `${BASE_URL}/auth/check-username?username=${encodeURIComponent(username)}`;
	const options: RequestInit = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	};
	const response = await fetch(url, options);
	const result: ApiResponse<boolean> = await response.json();
	if (!response.ok || !result.success) {
		const errorString = String(result.data);
		throw new Error(
			errorString.substring(0, Math.min(50, errorString.length)) ||
				"Failed to check username availability",
		);
	}
	return result.data as boolean;
};

/**
 * @access public
 * @param {string} email - The email to check for availability.
 * @returns {Promise<boolean>} - A promise that resolves to true if the email is available, false otherwise.
 * @throws {Error} - Throws an error if the request fails or if the response is not successful.
 * @description This function sends a GET request to the /auth/check-email?email=:email endpoint with the provided email as a query parameter.
 * It checks if the email is available for registration.
 */
export const checkEmailAvailability = async (
	email: string,
): Promise<boolean> => {
	const url = `${BASE_URL}/auth/check-email?email=${encodeURIComponent(email)}`;
	const options: RequestInit = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	};
	const response = await fetch(url, options);
	const result: ApiResponse<boolean> = await response.json();
	if (!response.ok || !result.success) {
		const errorString = String(result.data);
		throw new Error(
			errorString.substring(0, Math.min(100, errorString.length)) ||
				"Unable to refresh token",
		);
	}
	return result.data as boolean;
};

// ------------------ User services ------------------ //

/**
 * @access private
 * @returns {Promise<User>} - A promise that resolves to the user information.
 * @throws {Error} - Throws an error if the request fails or if the response is not successful.
 * @description This function sends a GET request to the /user/me endpoint with the provided access token in the Authorization header.
 * It retrieves the user's information.
 */
export const getUserInfo = async (): Promise<User> => {
	const { accessToken } = useStore.getState();
	if (!accessToken) {
		throw new AuthError("No access token present");
	}
	const url = `${BASE_URL}/user/me`;
	const options: RequestInit = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		credentials: "include",
	};
	const response = await fetch(url, options);
	const result: ApiResponse<User> = await response.json();
	if (!response.ok) {
		if (response.status === 401) {
			throw new AuthError("Unauthorized. Please log in again.");
		}
		throw new Error(String(result?.data) || "Failed to fetch user info");
	}
	return result.data as User;
};

export const fetchNotes = async (): Promise<Note[]> => {
	const { accessToken } = useStore.getState();
	if (!accessToken) {
		throw new AuthError("No access token present");
	}
	const url = `${BASE_URL}/notes`;
	const options: RequestInit = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		credentials: "include",
	};
	const response = await fetch(url, options);
	const result: ApiResponse<Note[]> = await response.json();
	if (!response.ok) {
		if (response.status === 401) {
			throw new AuthError("Unauthorized. Please log in again.");
		}
		throw new Error(String(result?.data) || "Failed to fetch notes");
	}
	return result.data as Note[];
};

export const createNote = async (
	requestBody: NoteModifyRequest,
): Promise<Note> => {
	const { accessToken } = useStore.getState();
	if (!accessToken) {
		throw new AuthError("No access token present");
	}
	const url = `${BASE_URL}/notes`;
	const options: RequestInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		credentials: "include",
		body: JSON.stringify(requestBody),
	};
	const response = await fetch(url, options);
	const result: ApiResponse<Note> = await response.json();
	if (!response.ok) {
		if (response.status === 401) {
			throw new AuthError("Unauthorized. Please log in again.");
		}
		throw new Error(String(result?.data) || "Failed to create note");
	}
	return result.data as Note;
};

export const updateNote = async (
	noteId: string,
	requestBody: NoteModifyRequest,
): Promise<Note> => {
	const { accessToken } = useStore.getState();
	if (!accessToken) {
		throw new AuthError("No access token present");
	}
	const url = `${BASE_URL}/notes/${noteId}`;
	const options: RequestInit = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		credentials: "include",
		body: JSON.stringify(requestBody),
	};
	const response = await fetch(url, options);
	const result: ApiResponse<Note> = await response.json();
	if (!response.ok) {
		if (response.status === 401) {
			throw new AuthError("Unauthorized. Please log in again.");
		}
		throw new Error(String(result?.data) || "Failed to create note");
	}
	return result.data as Note;
};

export const deleteNote = async (noteId: string): Promise<void> => {
	const { accessToken } = useStore.getState();
	if (!accessToken) {
		throw new AuthError("No access token present");
	}
	const url = `${BASE_URL}/notes/${noteId}`;
	const options: RequestInit = {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		credentials: "include",
	};
	const response = await fetch(url, options);
	const result: ApiResponse<void> = await response.json();
	if (!response.ok) {
		if (response.status === 401) {
			throw new AuthError("Unauthorized. Please log in again.");
		}
		throw new Error(String(result?.data) || "Failed to create note");
	}
};
