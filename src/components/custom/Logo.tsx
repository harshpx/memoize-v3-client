import { cn } from "@/lib/utils";
import { LuBotMessageSquare, LuCalendar, LuNotebookPen } from "react-icons/lu";

interface LogoProps {
	outerDivClassName?: string;
	iconDivClassName?: string;
	textDivClassName?: string;
	className?: string;
	iconOnly?: boolean;
	darkText?: boolean;
	onClick?: () => void;
}

const Logo = ({
	outerDivClassName,
	iconDivClassName,
	textDivClassName,
	iconOnly = false,
	darkText = false,
	onClick,
}: LogoProps) => {
	return (
		<div
			onClick={onClick}
			className={cn(
				"flex flex-col gap-1 items-center justify-center",
				darkText ? "text-black" : "text-white",
				outerDivClassName,
			)}>
			<div
				className={cn(
					"flex gap-1 items-center justify-center",
					iconDivClassName,
				)}>
				<div className="flex gap-1">
					<LuNotebookPen />
					<LuBotMessageSquare />
				</div>
				<LuCalendar />
			</div>
			{!iconOnly && (
				<span className={cn("text-lg text-nowrap truncate", textDivClassName)}>
					Memoize
				</span>
			)}
		</div>
	);
};

export default Logo;
