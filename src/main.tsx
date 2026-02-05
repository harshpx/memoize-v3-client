import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App.tsx";
import ThemeProvider from "@/context/ThemeProvider.tsx";
import StateProvider from "@/context/StateProvider.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<StateProvider>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</StateProvider>
	</StrictMode>,
);
