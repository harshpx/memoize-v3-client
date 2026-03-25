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
	verificationCode: string;
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

export interface Note {
	id: string;
	content: string;
	preview: string;
	createdAt: string;
	updatedAt: string;
	isArchived: boolean;
	isDeleted: boolean;
	deletedAt?: string;
}

export interface NoteModifyRequest {
	content: string;
	preview: string;
}

export interface Event {
	id: string;
	title: string;
	start: string;
	end: string;
	eventType: string;
	description?: string;
	location?: string;
	isArchived: boolean;
	isDeleted: boolean;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}

export interface EventModifyRequest {
	title: string;
	start: string;
	end: string;
	eventType: string;
	description?: string;
	location?: string;
}

export interface PageRequest {
	page?: number;
	size?: number;
	deleted?: boolean;
	archived?: boolean;
}

export interface Page<T> {
	content: T[]; // content
	empty: boolean; // is page empty
	first: boolean; // is first page
	last: boolean; // is last page
	number: number; // page number
	numberOfElements: number; // number of elements inside
	size: number; // max size per page
	totalElements: number; // total number of elements
	totalPages: number; // total number of pages
}
