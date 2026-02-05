/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, useState, type ReactNode } from "react";

const StateContext = createContext({
	loading: false,
	setLoading: (_: boolean) => {},
});

const StateProvider = ({ children }: { children: ReactNode }) => {
	const [loading, setLoading] = useState(false);

	return (
		<StateContext.Provider value={{ loading, setLoading }}>
			{children}
		</StateContext.Provider>
	);
};

export const useStateContext = () => useContext(StateContext);

export default StateProvider;
