import { useStore, type Entity, type EntityState } from "@/context/store";
import type {
	EventModifyRequest,
	LoginRequest,
	Note,
	NoteModifyRequest,
	Page,
	SignupRequest,
	User,
} from "@/lib/commonTypes";
import { AuthError } from "@/lib/errors";
import { entityTypeToName } from "@/lib/utils";
import {
	createNote,
	fetchNotes,
	getUserInfo,
	login,
	logout,
	permanentlyDeleteNote,
	refresh,
	restoreNote,
	signup,
	softDeleteNote,
	updateNote,
} from "@/services/apis";
import { toast } from "sonner";

const updateAuthState = (accessToken: string | null, user: User | null) => {
	useStore.getState().setAuth(accessToken, user);
};

/**
 * @access public
 * @param {LoginRequest} loginRequest
 * @returns {Promise<void>}
 * @description Logs in the user and fetches their information.
 * Sets the access token and user in the auth context.
 * @throws {Error} If login fails or fetching user info fails.
 */
export const loginAndFetchUserInfo = async (
	loginRequest: LoginRequest,
): Promise<void> => {
	const { accessToken } = await login(loginRequest);
	updateAuthState(accessToken, null);
	const user: User = await getUserInfo();
	updateAuthState(accessToken, user);
};

/**
 * @access public
 * @param {SignupRequest} signupRequest
 * @returns {Promise<void>}
 * @description Signs up the user and fetches their information.
 * Sets the access token and user in the auth context.
 * @throws {Error} If signup fails or fetching user info fails.
 */
export const signupAndFetchUserInfo = async (
	signupRequest: SignupRequest,
): Promise<void> => {
	const { accessToken } = await signup(signupRequest);
	updateAuthState(accessToken, null);
	const user: User = await getUserInfo();
	updateAuthState(accessToken, user);
};

/**
 * @access public
 * @returns {Promise<void>}
 * @description Logs out the user by calling the logout API.
 * Clears the access token and user from the auth context.
 */
export const logoutUser = async (): Promise<void> => {
	const { setLoading } = useStore.getState();
	try {
		setLoading(true);
		await logout();
	} finally {
		setLoading(false);
		useStore.getState().logout();
	}
};

