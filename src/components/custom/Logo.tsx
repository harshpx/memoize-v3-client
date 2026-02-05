import { cn } from "@/lib/utils";
import { LuNotebookPen as MemoizeIcon } from "react-icons/lu";

interface LogoProps {
	className?: string;
}

const Logo = ({ className }: LogoProps) => {
	return (
		<div
			className={cn(
				"flex gap-2 items-center justify-center text-white",
				className,
			)}>
			<MemoizeIcon className="text-2xl"/>
			<span className="text-xl font-light">Memoize</span>
		</div>
	);
};

export default Logo;
