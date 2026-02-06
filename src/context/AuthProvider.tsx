import type { User } from "@/lib/commonTypes";
import { createContext, useContext, useState, type ReactNode } from "react";


const AuthContext = createContext({
	accessToken: "",
	setAccessToken: (_: string) => {},
	user: null as User | null,
	setUser: (_: User | null) => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [accessToken, setAccessToken] = useState<string>("");
	const [user, setUser] = useState<User | null>(null);

	return (
		<AuthContext.Provider
			value={{ accessToken, setAccessToken, user, setUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
