import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { App as NativeApp } from "@capacitor/app";
import type { PluginListenerHandle } from "@capacitor/core";

export const useNativeBackButton = () => {
	const navigate = useNavigate();

	useEffect(() => {
		let isMounted = true;
		let listener: PluginListenerHandle | null = null;

		const setupListener = async () => {
			const activeListener = await NativeApp.addListener("backButton", () => {
				if (window.history.state && window.history.state.idx === 0) {
					NativeApp.exitApp();
				} else {
					navigate(-1);
				}
			});

			if (!isMounted) {
				activeListener.remove();
			} else {
				listener = activeListener;
			}
		};

		setupListener();

		return () => {
			isMounted = false;
			if (listener) {
				listener.remove();
			}
		};
	}, [navigate]);
};
