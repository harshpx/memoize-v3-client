import { type FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import Notes from "./pages/Notes";
import Tasks from "./pages/Tasks";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./pages/DashboardLayout";
import { Toaster } from "./components/ui/sonner";
import ThemeInit from "./components/wrapper/ThemeInit";
import AuthInit from "./components/wrapper/AuthInit";
import PublicRoute from "./components/wrapper/PublicRoute";
import ProtectedRoute from "./components/wrapper/ProtectedRoute";
import NotePage from "./pages/NotePage";

const App: FC = () => {
	return (
		<ThemeInit>
			<AuthInit>
				<BrowserRouter>
					<Routes>
						<Route element={<PublicRoute />}>
							<Route path="/" element={<Home />} />
							<Route path="/auth" element={<Auth />} />
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route path="/dashboard" element={<DashboardLayout />}>
								<Route index element={<Dashboard />} />
								<Route path="notes" element={<Notes />} />
								<Route path="notes/:noteId" element={<NotePage />} />
								<Route path="tasks" element={<Tasks />} />
							</Route>
						</Route>
						<Route path="*" element={<NotFound />} />
					</Routes>
					<Toaster />
				</BrowserRouter>
			</AuthInit>
		</ThemeInit>
	);
};

export default App;
