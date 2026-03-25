import BgIcons from "@/components/custom/BgIcons";
import CustomizableButton from "@/components/custom/CustomizableButton";
import ThemeSwitch from "@/components/custom/ThemeSwitch";
import { type FC } from "react";
import { FaArrowRight as ArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LandingPage: FC = () => {
	const navigate = useNavigate();
	return (
		<div className="h-dvh w-full flex flex-col gap-4 items-center justify-center overflow-hidden relative">
			<div className="absolute right-2 top-2">
				<ThemeSwitch buttonStyle="themed" />
			</div>
			<div className="flex flex-col items-center">
				<div className="text-3xl md:text-4xl font-light text-white dark:text-black">
					Welcome to
				</div>
				<div className="text-6xl md:text-7xl font-medium text-white dark:text-black">
					Memoize
				</div>
			</div>
			<CustomizableButton
				className="
          border-2 border-white dark:border-black
					text-white dark:text-black
					shadow-2xl bg-accent-light/40 dark:bg-accent-light/30
					hover:brightness-150
          transition-colors
        "
				onClick={() => navigate("/auth")}>
				<div className="flex items-center gap-2">
					<span className="text-base font-medium">Get Started</span>
					<ArrowRight size={14} className="" />
				</div>
			</CustomizableButton>
			<BgIcons className="text-white dark:text-black bg-accent-dark" />
		</div>
	);
};

export default LandingPage;