/**
 *
 * @template T - The expected return type of the API call.
 * @template A - The type of the arguments array for the API call.
 * @param {(...args: A) => Promise<T>} apiCall - The API call function to be executed.
 * @param {A} args - The arguments to be passed to the API call function.
 * @returns {Promise<T>}
 * @description This function takes an API call and its arguments, and attempts to execute it.
 * If the API call fails with an AuthError, it will attempt to refresh the access token and retry the API call once.
 * If the second attempt also fails, it will log out the user and throw the error.
 * @throws {Error} If the API call fails for reasons other than auth, or if the token refresh fails.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const retryWithRefresh = async <T, A extends any[]>(
	apiCall: (...args: A) => Promise<T>,
	args: A,
): Promise<T> => {
	try {
		return await apiCall(...args);
	} catch (error) {
		// if not an auth error, rethrow it
		if (!(error instanceof AuthError)) {
			throw error;
		}
		try {
			// attempt to refresh the token
			const { accessToken } = await refresh();
			updateAuthState(accessToken, null);
			const user: User = await getUserInfo();
			updateAuthState(accessToken, user);
			// retry the original API call
			return await apiCall(...args);
		} catch (refreshError) {
			// log out the user on 2nd failure
			await logoutUser();
			throw refreshError;
		}
	}
};

export const initialAuthRefresh = async () => {
	const { setInit } = useStore.getState();
	try {
		await retryWithRefresh(getUserInfo, []);
	} catch (error) {
		if (error instanceof Error) {
			console.error("Auth initialization failed:", error.message);
		} else {
			console.info("Auth: No session found on startup.");
		}
	} finally {
		setInit(true);
	}
};

export const dashboardPreviewFetchHandler = async (
	entityType: keyof Entity,
) => {
	const { data, setDataLoading } = useStore.getState();
	try {
		setDataLoading(true);
		if (
			data[entityType].active.data.length >= 2 ||
			!data[entityType].active.hasMore
		)
			return;
		const newData = await retryWithRefresh(fetchNotes, [{ page: 0, size: 2 }]);
		useStore.setState((state) => ({
			data: {
				...state.data,
				[entityType]: {
					...state.data[entityType],
					active: {
						...state.data[entityType].active,
						data: newData.content,
					},
				},
			},
		}));
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
	} finally {
		setDataLoading(false);
	}
};

export const dataFetchHandler = async (
	entityType: keyof Entity,
	entityState: EntityState,
): Promise<void> => {
	const { data, setDataLoading } = useStore.getState();
	if (!data[entityType][entityState].hasMore) return;
	try {
		setDataLoading(true);
		const newData: Page<Note> = await retryWithRefresh(fetchNotes, [
			{
				page: data[entityType][entityState].pageNumber + 1,
				deleted: entityState === "deleted",
			},
		]);
		useStore.setState((state) => ({
			data: {
				...state.data,
				[entityType]: {
					...state.data[entityType],
					[entityState]: {
						data:
							newData.number === 0
								? [...newData.content]
								: [
										...state.data[entityType][entityState].data,
										...newData.content,
									],
						pageNumber: newData.number,
						hasMore: !newData.last,
					},
				},
			},
		}));
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error(`Error while fetching ${entityTypeToName(entityType)}`, {
			duration: 1000,
		});
	} finally {
		setDataLoading(false);
	}
};

export const dataCreateHandler = async (
	entityType: keyof Entity,
	createContent: NoteModifyRequest | EventModifyRequest,
	notify = false,
): Promise<Entity[keyof Entity] | undefined> => {
	try {
		const newData = await retryWithRefresh(createNote, [
			createContent as NoteModifyRequest,
		]);
		useStore.setState((state) => ({
			data: {
				...state.data,
				[entityType]: {
					...state.data[entityType],
					active: {
						...state.data[entityType].active,
						data: [newData, ...state.data[entityType].active.data],
					},
				},
			},
		}));
		if (notify) {
			toast.success(
				`${entityTypeToName(entityType, true, false)} saved successfully!`,
				{ duration: 1000 },
			);
		}
		return newData;
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error(
			`Failed to create ${entityTypeToName(entityType, false, false)}`,
			{ duration: 1000 },
		);
	}
};

export const dataUpdateHandler = async (
	entityType: keyof Entity,
	entityId: string,
	updateContent: NoteModifyRequest | EventModifyRequest,
	notify = false,
): Promise<Entity[keyof Entity] | undefined> => {
	try {
		const updatedData = await retryWithRefresh(updateNote, [
			entityId,
			updateContent as NoteModifyRequest,
		]);
		useStore.setState((state) => ({
			data: {
				...state.data,
				[entityType]: {
					...state.data[entityType],
					active: {
						...state.data[entityType].active,
						data: [
							updatedData,
							...state.data[entityType].active.data.filter(
								(item) => item.id !== updatedData.id,
							),
						],
					},
				},
			},
		}));
		if (notify) {
			toast.success(
				`${entityTypeToName(entityType, true, false)} updated successfully!`,
				{ duration: 1000 },
			);
		}
		return updatedData;
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error(
			`Failed to update ${entityTypeToName(entityType, false, false)}`,
			{ duration: 1000 },
		);
	}
};

export const dataSoftDeleteHandler = async (
	entityType: keyof Entity,
	entityId: string,
	notify = false,
) => {
	try {
		const updatedData = await retryWithRefresh(softDeleteNote, [entityId]);
		useStore.setState((state) => ({
			data: {
				...state.data,
				[entityType]: {
					...state.data[entityType],
					active: {
						...state.data[entityType].active,
						data: [
							...state.data[entityType].active.data.filter(
								(item) => item.id !== updatedData.id,
							),
						],
					},
					deleted: {
						...state.data[entityType].deleted,
						data: [updatedData, ...state.data[entityType].deleted.data],
					},
				},
			},
		}));
		if (notify) {
			toast.success(
				`${entityTypeToName(entityType, true, false)} deleted successfully!`,
				{ duration: 1000 },
			);
		}
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error(
			`Failed to delete ${entityTypeToName(entityType, false, false)}`,
			{ duration: 1000 },
		);
	}
};

export const dataRestoreHandler = async (
	entityType: keyof Entity,
	entityId: string,
) => {
	try {
		const updatedData = await retryWithRefresh(restoreNote, [entityId]);
		useStore.setState((state) => ({
			data: {
				...state.data,
				[entityType]: {
					...state.data[entityType],
					active: {
						...state.data[entityType].active,
						data: [updatedData, ...state.data[entityType].active.data],
					},
					deleted: {
						...state.data[entityType].deleted,
						data: [
							...state.data[entityType].deleted.data.filter(
								(item) => item.id !== updatedData.id,
							),
						],
					},
				},
			},
		}));
		toast.success(
			`${entityTypeToName(entityType, true, false)} restored successfully!`,
			{ duration: 1000 },
		);
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error(
			`Failed to restore ${entityTypeToName(entityType, false, false)}`,
			{ duration: 1000 },
		);
	}
};

export const dataPermanentDeleteHandler = async (
	entityType: keyof Entity,
	entityId: string,
) => {
	try {
		await retryWithRefresh(permanentlyDeleteNote, [entityId]);
		useStore.setState((state) => ({
			data: {
				...state.data,
				[entityType]: {
					...state.data[entityType],
					active: {
						...state.data[entityType].active,
						data: [
							...state.data[entityType].active.data.filter(
								(item) => item.id !== entityId,
							),
						],
					},
					deleted: {
						...state.data[entityType].deleted,
						data: [
							...state.data[entityType].deleted.data.filter(
								(item) => item.id !== entityId,
							),
						],
					},
				},
			},
		}));
		toast.success(
			`${entityTypeToName(entityType, true, false)} deleted permanently!`,
			{ duration: 1000 },
		);
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error(
			`Failed to delete ${entityTypeToName(entityType, false, false)} permanently`,
			{
				duration: 1000,
			},
		);
	}
};
