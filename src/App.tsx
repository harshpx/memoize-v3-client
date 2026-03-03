import { type FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import Notes from "./pages/Notes";
import HomePage from "./pages/HomePage";
import HomeLayout from "./pages/HomeLayout";
import { Toaster } from "./components/ui/sonner";
import ThemeInit from "./components/wrapper/ThemeInit";
import AuthInit from "./components/wrapper/AuthInit";
import PublicRoute from "./components/wrapper/PublicRoute";
import ProtectedRoute from "./components/wrapper/ProtectedRoute";
import NotePage from "./pages/NotePage";
import Events from "./pages/Events";
import Trash from "./pages/Trash";
import OAuth2Redirect from "./pages/OAuth2Redirect";

const App: FC = () => {
	return (
		<ThemeInit>
			<AuthInit>
				<BrowserRouter>
					<Routes>
						<Route element={<PublicRoute />}>
							<Route path="/" element={<LandingPage />} />
							<Route path="/auth" element={<Auth />} />
							<Route path="/oauth2redirect" element={<OAuth2Redirect />} />
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route path="/home" element={<HomeLayout />}>
								<Route index element={<HomePage />} />
								<Route path="notes" element={<Notes />} />
								<Route path="notes/editor" element={<NotePage />} />
								<Route path="events" element={<Events />} />
								<Route path="trash" element={<Trash />} />
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
