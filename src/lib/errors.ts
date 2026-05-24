export class AuthError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AuthError";
	}
}

export class AcceptableError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AcceptableError";
	}
}
