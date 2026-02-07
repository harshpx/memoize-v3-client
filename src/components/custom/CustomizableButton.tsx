import { cn } from "@/lib/utils";

export interface CustomizableButtonProps {
	children?: React.ReactNode;
	onClick?: () => void;
	className?: string;
	type?: "button" | "submit" | "reset";
}

const CustomizableButton = ({
	children,
	onClick,
	className,
	type = "button",
}: CustomizableButtonProps) => {
	return (
		<button
			type={type}
			className={cn(
				"rounded-xl px-3 py-2 flex items-center justify-center cursor-pointer",
				className,
			)}
			onClick={onClick}>
			{children}
		</button>
	);
};

export default CustomizableButton;
