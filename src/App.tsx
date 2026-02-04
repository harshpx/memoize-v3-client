import type { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import Header from "@/components/custom/Header";

const App: FC = () => {
	return (
		<BrowserRouter>
      <Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/auth" element={<Auth />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
