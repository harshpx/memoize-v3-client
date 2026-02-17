import { useStore, type EntityState } from "@/context/store";
import type {
	LoginRequest,
	Note,
	NoteModifyRequest,
	Page,
	SignupRequest,
	User,
} from "@/lib/commonTypes";
import { AuthError } from "@/lib/errors";
import {
	createNote,
	fetchNotes,
	getUserInfo,
	login,
	logout,
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
	try {
		await logout();
	} finally {
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

export const notesFetchHandler = async (type: EntityState): Promise<void> => {
	const {
		setLoading,
		notePageNumbers,
		setNotePageNumbers,
		hasMoreNotes,
		setHasMoreNotes,
	} = useStore.getState();
	if (!hasMoreNotes[type]) return;
	try {
		setLoading(true);
		const notesData: Page<Note> = await retryWithRefresh(fetchNotes, [
			{
				page: notePageNumbers[type] + 1,
				deleted: type === "deleted",
			},
		]);
		useStore.setState((state) => ({
			notes: {
				...state.notes,
				[type]:
					notesData.number === 0
						? [...notesData.content]
						: [...state.notes[type], ...notesData.content],
			},
		}));
		setNotePageNumbers(type, notesData.number);
		setHasMoreNotes(type, !notesData.last);
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error("Error while fetching notes", { duration: 1000 });
	} finally {
		setLoading(false);
	}
};

export const noteCreateHandler = async (
	createContent: NoteModifyRequest,
	type: EntityState,
): Promise<void> => {
	try {
		const newNote = await retryWithRefresh(createNote, [createContent]);
		useStore.setState((state) => ({
			notes: { ...state.notes, [type]: [newNote, ...state.notes.active] },
		}));
		toast.success("Saved successfully!", { duration: 1000 });
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error("Failed to create note", { duration: 1000 });
	}
};

export const noteUpdateHandler = async (
	noteId: string,
	updateContent: NoteModifyRequest,
	type: EntityState,
): Promise<void> => {
	try {
		const updatedNote = await retryWithRefresh(updateNote, [
			noteId,
			updateContent,
		]);
		useStore.setState((state) => ({
			notes: {
				...state.notes,
				[type]: [
					updatedNote,
					...state.notes.active.filter((note) => note.id !== updatedNote.id),
				],
			},
		}));
		toast.success("Note updated", { duration: 1000 });
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error("Failed to create note", { duration: 1000 });
	}
};

export const noteSoftDeleteHandler = async (noteId: string) => {
	try {
		const updatedNote = await retryWithRefresh(softDeleteNote, [noteId]);
		useStore.setState((state) => ({
			notes: {
				...state.notes,
				active: [
					...state.notes.active.filter((note) => note.id !== updatedNote.id),
				],
				deleted: [updatedNote, ...state.notes.deleted],
			},
		}));
		toast.success("Note deleted", { duration: 1000 });
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error("Failed to delete note", { duration: 1000 });
	}
};

export const noteRestoreHandler = async (noteId: string) => {
	try {
		const updatedNote = await retryWithRefresh(restoreNote, [noteId]);
		useStore.setState((state) => ({
			notes: {
				...state.notes,
				active: [updatedNote, ...state.notes.active],
				deleted: [
					...state.notes.deleted.filter((note) => note.id !== updatedNote.id),
				],
			},
		}));
		toast.success("Note restored", { duration: 1000 });
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error("Failed to restore note", { duration: 1000 });
	}
};

export const dashBoardPreviewFetchHandler = async () => {
	const { notes } = useStore.getState();
	try {
		if (notes.active.length >= 2) return;
		const newNotes = await retryWithRefresh(fetchNotes, [{ page: 0, size: 2 }]);
		useStore.setState((state) => ({
			notes: {
				...state.notes,
				active: [...newNotes.content],
			},
		}));
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
	}
};
