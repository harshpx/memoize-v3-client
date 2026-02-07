import type { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import Notes from "./pages/Notes";
import Tasks from "./pages/Tasks";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./pages/DashboardLayout";
import { Toaster } from "./components/ui/sonner";
import StateProvider from "./context/StateProvider";
import ThemeProvider from "./context/ThemeProvider";
import AuthProvider from "./context/AuthProvider";
import ProtectedRoute from "./components/wrapper/ProtectedRoute";
import PublicRoute from "./components/wrapper/PublicRoute";
import AuthInit from "./components/wrapper/AuthInit";

const App: FC = () => {
	return (
		<StateProvider>
			<ThemeProvider>
				<AuthProvider>
					<BrowserRouter>
						<AuthInit>
							<Routes>
								<Route
									path="/"
									element={
										<PublicRoute>
											<Home />
										</PublicRoute>
									}
								/>
								<Route
									path="/auth"
									element={
										<PublicRoute>
											<Auth />
										</PublicRoute>
									}
								/>
								<Route
									path="/dashboard"
									element={
										<ProtectedRoute>
											<DashboardLayout />
										</ProtectedRoute>
									}>
									<Route index element={<Dashboard />} />
									<Route path="notes" element={<Notes />} />
									<Route path="tasks" element={<Tasks />} />
								</Route>
								<Route path="*" element={<NotFound />} />
							</Routes>
						</AuthInit>
						<Toaster />
					</BrowserRouter>
				</AuthProvider>
			</ThemeProvider>
		</StateProvider>
	);
};

export default App;
