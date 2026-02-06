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

export interface AuthResponse {
	accessToken: string;
	user: User;
}

export interface AccessTokenResponse {
	accessToken: string;
	userId?: string;
}
