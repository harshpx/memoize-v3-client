import { useNativeNetworkMonitor } from "@/hooks/useNativeNetworkMonitor";
import { cn } from "@/lib/utils";

const NativeNetworkMonitor = () => {
	const isOnline = useNativeNetworkMonitor();
	if (isOnline) {
		return null;
	}
	return (
		<div
			className={cn(
				"z-50 absolute top-0 left-0 h-[100dvh] w-[100dvw] flex items-center justify-center",
				"bg-white dark:bg-black text-black dark:text-white text-center",
			)}>
			You are offline, please check your network connection.
		</div>
	);
};

export default NativeNetworkMonitor;
