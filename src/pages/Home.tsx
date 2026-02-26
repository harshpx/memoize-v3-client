import CustomizableButton from "@/components/custom/CustomizableButton";
import ThemeSwitch from "@/components/custom/ThemeSwitch";
import { useStore } from "@/context/store";
import { type FC } from "react";
import { FaArrowRight as ArrowRight } from "react-icons/fa";
import {
	LuNotebookPen,
	LuListChecks,
	LuCalendarDays,
	LuCodeXml,
	LuBrain,
	LuCalendarSearch,
	LuFileCode,
	LuFileText,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const Home: FC = () => {
	const navigate = useNavigate();
	const theme = useStore((state) => state.theme);
	return (
		<div className="h-screen w-full flex flex-col gap-4 items-center justify-center overflow-hidden relative">
			<div className="absolute right-2 top-2">
				<ThemeSwitch />
			</div>
			<div className="flex flex-col items-center">
				<div className="text-3xl md:text-4xl font-light">Welcome to</div>
				<div className="text-6xl md:text-7xl font-medium text-accent-light dark:text-accent-dark">
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
			{/* bg */}
			<div className="absolute h-screen min-w-screen p-5 flex gap-10 flex-wrap justify-center -z-40">
				{Array.from({ length: 100 }, (_, i) => i)
					// .sort(() => Math.random() - 0.5)
					.map((idx) => {
						const type = (idx % 8) + 1;
						const randomNumber = (Math.random() + Number.EPSILON) % 1;
						const rotation = randomNumber * 30 - 15;
						const size = randomNumber * 70 + 30;
						const marginTop = randomNumber * 100 - 50;

						const commonProps = {
							key: idx,
							style: {
								opacity: theme === "dark" ? 0.1 : 0.2,
								marginTop: `${marginTop}px`,
								rotate: `${rotation}deg`,
								width: `${size}px`,
								height: `${size}px`,
								color:
									theme === "dark"
										? "var(--accent-light)"
										: "var(--accent-dark)",
							} as React.CSSProperties,
						};
						switch (type) {
							case 1:
								return <LuNotebookPen {...commonProps} />;
							case 2:
								return <LuCalendarDays {...commonProps} />;
							case 3:
								return <LuListChecks {...commonProps} />;
							case 4:
								return <LuCodeXml {...commonProps} />;
							case 5:
								return <LuBrain {...commonProps} />;
							case 6:
								return <LuCalendarSearch {...commonProps} />;
							case 7:
								return <LuFileCode {...commonProps} />;
							case 8:
								return <LuFileText {...commonProps} />;
							default:
								return <div key={idx}></div>;
						}
					})}
			</div>
		</div>
	);
};

export default Home;
