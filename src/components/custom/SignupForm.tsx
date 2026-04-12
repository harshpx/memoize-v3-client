import { useStore } from "@/context/store";
import useDebounce from "@/hooks/useDebounce";
import { signupSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { LuLoaderCircle } from "react-icons/lu";
import {
	checkEmailAvailability,
	checkUsernameAvailability,
	sendVerificationCode,
} from "@/services/apis";
import { toast } from "sonner";
import type { SignupRequest } from "@/lib/commonTypes";
import type z from "zod";
import { signupAndFetchUserInfo } from "@/services/services";
import CustomizableButton from "./CustomizableButton";
import { FaArrowRight as ArrowRight } from "react-icons/fa";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

const SignupForm = () => {
	const { setLoading } = useStore();

	const [inputUsername, setInputUsername] = useState("");
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [usernameMessage, setUsernameMessage] = useState("");

	const [inputEmail, setInputEmail] = useState("");
	const [isCheckingEmail, setIsCheckingEmail] = useState(false);
	const [emailMessage, setEmailMessage] = useState("");

	const debouncedUsername: string = useDebounce(inputUsername, 1000);
	const debouncedEmail: string = useDebounce(inputEmail, 1000);

	const [responseMessage, setResponseMessage] = useState("");
	const [responseError, setResponseError] = useState(false);

	const [otp, setOtp] = useState<string>("");
	const [otpSent, setOtpSent] = useState(false);

	// form controller (entire form state)
	const formController = useForm({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			name: "",
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		mode: "onChange",
		reValidateMode: "onChange",
	});

	useEffect(() => {
		// check username availability
		(async () => {
			if (formController.formState.errors.username) return;
			if (!debouncedUsername) return;
			try {
				setIsCheckingUsername(true);
				const res = await checkUsernameAvailability(debouncedUsername);
				if (res) {
					setUsernameMessage(`${debouncedUsername} is available`);
				} else {
					setUsernameMessage(`${debouncedUsername} is not available`);
				}
			} catch (error) {
				setUsernameMessage(
					(error as Error).message || "Not able to check email, try again",
				);
			} finally {
				setIsCheckingUsername(false);
			}
		})();
	}, [debouncedUsername]);

	useEffect(() => {
		// check email availability
		(async () => {
			if (formController.formState.errors.email) return;
			if (!debouncedEmail) return;
			try {
				setIsCheckingEmail(true);
				const res = await checkEmailAvailability(debouncedEmail);
				if (res) {
					setEmailMessage(`${debouncedEmail} is available`);
				} else {
					setEmailMessage(`${debouncedEmail} is not available`);
				}
			} catch (error) {
				setEmailMessage(
					(error as Error).message || "Not able to check email, try again",
				);
			} finally {
				setIsCheckingEmail(false);
			}
		})();
	}, [debouncedEmail]);

	const handleOTPSend = async () => {
		const usernameErrors =
			!formController.getValues("username") ||
			formController.formState.errors.username ||
			usernameMessage.toLowerCase().includes("not");

		if (usernameErrors) {
			toast.error("Please enter a valid and available username", {
				duration: 2000,
			});
			return;
		}

		const emailErrors =
			!formController.getValues("email") ||
			formController.formState.errors.email ||
			emailMessage.toLowerCase().includes("not");

		if (emailErrors) {
			toast.error("Please enter a valid and available email to receive OTP", {
				duration: 2000,
			});
			return;
		}

		const passwordErrors =
			!formController.getValues("password") ||
			formController.formState.errors.password ||
			!formController.getValues("confirmPassword") ||
			formController.formState.errors.confirmPassword;

		if (passwordErrors) {
			toast.error("Please enter a valid password and confirm it", {
				duration: 2000,
			});
			return;
		}

		try {
			setLoading(true);
			const res = await sendVerificationCode(inputEmail);
			if (res) {
				toast.success("OTP sent to your email", {
					duration: 2000,
				});
				setOtpSent(true);
			}
		} catch (error) {
			toast.error((error as Error).message || "Failed to send OTP, try again", {
				duration: 2000,
			});
			setOtpSent(false);
		} finally {
			setLoading(false);
		}
	};

	const onSubmit = async (data: z.infer<typeof signupSchema>) => {
		if (usernameMessage && usernameMessage.toLowerCase().includes("not"))
			return;
		if (emailMessage && emailMessage.toLowerCase().includes("not")) return;

		if (formController.formState.errors.username) {
			setUsernameMessage(formController.formState.errors.username.toString());
			return;
		}
		if (formController.formState.errors.email) {
			setEmailMessage(formController.formState.errors.email.toString());
			return;
		}

		if (!otp || otp.length !== 6) {
			toast.error("Please enter the 6-digit OTP sent to your email", {
				duration: 2000,
			});
			return;
		}

		try {
			setLoading(true);
			const payload: SignupRequest = {
				verificationCode: otp,
				name: data.name,
				username: data.username,
				email: data.email,
				password: data.password,
			};

			await signupAndFetchUserInfo(payload);

			toast.success("Signup successful!", {
				description: "Welcome aboard!",
				duration: 2000,
			});
		} catch (error) {
			toast.error(
				(error as Error).message || "An error occurred during signup",
				{
					description: "Please try again.",
					duration: 2000,
				},
			);
			setResponseMessage(
				(error as Error).message.substring(0, 100) ||
					"An error occurred during signup",
			);
			setResponseError(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form {...formController}>
			<form
				onSubmit={formController.handleSubmit(onSubmit)}
				className="text-left flex flex-col gap-2 items-center">
				<div className="gap-3 grid grid-cols-1 sm:grid-cols-2 items-start">
					<FormField
						control={formController.control}
						name="name"
						render={({ field }) => (
							<FormItem className="w-full sm:w-50">
								<FormLabel
									className={
										formController.formState.errors.name ? "text-red-600" : ""
									}>
									Name
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="text"
										placeholder="Name"
										className="border-neutral-400 dark:border-neutral-600"
										value={field.value}
										onChange={(e) => {
											field.onChange(e);
											setOtpSent(false);
											setOtp("");
											if (e.target.value) {
												setResponseMessage("");
												setResponseError(false);
											}
										}}
									/>
								</FormControl>
								<FormMessage className="text-red-600 text-[12px]" />
							</FormItem>
						)}
					/>
					<FormField
						control={formController.control}
						name="username"
						render={({ field }) => (
							<FormItem className="w-full sm:w-50">
								<FormLabel
									className={
										formController.formState.errors.username
											? "text-red-600"
											: ""
									}>
									Username
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="text"
										placeholder="Username"
										className="border-neutral-400 dark:border-neutral-600"
										value={field.value}
										onChange={(e) => {
											field.onChange(e);
											setInputUsername(e.target.value);
											setOtpSent(false);
											setOtp("");
											if (e.target.value) {
												setUsernameMessage("");
												setResponseMessage("");
												setResponseError(false);
											}
										}}
									/>
								</FormControl>
								{isCheckingUsername && (
									<LuLoaderCircle className="w-4 aspect-square animate-spin" />
								)}

								{formController.formState.errors.username ? (
									<FormMessage className="text-[12px] text-red-600" />
								) : !isCheckingUsername && usernameMessage ? (
									<p
										className={`text-[12px] ${
											usernameMessage.toLowerCase().includes("not")
												? "text-red-600"
												: "text-green-600"
										}`}>
										{usernameMessage}
									</p>
								) : null}
							</FormItem>
						)}
					/>
					<FormField
						control={formController.control}
						name="email"
						render={({ field }) => (
							<FormItem className="w-full sm:w-50">
								<FormLabel
									className={
										formController.formState.errors.email ? "text-red-600" : ""
									}>
									Email
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="text"
										placeholder="Email"
										className="border-neutral-400 dark:border-neutral-600"
										value={field.value}
										onChange={(e) => {
											field.onChange(e);
											setInputEmail(e.target.value);
											setOtpSent(false);
											setOtp("");
											if (e.target.value) {
												setEmailMessage("");
												setResponseMessage("");
												setResponseError(false);
											}
										}}
									/>
								</FormControl>
								{isCheckingEmail && (
									<LuLoaderCircle className="w-4 aspect-square animate-spin" />
								)}
								{formController.formState.errors.email ? (
									<FormMessage className="text-red-600 text-[12px]" />
								) : !isCheckingEmail && emailMessage ? (
									<p
										className={`text-[12px] ${
											emailMessage.toLowerCase().includes("not")
												? "text-red-600"
												: "text-green-600"
										}`}>
										{emailMessage}
									</p>
								) : null}
							</FormItem>
						)}
					/>
					<FormField
						control={formController.control}
						name="password"
						render={({ field }) => (
							<FormItem className="w-full sm:w-50">
								<FormLabel
									className={
										formController.formState.errors.password
											? "text-red-600"
											: ""
									}>
									Password
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="password"
										placeholder="Password"
										className="border-neutral-400 dark:border-neutral-600"
									/>
								</FormControl>
								<FormMessage className="text-red-600 text-[12px]" />
							</FormItem>
						)}
					/>
					<FormField
						control={formController.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem className="w-full sm:w-50">
								<FormLabel
									className={
										formController.formState.errors.confirmPassword
											? "text-red-600"
											: ""
									}>
									Confirm Password
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="password"
										placeholder="Confirm Password"
										className="border-neutral-400 dark:border-neutral-600"
									/>
								</FormControl>
								<FormMessage className="text-red-600 text-[12px]" />
							</FormItem>
						)}
					/>
				</div>
				{/* buttons / otp */}
				{responseMessage && (
					<div
						className={`text-center text-sm ${responseError ? "text-red-600" : "text-green-600"}`}>
						{responseMessage}
					</div>
				)}
				{!otpSent && (
					<CustomizableButton
						type="button"
						onClick={handleOTPSend}
						className="
							border border-accent-light/50 dark:border-accent-dark/40 
							shadow-2xl bg-accent-light/40 dark:bg-accent-light/30
							hover:border-accent-light dark:hover:border-accent-dark 
							hover:bg-accent-light dark:hover:bg-accent-dark hover:text-white
							transition-colors mt-6
						">
						{" "}
						<span className="text-sm">Send OTP</span>
					</CustomizableButton>
				)}
				{otpSent && (
					<div className="flex flex-col items-start justify-center gap-1 mt-4">
						<div className="text-[14px] font-medium">One time password</div>
						<InputOTP maxLength={6} onChange={(val) => setOtp(val)} value={otp}>
							<InputOTPGroup>
								<InputOTPSlot index={0} />
								<InputOTPSlot index={1} />
								<InputOTPSlot index={2} />
								<InputOTPSlot index={3} />
								<InputOTPSlot index={4} />
								<InputOTPSlot index={5} />
							</InputOTPGroup>
						</InputOTP>
					</div>
				)}

				{otpSent && (
					<CustomizableButton
						type="submit"
						className="
						border border-accent-light/50 dark:border-accent-dark/40 
						shadow-2xl bg-accent-light/40 dark:bg-accent-light/30
						hover:border-accent-light dark:hover:border-accent-dark 
						hover:bg-accent-light dark:hover:bg-accent-dark hover:text-white
						transition-colors mt-6
					">
						<div className="flex items-center gap-2">
							<span className="text-sm">Signup</span>
							<ArrowRight size={14} className="" />
						</div>
					</CustomizableButton>
				)}
			</form>
		</Form>
	);
};

export default SignupForm;
