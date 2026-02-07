export interface ApiSuccess<T> {
	success: true;
	data: T;
	timestamp: string;
}
export interface ApiError {
	success: false;
	data: string; // error message
	timestamp: string;
}
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface User {
	id: string;
	name: string;
	username: string;
	email: string;
	avatarUrl?: string;
	role?: string;
}

export interface LoginRequest {
	identifier: string; // can be username or email
	password: string;
}

export interface SignupRequest {
	name: string;
	username: string;
	email: string;
	password: string;
}

export interface AuthResponse {
	accessToken: string;
	userId: string;
}

export interface AccessTokenResponse {
	accessToken: string;
	userId?: string;
}
