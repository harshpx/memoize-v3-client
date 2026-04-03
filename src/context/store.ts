// single source of truth
import { create } from "zustand";
import type { Event, Note, User } from "@/lib/commonTypes";
import type { ACCENTS } from "@/lib/utils";

export type Accent = (typeof ACCENTS)[number];
export type Theme = "light" | "dark";

interface AuthState {
	accessToken: string | null;
	user: User | null;
	init: boolean;
	setAuth: (token: string | null, user: User | null) => void;
	setInit: (init: boolean) => void;
	logout: () => void;
}

interface ThemeState {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	accent: Accent;
	setAccent: (accent: Accent) => void;
}

export interface PaginatedData<T> {
	data: T[];
	pageNumber: number;
	hasMore: boolean;
}

export type NotesEntityState = "active" | "deleted";

interface DataState {
	notes: Record<NotesEntityState, PaginatedData<Note>>;
	notesLoading: boolean;
	events: Event[];
	eventsFetched: boolean;
	eventsLoading: boolean;
}

interface AppState extends AuthState, ThemeState, DataState {
	loading: boolean;
	setLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
	// auth
	accessToken: null,
	user: null,
	init: false,
	setAuth: (token, user) => set({ accessToken: token, user }),
	setInit: (init) => set({ init }),
	logout: () =>
		set({
			// reset auth states
			accessToken: null,
			user: null,
			// reset data state
			notes: {
				active: {
					data: [],
					pageNumber: -1,
					hasMore: true,
				},
				deleted: {
					data: [],
					pageNumber: -1,
					hasMore: true,
				},
			},
			notesLoading: false,
			events: [],
			eventsFetched: false,
			eventsLoading: false,
		}),
	// theme
	theme: (localStorage.getItem("theme") as Theme) || "dark",
	accent: (localStorage.getItem("accent") as Accent) || "default",
	setTheme: (theme) => {
		localStorage.setItem("theme", theme);
		document.documentElement.classList.remove("light", "dark");
		document.documentElement.classList.add(theme);
		set({ theme });
	},
	setAccent: (accent) => {
		localStorage.setItem("accent", accent);
		document.documentElement.setAttribute("data-accent", accent);
		set({ accent });
	},
	// data state
	notes: {
		active: {
			data: [],
			pageNumber: -1,
			hasMore: true,
		},
		deleted: {
			data: [],
			pageNumber: -1,
			hasMore: true,
		},
	},
	notesLoading: false,
	events: [],
	eventsFetched: false,
	eventsLoading: false,
	// ui state
	loading: false,
	setLoading: (loading) => set({ loading }),
}));
