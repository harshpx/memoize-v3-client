import { loginSchema } from "@/lib/validations";
import { loginAndFetchUserInfo } from "@/services/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import CustomizableButton from "./CustomizableButton";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { FaArrowRight as ArrowRight } from "react-icons/fa";
import { useStore } from "@/context/store";

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
	const navigate = useNavigate();
	const { setLoading } = useStore();
	const [responseMessage, setResponseMessage] = useState("");
	const [responseError, setResponseError] = useState(false);

	const formController = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			identifier: "",
			password: "",
		},
		mode: "onChange",
		reValidateMode: "onChange",
	});

	const onSubmit = async (data: LoginFormData) => {
		try {
			setLoading(true);
			await loginAndFetchUserInfo(data);
			navigate("/dashboard", { replace: true });
			toast.success("Welcome back to Memoize!", {
				description: "Login successful! Redirecting to dashboard...",
				duration: 2000,
			});
		} catch (error) {
			let errorMessage: string =
				"An error occurred during login. Please try again.";
			if (error instanceof Error) errorMessage = error.message;
			setResponseMessage(errorMessage);
			setResponseError(true);
			toast.error("Login failed", {
				description: errorMessage,
				duration: 2000,
			});
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
						name="identifier"
						render={({ field }) => (
							<FormItem className="w-50">
								<FormLabel
									className={
										formController.formState.errors.identifier
											? "text-red-600"
											: ""
									}>
									Username or Email
								</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder="Enter your username or email"
										className="border-neutral-400 dark:border-neutral-600"
										value={field.value}
										onChange={(e) => {
											field.onChange(e.target.value);
											setResponseMessage("");
											setResponseError(false);
										}}
									/>
								</FormControl>
								<FormMessage className="text-[12px] text-red-600" />
							</FormItem>
						)}
					/>
					<FormField
						control={formController.control}
						name="password"
						render={({ field }) => (
							<FormItem className="w-50">
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
										type="password"
										placeholder="Password"
										className="border-neutral-400 dark:border-neutral-600"
										value={field.value}
										width={400}
										onChange={(e) => {
											field.onChange(e.target.value);
											setResponseMessage("");
											setResponseError(false);
										}}
									/>
								</FormControl>
								<FormMessage className="text-[12px] text-red-600" />
							</FormItem>
						)}
					/>
				</div>
				{responseMessage && (
					<div
						className={`text-center text-sm ${responseError ? "text-red-600" : "text-green-600"}`}>
						{responseMessage}
					</div>
				)}
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
						<span className="text-sm">Get Started</span>
						<ArrowRight size={14} className="" />
					</div>
				</CustomizableButton>
			</form>
		</Form>
	);
};

export default LoginForm;
