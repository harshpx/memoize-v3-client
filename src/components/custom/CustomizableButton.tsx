import { cn } from "@/lib/utils";

export interface CustomizableButtonProps {
	children?: React.ReactNode;
	onClick?: () => void;
	className?: string;
}

const CustomizableButton = ({
	children,
	onClick,
	className,
}: CustomizableButtonProps) => {
	return (
		<button
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
