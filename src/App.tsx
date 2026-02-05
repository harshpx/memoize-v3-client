import type { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import ThemeSwitch from "./components/custom/ThemeSwitch";
import Notes from "./pages/Notes";
import Tasks from "./pages/Tasks";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./pages/DashboardLayout";

const App: FC = () => {
	return (
		<BrowserRouter>
			<div className="absolute right-2 top-2">
				<ThemeSwitch />
			</div>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/auth" element={<Auth />} />
				<Route path="/dashboard" element={<DashboardLayout />}>
					<Route index element={<Dashboard />} />
					<Route path="notes" element={<Notes />} />
					<Route path="tasks" element={<Tasks />} />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
