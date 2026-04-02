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
	const user: User = await getUserInfo(accessToken);
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
	const user: User = await getUserInfo(accessToken);
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
			const user: User = await getUserInfo(accessToken);
			updateAuthState(accessToken, user);
			if ((apiCall as unknown) === getUserInfo) {
				// if the original call was getUserInfo, we don't want to retry it after refresh
				return user as unknown as T;
			}
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

export const notesFetchHandler = async (
	entityState: EntityState,
): Promise<void> => {
	const { notes, setNotesLoading } = useStore.getState();
	try {
		setNotesLoading(true);
		if (entityState === "preview") {
			if (notes.preview.data.length >= 2) {
				return;
			} else {
				if (notes.active.data.length >= 2 || !notes.active.hasMore) {
					useStore.setState((state) => ({
						notes: {
							...state.notes,
							preview: {
								...state.notes.preview,
								data: state.notes.active.data.slice(0, 2),
							},
						},
					}));
				} else {
					const newNotesData = await retryWithRefresh(fetchNotes, [
						{ page: 0, size: 2 },
					]);
					useStore.setState((state) => ({
						notes: {
							...state.notes,
							preview: {
								...state.notes.preview,
								data: newNotesData.content,
							},
						},
					}));
				}
			}
		} else if (entityState === "active" || entityState === "deleted") {
			if (!notes[entityState].hasMore) return;
			const newNotesData: Page<Note> = await retryWithRefresh(fetchNotes, [
				{
					page: notes.active.pageNumber + 1,
					deleted: entityState === "deleted",
				},
			]);
			useStore.setState((state) => ({
				notes: {
					...state.notes,
					[entityState]: {
						data:
							newNotesData.number === 0
								? [...newNotesData.content]
								: [...state.notes[entityState].data, ...newNotesData.content],
						pageNumber: newNotesData.number,
						hasMore: !newNotesData.last,
					},
				},
			}));
		}
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
	} finally {
		setNotesLoading(false);
	}
};

// export const dataFetchHandler = async (
// 	entityType: keyof Entity,
// 	entityState: EntityState,
// ): Promise<void> => {
// 	const { data, setDataLoading } = useStore.getState();
// 	if (!data[entityType][entityState].hasMore) return;
// 	try {
// 		setDataLoading(true);
// 		const newData: Page<Note> = await retryWithRefresh(fetchNotes, [
// 			{
// 				page: data[entityType][entityState].pageNumber + 1,
// 				deleted: entityState === "deleted",
// 			},
// 		]);
// 		useStore.setState((state) => ({
// 			data: {
// 				...state.data,
// 				[entityType]: {
// 					...state.data[entityType],
// 					[entityState]: {
// 						data:
// 							newData.number === 0
// 								? [...newData.content]
// 								: [
// 										...state.data[entityType][entityState].data,
// 										...newData.content,
// 									],
// 						pageNumber: newData.number,
// 						hasMore: !newData.last,
// 					},
// 				},
// 			},
// 		}));
// 	} catch (error) {
// 		if (error instanceof Error) console.error(error.message);
// 		toast.error(`Error while fetching ${entityTypeToName(entityType)}`, {
// 			duration: 1000,
// 		});
// 	} finally {
// 		setDataLoading(false);
// 	}
// };

export const noteCreateHandler = async (
	noteContent: NoteModifyRequest,
	notify = false,
): Promise<Note | undefined> => {
	try {
		const newNote: Note = await retryWithRefresh(createNote, [noteContent]);
		useStore.setState((state) => ({
			notes: {
				...state.notes,
				preview: {
					...state.notes.preview,
					data: [newNote, ...state.notes.preview.data].slice(0, 2),
				},
				active: {
					...state.notes.active,
					data: [newNote, ...state.notes.active.data],
				},
			},
		}));
		if (notify) {
			toast.success("Note saved successfully!", { duration: 1000 });
		}
		return newNote;
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error("Failed to create note.", { duration: 1000 });
	}
};

// export const dataCreateHandler = async (
// 	entityType: keyof Entity,
// 	createContent: NoteModifyRequest | EventModifyRequest,
// 	notify = false,
// ): Promise<Entity[keyof Entity] | undefined> => {
// 	try {
// 		const newData = await retryWithRefresh(createNote, [
// 			createContent as NoteModifyRequest,
// 		]);
// 		useStore.setState((state) => ({
// 			data: {
// 				...state.data,
// 				[entityType]: {
// 					...state.data[entityType],
// 					active: {
// 						...state.data[entityType].active,
// 						data: [newData, ...state.data[entityType].active.data],
// 					},
// 				},
// 			},
// 		}));
// 		if (notify) {
// 			toast.success(
// 				`${entityTypeToName(entityType, true, false)} saved successfully!`,
// 				{ duration: 1000 },
// 			);
// 		}
// 		return newData;
// 	} catch (error) {
// 		if (error instanceof Error) console.error(error.message);
// 		toast.error(
// 			`Failed to create ${entityTypeToName(entityType, false, false)}`,
// 			{ duration: 1000 },
// 		);
// 	}
// };

