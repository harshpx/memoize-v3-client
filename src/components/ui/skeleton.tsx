import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="skeleton"
			className={cn("bg-muted rounded-md animate-pulse -z-10", className)}
			{...props}
		/>
	);
}

export { Skeleton };
