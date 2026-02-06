import { useAuth } from "@/context/AuthProvider";
import { useStateContext } from "@/context/StateProvider";
import { loginSchema } from "@/lib/validations";
import { login } from "@/services/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
	const { setUser, setAccessToken } = useAuth();
	const { loading, setLoading } = useStateContext();
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
			const res = await login(data.identifier, data.password);
			setAccessToken(res?.accessToken || "");
			toast.success("Login successful!", {
				description: "Welcome back!",
				duration: 2000,
			});
			setResponseMessage("Login successful!");
			setResponseError(false);
		} catch (error) {
			toast.error(
				(error as Error).message || "An error occurred during login",
				{
					description: "Please try again.",
					duration: 2000,
				},
			);
			setResponseMessage((error as Error).message);
			setResponseError(true);
		} finally {
			setLoading(false);
		}
	};

	return <div>LoginForm</div>;
};

export default LoginForm;
