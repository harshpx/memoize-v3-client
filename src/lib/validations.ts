import { z } from "zod";

export const usernameValidation = z
	.string()
	.min(3, { message: "Username should be longer than 2 characters" })
	.max(10, { message: "Username should be shorter than 11 characters" })
	.regex(/^[a-zA-Z0-9_.]*$/, {
		message:
			"Username should contain only letters, numbers, underscores and dots",
	});

export const emailValidation = z.email();

// Validation schema for login form
export const loginSchema = z
	.object({
		identifier: z.string(),
		password: z
			.string()
			.min(3, { message: "Password should be greater than 3 characters" })
			.max(20, { message: "Password should be less than 21 characters" }),
	})
	.refine(
		(data) => {
			const emailRegex =
				/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
			if (data.identifier.includes("@")) {
				return emailRegex.test(data.identifier);
			} else {
				return data.identifier.length > 2;
			}
		},
		{
			message: "Enter a valid username or email",
			path: ["identifier"],
		},
	);

// Validation schema for signup form
export const signupSchema = z
	.object({
		username: usernameValidation,
		email: emailValidation,
		password: z
			.string()
			.min(3, { message: "Password should be greater than 3 characters" })
			.max(20, { message: "Password should be less than 21 characters" }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});
