import BgIcons from "@/components/custom/BgIcons";
import CustomizableButton from "@/components/custom/CustomizableButton";
import ThemeSwitch from "@/components/custom/ThemeSwitch";
import { type FC } from "react";
import { FaArrowRight as ArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/context/store";
import Logo from "@/components/custom/Logo";

const LandingPage: FC = () => {
	const theme = useStore((state) => state.theme);
	const navigate = useNavigate();
	return (
		<div className="h-dvh w-full flex flex-col gap-4 items-center justify-center overflow-hidden relative">
			<div className="absolute right-2 top-2">
				<ThemeSwitch />
			</div>
			<div className="flex flex-col items-center gap-4">
				<div className="text-3xl md:text-4xl text-black dark:text-white">
					Welcome to
				</div>
				<Logo
					darkText={theme === "light"}
					iconDivClassName="text-6xl"
					textDivClassName="text-6xl font-bold"
				/>
			</div>
			<CustomizableButton
				className="
          border-2 border-white dark:border-black
					text-white dark:text-black
					shadow-2xl bg-accent-dark
					hover:brightness-110
          transition-colors
        "
				onClick={() => navigate("/auth")}>
				<div className="flex items-center gap-2">
					<span className="text-base font-medium">Get Started</span>
					<ArrowRight size={14} className="" />
				</div>
			</CustomizableButton>
			<BgIcons className="text-accent-dark dark:text-accent-light/80" />
		</div>
	);
};

export default LandingPage;
