import { useStore } from "@/context/store";
import {
	LuCircleCheck as CircleCheckIcon,
	LuInfo as InfoIcon,
	LuLoader as LoaderIcon,
	LuOctagonX as OctagonXIcon,
	LuTriangleAlert as TriangleAlertIcon,
} from "react-icons/lu";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme } = useStore();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			icons={{
				success: <CircleCheckIcon className="size-4" />,
				info: <InfoIcon className="size-4" />,
				warning: <TriangleAlertIcon className="size-4" />,
				error: <OctagonXIcon className="size-4" />,
				loading: <LoaderIcon className="size-4 animate-spin" />,
			}}
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
					"--border-radius": "var(--radius)",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
