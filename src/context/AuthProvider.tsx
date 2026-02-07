import type { User } from "@/lib/commonTypes";
import { getUserInfo } from "@/services/apis";
import { registerAuthListener } from "@/services/authBridge";
import { retryWithRefresh } from "@/services/services";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";

const AuthContext = createContext({
	accessToken: null as string | null,
	user: null as User | null,
	init: false as boolean,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [init, setInit] = useState(false);

	useEffect(() => {
		const unregister = registerAuthListener(
			(token) => setAccessToken(token),
			(user) => setUser(user),
		);

		// On initial load, fetch user info
		// will succeed if there's a valid refresh token
		// and fail if not, in which case we clear the auth state
		(async () => {
			try {
				const user: User = await retryWithRefresh(getUserInfo, []);
				setUser(user);
			} catch (error) {
				if (error instanceof Error) {
					console.error("Failed to fetch user info:", error.message);
				}
				setUser(null);
				setAccessToken(null);
			} finally {
				setInit(true);
			}
		})();

		return () => {
			unregister();
		};
	}, []);

	return (
		<AuthContext.Provider value={{ accessToken, user, init }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
