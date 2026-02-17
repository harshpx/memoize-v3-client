// single source of truth
import { create } from "zustand";
import type { Note, User } from "@/lib/commonTypes";
import type { ACCENTS } from "@/lib/utils";

export type Accent = (typeof ACCENTS)[number];
export type Theme = "light" | "dark";

export type EntityState = "active" | "deleted";

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

interface DataState {
	// notes
	notes: Record<EntityState, Note[]>;
	setNotes: (type: EntityState, notes: Note[]) => void;
	notePageNumbers: Record<EntityState, number>;
	setNotePageNumbers: (type: EntityState, pageNumber: number) => void;
	hasMoreNotes: Record<EntityState, boolean>;
	setHasMoreNotes: (type: EntityState, flag: boolean) => void;
	// events (will be added) ...
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
			// reset data states
			notes: { active: [], deleted: [] },
			notePageNumbers: { active: -1, deleted: -1 },
			hasMoreNotes: { active: true, deleted: true },
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
	notes: { active: [], deleted: [] },
	setNotes: (type: EntityState, notes: Note[]) =>
		set((state) => ({ notes: { ...state.notes, [type]: notes } })),
	notePageNumbers: { active: -1, deleted: -1 },
	setNotePageNumbers: (type: EntityState, value: number) =>
		set((state) => ({
			notePageNumbers: { ...state.notePageNumbers, [type]: value },
		})),
	hasMoreNotes: { active: true, deleted: true },
	setHasMoreNotes: (type: EntityState, flag: boolean) =>
		set((state) => ({ hasMoreNotes: { ...state.hasMoreNotes, [type]: flag } })),
	// ui state
	loading: false,
	setLoading: (loading) => set({ loading }),
}));
