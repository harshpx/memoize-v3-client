import { cn } from "@/lib/utils";

export interface CustomizableButtonProps {
	children?: React.ReactNode;
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
	type?: "button" | "submit" | "reset";
}

const CustomizableButton = ({
	children,
	onClick,
	className,
	disabled = false,
	type = "button",
}: CustomizableButtonProps) => {
	return (
		<button
			type={type}
			disabled={disabled}
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