export const noteUpdateHandler = async (
	noteId: string,
	noteContent: NoteModifyRequest,
	notify = false,
): Promise<Note | undefined> => {
	try {
		const updatedNote = await retryWithRefresh(updateNote, [
			noteId,
			noteContent,
		]);
		useStore.setState((state) => ({
			notes: {
				...state.notes,
				preview: {
					...state.notes.preview,
					data: [
						updatedNote,
						...state.notes.preview.data.filter(
							(note) => note.id !== updatedNote.id,
						),
					].slice(2),
				},
				active: {
					...state.notes.active,
					data: [
						updatedNote,
						...state.notes.active.data.filter(
							(note) => note.id !== updatedNote.id,
						),
					],
				},
			},
		}));
		if (notify) {
			toast.success("Note updated successfully!", { duration: 1000 });
		}
		return updatedNote;
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error("Failed to update note", { duration: 1000 });
	}
};

// export const dataUpdateHandler = async (
// 	entityType: keyof Entity,
// 	entityId: string,
// 	updateContent: NoteModifyRequest | EventModifyRequest,
// 	notify = false,
// ): Promise<Entity[keyof Entity] | undefined> => {
// 	try {
// 		const updatedData = await retryWithRefresh(updateNote, [
// 			entityId,
// 			updateContent as NoteModifyRequest,
// 		]);
// 		useStore.setState((state) => ({
// 			data: {
// 				...state.data,
// 				[entityType]: {
// 					...state.data[entityType],
// 					active: {
// 						...state.data[entityType].active,
// 						data: [
// 							updatedData,
// 							...state.data[entityType].active.data.filter(
// 								(item) => item.id !== updatedData.id,
// 							),
// 						],
// 					},
// 				},
// 			},
// 		}));
// 		if (notify) {
// 			toast.success(
// 				`${entityTypeToName(entityType, true, false)} updated successfully!`,
// 				{ duration: 1000 },
// 			);
// 		}
// 		return updatedData;
// 	} catch (error) {
// 		if (error instanceof Error) console.error(error.message);
// 		toast.error(
// 			`Failed to update ${entityTypeToName(entityType, false, false)}`,
// 			{ duration: 1000 },
// 		);
// 	}
// };

export const noteSoftDeleteHandler = async (
	noteId: string,
	notify = false,
): Promise<void> => {
	try {
		const deletedNote = await retryWithRefresh(softDeleteNote, [noteId]);
		useStore.setState((state) => ({
			notes: {
				preview: {
					...state.notes.preview,
					data: [
						...state.notes.preview.data.filter(
							(note) => note.id !== deletedNote.id,
						),
					],
				},
				active: {
					...state.notes.active,
					data: [
						...state.notes.active.data.filter(
							(note) => note.id !== deletedNote.id,
						),
					],
				},
				deleted: {
					...state.notes.deleted,
					data: [deletedNote, ...state.notes.deleted.data],
				},
			},
		}));
		if (notify) {
			toast.success("Note delete successfully!", { duration: 1000 });
		}
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error("Failed to delete note.", { duration: 1000 });
	}
};

// export const dataSoftDeleteHandler = async (
// 	entityType: keyof Entity,
// 	entityId: string,
// 	notify = false,
// ) => {
// 	try {
// 		const updatedData = await retryWithRefresh(softDeleteNote, [entityId]);
// 		useStore.setState((state) => ({
// 			data: {
// 				...state.data,
// 				[entityType]: {
// 					...state.data[entityType],
// 					active: {
// 						...state.data[entityType].active,
// 						data: [
// 							...state.data[entityType].active.data.filter(
// 								(item) => item.id !== updatedData.id,
// 							),
// 						],
// 					},
// 					deleted: {
// 						...state.data[entityType].deleted,
// 						data: [updatedData, ...state.data[entityType].deleted.data],
// 					},
// 				},
// 			},
// 		}));
// 		if (notify) {
// 			toast.success(
// 				`${entityTypeToName(entityType, true, false)} deleted successfully!`,
// 				{ duration: 1000 },
// 			);
// 		}
// 	} catch (error) {
// 		if (error instanceof Error) console.error(error.message);
// 		toast.error(
// 			`Failed to delete ${entityTypeToName(entityType, false, false)}`,
// 			{ duration: 1000 },
// 		);
// 	}
// };

