import { useEffect, useState } from "react";
import { Network } from "@capacitor/network";

export const useNativeNetworkMonitor = () => {
	const [isOnline, setIsOnline] = useState(true);

	useEffect(() => {
		const logCurrentNetworkStatus = async () => {
			const status = await Network.getStatus();
			setIsOnline(status.connected);
		};

		logCurrentNetworkStatus();

		const listener = Network.addListener("networkStatusChange", (status) => {
			setIsOnline(status.connected);
		});

		return () => {
			listener.then((l) => l.remove());
		};
	}, []);

	return isOnline;
};
