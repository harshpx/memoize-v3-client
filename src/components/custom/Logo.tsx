import { cn } from "@/lib/utils";
import { LuNotebookPen as MemoizeIcon } from "react-icons/lu";

interface LogoProps {
	className?: string;
	iconOnly?: boolean;
}

const Logo = ({ className, iconOnly = false }: LogoProps) => {
	return (
		<div
			className={cn(
				"flex gap-2 items-center justify-center text-white",
				className,
			)}>
			<MemoizeIcon className="text-2xl" />
			{!iconOnly && (
				<span className="text-lg text-nowrap truncate">Memoize</span>
			)}
		</div>
	);
};

export default Logo;
