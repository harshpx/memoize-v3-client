import { Button } from "@/components/ui/button";
import { type CSSProperties, type FC } from "react";
import { LuMoon as Moon, LuSunMedium as Sun } from "react-icons/lu";
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "../ui/switch";
import { ACCENTS, getAccentColor } from "@/lib/utils";
import { useStore, type Accent } from "@/context/store";

interface ThemeSwitchProps {
	buttonStyle?: "accent" | "themed";
}

const styleMap = {
	accent:
		"bg-accent-light hover:bg-accent-light/80 dark:bg-accent-dark dark:hover:bg-accent-dark/80 text-white",
	themed:
		"bg-white dark:bg-black hover:bg-white/80 hover:dark:bg-black/80 text-accent-dark",
};

const ThemeSwitch: FC<ThemeSwitchProps> = ({ buttonStyle = "accent" }) => {
	const { theme, setTheme, setAccent } = useStore();

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					className={`rounded-full p-2 cursor-pointer box-border ${styleMap[buttonStyle]}`}>
					{theme === "dark" ? <Sun /> : <Moon />}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="border-accent-dark border mr-1">
				<PopoverHeader>
					<PopoverHeader>Accent & Theme</PopoverHeader>
					<div className="w-full flex flex-col gap-2 mt-2">
						<PopoverDescription>Toggle theme</PopoverDescription>
						<div className="flex gap-2 mt-1">
							<Switch
								size="lg"
								checked={theme === "dark"}
								onCheckedChange={toggleTheme}
							/>
							<span>{theme === "dark" ? "Dark" : "Light"}</span>
						</div>
					</div>
					<div className="w-full flex flex-col gap-2 mt-2">
						<PopoverDescription>Set Accent</PopoverDescription>
						<div className="flex gap-2 flex-wrap">
							{ACCENTS.map((acc: Accent) => {
								const accentColor = getAccentColor(acc, theme);
								return (
									<div
										key={acc}
										style={{ "--accent": accentColor } as CSSProperties}
										onClick={() => setAccent(acc)}
										className="h-10 w-10 rounded-full border bg-accent cursor-pointer"></div>
								);
							})}
						</div>
					</div>
				</PopoverHeader>
			</PopoverContent>
		</Popover>
	);
};

export default ThemeSwitch;
