import type { AccessTokenResponse, ApiResponse, User } from "@/lib/commonTypes";

export const BASE_URL = "http://localhost:8080";

export const login = async (
	identifier: string,
	password: string,
): Promise<AccessTokenResponse> => {
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

export const signup = async (
	name: string,
	username: string,
	email: string,
	password: string,
): Promise<AccessTokenResponse> => {
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
	} catch (error) {}
};

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

export const getUserInfo = async (accessToken: string): Promise<User> => {
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
		throw new Error(String(result?.data) || "Failed to fetch user info");
	}
	return result.data as User;
};
