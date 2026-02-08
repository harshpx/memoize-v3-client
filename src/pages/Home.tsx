import CustomizableButton from "@/components/custom/CustomizableButton";
import ThemeSwitch from "@/components/custom/ThemeSwitch";
import { type FC } from "react";
import { FaArrowRight as ArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home: FC = () => {
	const navigate = useNavigate();
	return (
		<div className="h-screen w-full flex flex-col gap-4 items-center justify-center">
			<div className="absolute right-2 top-2">
				<ThemeSwitch />
			</div>
			<div className="flex flex-col items-center">
				<div className="text-3xl md:text-4xl font-light">Welcome to</div>
				<div className="text-6xl md:text-7xl font-light text-accent-light dark:text-accent-dark">
					Memoize
				</div>
			</div>
			<CustomizableButton
				className="
          border border-accent-light/50 dark:border-accent-dark/40 
					shadow-2xl bg-accent-light/40 dark:bg-accent-light/30
          hover:border-accent-light dark:hover:border-accent-dark 
          hover:bg-accent-light dark:hover:bg-accent-dark hover:text-white
          transition-colors
        "
				onClick={() => navigate("/auth")}>
				<div className="flex items-center gap-2">
					<span className="text-sm">Get Started</span>
					<ArrowRight size={14} className="" />
				</div>
			</CustomizableButton>
		</div>
	);
};

export default Home;
