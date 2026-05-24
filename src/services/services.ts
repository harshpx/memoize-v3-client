import { useStore, type NotesEntityState } from "@/context/store";
import type {
	Chat,
	Conversation,
	Event,
	EventModifyRequest,
	LoginRequest,
	Note,
	NoteModifyRequest,
	Page,
	SignupRequest,
	User,
} from "@/lib/commonTypes";
import { AuthError } from "@/lib/errors";
import {
	askLLM,
	createConversation,
	createEvent,
	createNote,
	deleteConversation,
	deleteEvent,
	fetchChatsInConversation,
	fetchConversationById,
	fetchConversations,
	fetchEvents,
	fetchNotes,
	getUserInfo,
	login,
	logout,
	permanentlyDeleteNote,
	refresh,
	restoreNote,
	signup,
	softDeleteNote,
	updateEvent,
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
			if (refreshError instanceof AuthError) {
				// log out the user on 2nd failure of auth
				await logoutUser();
			}
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

// -------------- Notes services ----------------

export const notesFetchHandler = async (
	entityState: NotesEntityState,
): Promise<void> => {
	const { notes, notesLoading } = useStore.getState();

	if (notesLoading) return;

	try {
		useStore.setState(() => ({ notesLoading: true }));
		if (!notes[entityState].hasMore) return;
		const newNotesData: Page<Note> = await retryWithRefresh(fetchNotes, [
			{
				page: notes[entityState].pageNumber + 1,
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
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
	} finally {
		useStore.setState(() => ({ notesLoading: false }));
	}
};

export const noteCreateHandler = async (
	noteContent: NoteModifyRequest,
	notify = false,
): Promise<Note | undefined> => {
	try {
		const newNote: Note = await retryWithRefresh(createNote, [noteContent]);
		useStore.setState((state) => ({
			notes: {
				...state.notes,
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

export const noteSoftDeleteHandler = async (
	noteId: string,
	notify = false,
): Promise<void> => {
	try {
		const deletedNote = await retryWithRefresh(softDeleteNote, [noteId]);
		useStore.setState((state) => ({
			notes: {
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

export const noteRestoreHandler = async (
	noteId: string,
	notify = false,
): Promise<void> => {
	try {
		const restoredNote = await retryWithRefresh(restoreNote, [noteId]);
		useStore.setState((state) => ({
			notes: {
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

export const notePermanentDeleteHandler = async (
	noteId: string,
	notify = false,
): Promise<void> => {
	try {
		await retryWithRefresh(permanentlyDeleteNote, [noteId]);
		useStore.setState((state) => ({
			notes: {
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

// -------------- Events services ----------------

export const eventsFetchHandler = async (): Promise<void> => {
	const { eventsLoading, eventsFetched } = useStore.getState();
	if (eventsLoading || eventsFetched) return;

	try {
		useStore.setState(() => ({ eventsLoading: true }));
		const eventsData: Event[] = await retryWithRefresh(fetchEvents, []);
		useStore.setState(() => ({
			events: eventsData,
			eventsFetched: true,
		}));
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
	} finally {
		useStore.setState(() => ({ eventsLoading: false }));
	}
};

export const eventCreateHandler = async (
	eventContent: EventModifyRequest,
	notify = false,
): Promise<Event | undefined> => {
	try {
		const newEvent: Event = await retryWithRefresh(createEvent, [eventContent]);
		useStore.setState((state) => ({
			events: [newEvent, ...state.events],
		}));
		if (notify) {
			toast.success("Event created successfully!", { duration: 1000 });
		}
		return newEvent;
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error("Failed to create event.", { duration: 1000 });
	}
};

export const eventUpdateHandler = async (
	eventId: string,
	eventContent: EventModifyRequest,
	notify = false,
): Promise<Event | undefined> => {
	try {
		const updatedEvent = await retryWithRefresh(updateEvent, [
			eventId,
			eventContent,
		]);
		useStore.setState((state) => ({
			events: [
				updatedEvent,
				...state.events.filter((event) => event.id !== updatedEvent.id),
			],
		}));
		if (notify) {
			toast.success("Event updated successfully!", { duration: 1000 });
		}
		return updatedEvent;
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error("Failed to update event", { duration: 1000 });
	}
};

export const eventDeleteHandler = async (eventId: string, notify = false) => {
	try {
		await retryWithRefresh(deleteEvent, [eventId]);
		useStore.setState((state) => ({
			events: state.events.filter((event) => event.id !== eventId),
		}));
		if (notify) {
			toast.success("Event deleted successfully!", { duration: 1000 });
		}
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error("Failed to delete event", { duration: 1000 });
	}
};

// -------------- LLM Chat services ----------------
export const conversationsFetchHandler = async (): Promise<void> => {
	const { conversationsLoading, conversations } = useStore.getState();

	if (conversationsLoading || conversations.length > 0) return;

	try {
		useStore.setState(() => ({ conversationsLoading: true }));
		const conversationsData: Conversation[] = await retryWithRefresh(
			fetchConversations,
			[],
		);
		useStore.setState(() => ({
			conversations: conversationsData,
			selectedConversation: conversationsData?.[0]?.id || "",
		}));
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error("Failed to fetch conversations.", { duration: 1000 });
	} finally {
		useStore.setState(() => ({ conversationsLoading: false }));
	}
};

export const conversationInfoFetchHandler = async (
	conversationId: string,
): Promise<void> => {
	try {
		const conversation: Conversation = await retryWithRefresh(
			fetchConversationById,
			[conversationId],
		);
		useStore.setState((state) => ({
			conversations: state.conversations.map((conv) =>
				conv.id === conversationId ? conversation : conv,
			),
		}));
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
	}
};

export const conversationCreateHandler = async (
	notify = false,
): Promise<void> => {
	const { conversations } = useStore.getState();

	const existingNew = conversations.find((c) => c.isNew);
	if (existingNew) {
		useStore.setState(() => ({
			selectedConversation: existingNew.id,
		}));
		return;
	}

	try {
		const newConversation: Conversation = await retryWithRefresh(
			createConversation,
			[],
		);
		useStore.setState((state) => ({
			conversations: [newConversation, ...state.conversations],
			selectedConversation: newConversation.id,
		}));
		if (notify) {
			toast.success("Conversation created successfully!", { duration: 1000 });
		}
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
	}
};

export const conversationDeleteHandler = async (
	conversationId: string,
	notify = false,
): Promise<void> => {
	try {
		await retryWithRefresh(deleteConversation, [conversationId]);
		useStore.setState((state) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { [conversationId]: _, ...remainingChats } = state.chats;
			return {
				conversations: state.conversations.filter(
					(conv) => conv.id !== conversationId,
				),
				chats: remainingChats,
			};
		});
		if (notify) {
			toast.success("Conversation deleted successfully!", { duration: 1000 });
		}
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		toast.error("Failed to delete Conversation", { duration: 1000 });
	}
};

export const chatsFetchHandler = async (
	conversationId: string,
): Promise<void> => {
	const { chatsLoading, conversations } = useStore.getState();

	const conversation: Conversation | undefined = conversations.find(
		(conv) => conv.id === conversationId,
	);
	if (!conversation) return;

	if (chatsLoading) return;

	try {
		useStore.setState(() => ({ chatsLoading: true }));
		const chatsData: Chat[] = await retryWithRefresh(fetchChatsInConversation, [
			conversationId,
		]);
		useStore.setState((state) => ({
			chats: {
				...state.chats,
				[conversationId]: chatsData,
			},
		}));
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
	} finally {
		useStore.setState(() => ({ chatsLoading: false }));
	}
};

export const llmQueryHandler = async (
	conversationId: string,
	query: string,
): Promise<void> => {
	const { conversations } = useStore.getState();

	const conversation: Conversation | undefined = conversations.find(
		(conv) => conv.id === conversationId,
	);

	if (!conversation) return;

	const controller = new AbortController();
	const question: Chat = {
		id: crypto.randomUUID(),
		content: query,
		type: "QUESTION",
		createdAt: new Date().toISOString(),
	};
	useStore.setState((state) => ({
		chatStreaming: true,
		chats: {
			...state.chats,
			[conversationId]: [...state.chats[conversationId], question],
		},
	}));

	try {
		const answerId = crypto.randomUUID();
		const answer: Chat = {
			id: answerId,
			content: "Thinking...",
			type: "ANSWER",
			createdAt: new Date().toISOString(),
		};

		useStore.setState((state) => ({
			chatStreaming: true,
			chats: {
				...state.chats,
				[conversationId]: [...state.chats[conversationId], answer],
			},
		}));

		await retryWithRefresh(askLLM, [
			conversationId,
			query,
			(chunk: string) => {
				useStore.setState((state) => ({
					chatStreaming: false,
					chats: {
						...state.chats,
						[conversationId]: state.chats[conversationId].map((chat) =>
							chat.id === answerId
								? {
										...chat,
										content:
											chat.content === "Thinking..."
												? chunk
												: chat.content + chunk,
									}
								: chat,
						),
					},
				}));
			},
			controller.signal,
		]);

		useStore.setState(() => ({ chatStreaming: false }));

		if (!conversation.isProperName) {
			const updatedConversation: Conversation = await retryWithRefresh(
				fetchConversationById,
				[conversationId],
			);
			useStore.setState((state) => ({
				conversations: state.conversations.map((conv) =>
					conv.id === conversationId ? updatedConversation : conv,
				),
			}));
		}
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
		useStore.setState(() => ({ chatStreaming: false }));
	}
};