export const noteRestoreHandler = async (
	noteId: string,
	notify = false,
): Promise<void> => {
	try {
		const restoredNote = await retryWithRefresh(restoreNote, [noteId]);
		useStore.setState((state) => ({
			notes: {
				preview: {
					...state.notes.preview,
					data: [restoredNote, ...state.notes.preview.data].slice(0, 2),
				},
				active: {
					...state.notes.active,
					data: [restoredNote, ...state.notes.active.data],
				},
				deleted: {
					...state.notes.deleted,
					data: [
						...state.notes.deleted.data.filter(
							(item) => item.id !== restoredNote.id,
						),
					],
				},
			},
		}));
		if (notify) {
			toast.success("Note restored successfully!", { duration: 1000 });
		}
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error("Failed to restore note", { duration: 1000 });
	}
};

// export const dataRestoreHandler = async (
// 	entityType: keyof Entity,
// 	entityId: string,
// 	notify = false,
// ) => {
// 	try {
// 		const updatedData = await retryWithRefresh(restoreNote, [entityId]);
// 		useStore.setState((state) => ({
// 			data: {
// 				...state.data,
// 				[entityType]: {
// 					...state.data[entityType],
// 					active: {
// 						...state.data[entityType].active,
// 						data: [updatedData, ...state.data[entityType].active.data],
// 					},
// 					deleted: {
// 						...state.data[entityType].deleted,
// 						data: [
// 							...state.data[entityType].deleted.data.filter(
// 								(item) => item.id !== updatedData.id,
// 							),
// 						],
// 					},
// 				},
// 			},
// 		}));
// 		if (notify) {
// 			toast.success(
// 				`${entityTypeToName(entityType, true, false)} restored successfully!`,
// 				{ duration: 1000 },
// 			);
// 		}
// 	} catch (error) {
// 		if (error instanceof Error) console.error(error.message);
// 		toast.error(
// 			`Failed to restore ${entityTypeToName(entityType, false, false)}`,
// 			{ duration: 1000 },
// 		);
// 	}
// };

export const notePermanentDeleteHandler = async (
	noteId: string,
	notify = false,
): Promise<void> => {
	try {
		await retryWithRefresh(permanentlyDeleteNote, [noteId]);
		useStore.setState((state) => ({
			notes: {
				preview: {
					...state.notes.preview,
					data: [
						...state.notes.preview.data.filter((note) => note.id !== noteId),
					],
				},
				active: {
					...state.notes.active,
					data: [
						...state.notes.active.data.filter((note) => note.id !== noteId),
					],
				},
				deleted: {
					...state.notes.deleted,
					data: [
						...state.notes.deleted.data.filter((note) => note.id !== noteId),
					],
				},
			},
		}));
		if (notify) {
			toast.success("Note deleted permanently", { duration: 1000 });
		}
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error("Failed to permanently delete note", { duration: 1000 });
	}
};

// export const dataPermanentDeleteHandler = async (
// 	entityType: keyof Entity,
// 	entityId: string,
// 	notify = false,
// ) => {
// 	try {
// 		await retryWithRefresh(permanentlyDeleteNote, [entityId]);
// 		useStore.setState((state) => ({
// 			data: {
// 				...state.data,
// 				[entityType]: {
// 					...state.data[entityType],
// 					active: {
// 						...state.data[entityType].active,
// 						data: [
// 							...state.data[entityType].active.data.filter(
// 								(item) => item.id !== entityId,
// 							),
// 						],
// 					},
// 					deleted: {
// 						...state.data[entityType].deleted,
// 						data: [
// 							...state.data[entityType].deleted.data.filter(
// 								(item) => item.id !== entityId,
// 							),
// 						],
// 					},
// 				},
// 			},
// 		}));
// 		if (notify) {
// 			toast.success(
// 				`${entityTypeToName(entityType, true, false)} deleted permanently!`,
// 				{ duration: 1000 },
// 			);
// 		}
// 	} catch (error) {
// 		if (error instanceof Error) console.error(error.message);
// 		toast.error(
// 			`Failed to delete ${entityTypeToName(entityType, false, false)} permanently`,
// 			{
// 				duration: 1000,
// 			},
// 		);
// 	}
// };
