import LoginForm from "@/components/custom/LoginForm";
import Logo from "@/components/custom/Logo";
import SignupForm from "@/components/custom/SignupForm";
import ThemeSwitch from "@/components/custom/ThemeSwitch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useState, type FC } from "react";
import { motion } from "motion/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useStateContext } from "@/context/StateProvider";
import Loader from "@/components/custom/Loader";

const tabs = [
	{
		value: "login",
		label: "Login",
		description: "Login with your Username or Email",
		content: <LoginForm />,
		footer: {
			text: "First time?",
			link: "Signup!",
		},
		initial: { x: 50, opacity: 0 },
		animate: { x: 0, opacity: 1 },
		transition: { duration: 0.3 },
	},
	{
		value: "signup",
		label: "Signup",
		description: "Enter your credentials to signup",
		content: <SignupForm />,
		footer: {
			text: "Already registered?",
			link: "Login!",
		},
		initial: { x: -50, opacity: 0 },
		animate: { x: 0, opacity: 1 },
		transition: { duration: 0.3 },
	},
];

const Auth: FC = () => {
	const isLargeScreen = useMediaQuery("(min-width: 1024px)");
	const { loading } = useStateContext();
	const [activePage, setActivePage] = useState("login");
	return (
		<div className="relative h-screen w-full flex flex-col items-center justify-center transition-all duration-400 ease-in">
			{loading && <Loader />}
			<div
				className={`${isLargeScreen ? "absolute top-0 left-0" : "bg-linear-to-l from-accent-dark to-accent-light"} px-4 py-4 w-full flex items-center justify-between ${activePage === "signup" && isLargeScreen ? "" : "flex-row-reverse"}`}>
				<ThemeSwitch buttonStyle={isLargeScreen ? "accent" : "themed"} />
				{!isLargeScreen && <Logo className="dark:text-black" />}
			</div>
			<div
				className={`grow flex justify-center items-stretch w-full p-4 py-5 transition-all duration-400 ease-in ${!isLargeScreen ? "bg-linear-to-l from-accent-dark to-accent-light" : ""}`}>
				{isLargeScreen && (
					<div
						className={`z-20 relative w-1/2 bg-linear-to-b from-accent-dark to-accent-dark/90 rounded-2xl flex flex-col items-center justify-center gap-4 transition-transform duration-500 ease-in-out ${activePage === "signup" && isLargeScreen ? "translate-x-full" : "translate-x-0"}`}>
						<div className="absolute top-4 left-4">
							<Logo />
						</div>
						<p className="text-5xl text-white text-center font-extralight">
							{activePage === "login" ? "Welcome back to" : "Get started with"}
						</p>
						<div className="text-5xl text-white font-semibold">Memoize</div>
						<p className="font-extralight text-white w-2/3 text-center">
							{activePage === "login"
								? "Pick up right where you left off — your notes, tasks, and code are waiting."
								: "Build your second brain with Memoize: Capture ideas, manage tasks, save code, and keep everything connected."}
						</p>
						<div className="absolute bottom-10 w-full flex items-center justify-center gap-2 text-[14px] text-white">
							<p>
								{activePage === "login"
									? "Don't have an account?"
									: "Have an account already?"}
							</p>
							<Button
								onClick={() => {
									setActivePage(activePage === "login" ? "signup" : "login");
								}}
								className="bg-transparent text-white border border-white dark:border-white hover:bg-white/20">
								{activePage === "login" ? "Signup" : "Login"}
							</Button>
							<p>
								{activePage === "login" ? "to get started!" : "and continue!"}
							</p>
						</div>
					</div>
				)}
				<div
					className={`
            ${isLargeScreen ? "w-1/2 self-center" : "w-full sm:w-150 self-start"} 
            flex flex-col items-center justify-center py-4 rounded-xl
            transition-transform duration-100 ease-in-out 
            ${isLargeScreen ? "bg-none" : "bg-white dark:bg-[#1e1e1e]"}
            ${activePage === "signup" && isLargeScreen ? "-translate-x-full" : "translate-x-0"}
          `}>
					{!isLargeScreen && (
						<div className="flex flex-col gap-2 items-center justify-center">
							<p className="text-2xl font-extralight">
								{activePage === "login"
									? "Welcome back to"
									: "Get started with"}
							</p>

							<div className="text-3xl font-semibold">Memoize</div>
						</div>
					)}
					<Tabs
						value={activePage}
						onValueChange={setActivePage}
						className="p-4 w-full sm:w-150 flex flex-col items-center">
						{!isLargeScreen && (
							<TabsList className="grid grid-cols-2 w-full sm:w-100 h-10">
								{tabs.map((tab, key) => (
									<TabsTrigger className="" key={key} value={tab.value}>
										{tab.label}
									</TabsTrigger>
								))}
							</TabsList>
						)}
						{tabs.map((tab, key) => (
							<TabsContent key={key} value={tab?.value} className="w-full">
								<motion.div
									initial={tab.initial}
									animate={tab.animate}
									transition={tab.transition}>
									<Card className="border-none bg-transparent shadow-none">
										<CardHeader className="text-center">
											<CardTitle className="text-xl">{tab?.label}</CardTitle>
											<CardDescription className="flex flex-col gap-1">
												<span>{tab?.description}</span>
											</CardDescription>
										</CardHeader>
										<CardContent className="flex items-center justify-center">
											{tab?.content}
										</CardContent>
										<CardFooter className="justify-center">
											<div className="flex gap-1 text-[14px]">
												<div>{tab?.footer?.text}</div>
												<div
													className="text-accent-dark cursor-pointer hover:underline"
													onClick={() =>
														setActivePage(
															tab?.value === "login" ? "signup" : "login",
														)
													}>
													{tab?.footer?.link}
												</div>
											</div>
										</CardFooter>
									</Card>
								</motion.div>
							</TabsContent>
						))}
					</Tabs>
				</div>
			</div>
		</div>
	);
};

export default Auth;
