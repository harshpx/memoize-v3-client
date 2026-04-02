import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/image-upload-node/image-upload-node.scss";
import "@/components/tiptap-ui-primitive/toolbar/toolbar.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type { Note } from "@/lib/commonTypes";
import { emptyNoteTemplate, safeParseForEditor } from "@/lib/utils";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Typography from "@tiptap/extension-typography";
import { Placeholder, Selection } from "@tiptap/extensions";
import {
	ToolbarGroup,
	ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import {
	noteCreateHandler,
	notePermanentDeleteHandler,
	noteRestoreHandler,
	noteSoftDeleteHandler,
	noteUpdateHandler,
} from "@/services/services";
import { LuTrash, LuSave, LuLoaderCircle } from "react-icons/lu";
import { MdRestore } from "react-icons/md";
import { FaChevronLeft } from "react-icons/fa6";
import CustomizableButton from "@/components/custom/CustomizableButton";
import useMediaQuery from "@/hooks/useMediaQuery";

export interface NoteNavData {
	note?: Note;
}

const NotePage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const isMobile = useMediaQuery("(max-width: 640px)");
	const initialNote = (location.state as NoteNavData).note ?? emptyNoteTemplate;

	const [currentNote, setCurrentNote] = useState<Note>(initialNote);
	const [dirty, setDirty] = useState<boolean>(false);
	const currentNoteRef = useRef(currentNote);
	const dirtyRef = useRef(dirty);

	// trigger save on unload
	// useEffect(() => {
	// 	const handleUnload = (e: BeforeUnloadEvent) => {
	// 		e.preventDefault();
	// 		noteSaveHelper();
	// 	};
	// 	window.addEventListener("beforeunload", handleUnload);
	// 	return () => {
	// 		window.removeEventListener("beforeunload", handleUnload);
	// 	};
	// }, []);

	// trigger auto-save every 15 seconds
	useEffect(() => {
		const autosaveInterval = setInterval(async () => {
			await noteSaveHelper();
		}, 15000);

		return () => {
			clearInterval(autosaveInterval);
		};
	}, []);

	// trigger save on unmount
	useEffect(() => {
		return () => {
			noteSaveHelper();
		};
	}, []);

	const isSavingRef = useRef(false);
	const [isSaving, setIsSaving] = useState(false);
	const updateIsSaving = (saving: boolean) => {
		isSavingRef.current = saving;
		setIsSaving(saving);
	};
	// manual helper methods
	const noteSaveHelper = async () => {
		if (
			dirtyRef.current &&
			!currentNoteRef.current.isDeleted &&
			!isSavingRef.current
		) {
			updateIsSaving(true);
			let updatedNote: Note | undefined;
			if (currentNoteRef.current.id) {
				updatedNote = await noteUpdateHandler(currentNoteRef.current.id, {
					content: currentNoteRef.current.content,
					preview: currentNoteRef.current.preview,
				});
			} else {
				updatedNote = await noteCreateHandler({
					content: currentNoteRef.current.content,
					preview: currentNoteRef.current.preview,
				});
			}
			if (updatedNote) {
				updateDataAndRef(updatedNote, false);
			}
			updateIsSaving(false);
		}
	};

	const noteDeleteHelper = () => {
		noteSoftDeleteHandler(currentNoteRef.current.id, true);
		navigate("/home/notes", { replace: true });
	};

	const noteRestoreHelper = () => {
		noteRestoreHandler(currentNoteRef.current.id, true);
		navigate("/home/trash", { replace: true });
	};

	const notePermanentlyDeleteHelper = () => {
		notePermanentDeleteHandler(currentNoteRef.current.id, true);
		navigate("/home/trash", { replace: true });
	};

	const updateDataAndRef = (updatedNote: Note, dirtyState: boolean) => {
		currentNoteRef.current = updatedNote;
		dirtyRef.current = dirtyState;
		setCurrentNote(updatedNote);
		setDirty(dirtyState);
	};

	// editor state and config
	const editor = useEditor({
		onUpdate: (state) => {
			const contentJson = state.editor.getJSON();
			const contentPreview = state.editor.getHTML();

			const newContent = JSON.stringify(contentJson);
			const isDirty =
				newContent !== currentNoteRef.current.content &&
				newContent !== initialNote.content;
			const updatedNote = {
				...currentNoteRef.current,
				content: newContent,
				preview: contentPreview,
			};
			updateDataAndRef(updatedNote, isDirty);
		},
		immediatelyRender: false,
		editorProps: {
			attributes: {
				autocomplete: "off",
				autocorrect: "off",
				autocapitalize: "off",
				"aria-label": "Main content area, start typing to enter text.",
				class: "simple-editor",
			},
		},
		extensions: [
			StarterKit.configure({
				horizontalRule: false,
				link: {
					openOnClick: false,
					enableClickSelection: true,
				},
			}),
			Placeholder.configure({
				placeholder: "Start typing here...",
			}),
			HorizontalRule,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			TaskList,
			TaskItem.configure({ nested: true }),
			Highlight.configure({ multicolor: true }),
			Typography,
			Superscript,
			Subscript,
			Selection,
		],
		content: safeParseForEditor(currentNoteRef.current.content),
		editable: !currentNoteRef.current.isDeleted,
	});

	if (!editor) return null;

	return (
		<div className="p-4 grow h-full w-full flex justify-center">
			<EditorContext.Provider value={{ editor }}>
				<div className="md:w-[90%] flex flex-col gap-4">
					<div className="flex gap-1 flex-wrap justify-center items-center w-full">
						{currentNoteRef.current.isDeleted ? (
							<div className="text-[12px] italic text-red-500 p-2">
								This note is deleted, restore to edit
							</div>
						) : (
							<>
								<ToolbarGroup>
									<UndoRedoButton action="undo" text={isMobile ? "" : "Undo"} />
									<UndoRedoButton action="redo" text={isMobile ? "" : "Redo"} />
								</ToolbarGroup>
								<ToolbarSeparator />
								<ToolbarGroup>
									<HeadingDropdownMenu levels={[1, 2, 3, 4]} />
									<ListDropdownMenu
										types={["bulletList", "orderedList", "taskList"]}
									/>
								</ToolbarGroup>
								<ToolbarSeparator />
								<ToolbarGroup>
									<BlockquoteButton text={isMobile ? "" : "Blockquote"} />
									<CodeBlockButton text={isMobile ? "" : "Codeblock"} />
								</ToolbarGroup>
								<ToolbarSeparator />
								<ToolbarGroup>
									<MarkButton type="bold" text={isMobile ? "" : "old"} />
									<MarkButton type="italic" text={isMobile ? "" : "talic"} />
									<MarkButton
										type="underline"
										text={isMobile ? "" : "nderline"}
									/>
									<MarkButton type="strike" text={isMobile ? "" : "trike"} />
								</ToolbarGroup>
								<ToolbarSeparator />
								<ToolbarGroup>
									<MarkButton type="superscript" />
									<MarkButton type="subscript" />
								</ToolbarGroup>
								<ToolbarSeparator />
								<ToolbarGroup>
									<TextAlignButton align="left" />
									<TextAlignButton align="center" />
									<TextAlignButton align="right" />
									<TextAlignButton align="justify" />
								</ToolbarGroup>
							</>
						)}
					</div>
					<EditorContent
						editor={editor}
						className="w-full overflow-scroll grow [&_.ProseMirror]:h-full [&_.ProseMirror]:min-h-full [&_.ProseMirror]:outline-none"
					/>
					{/* bottom bar */}
					<div className="flex items-center justify-between w-full border rounded-xl bg-neutral-100 dark:bg-neutral-900 shadow-sm">
						{/* left section */}
						<div className="w-1/4 flex items-center justify-start">
							{/* back button */}
							<CustomizableButton
								onClick={() => navigate(-1)}
								className="p-1.5 size-12 flex-col justify-center text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-200 
											hover:bg-neutral-200 dark:hover:bg-neutral-700/80">
								<FaChevronLeft className="size-4" />
							</CustomizableButton>
						</div>
						{/* middle section */}
						<div className="w-1/2 flex items-center justify-center">
							{!currentNote.id && !dirty && (
								<div className="text-[12px] text-neutral-500 dark:text-neutral-400">
									Type something to save
								</div>
							)}
							{/* save button */}
							{!(currentNote.isDeleted || (!currentNote.id && !dirty)) && (
								<CustomizableButton
									onClick={() => noteSaveHelper()}
									disabled={!dirty}
									className="p-1.5 gap-0.5 size-12 flex-col items-center justify-center text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-200 
											hover:bg-neutral-200 dark:hover:bg-neutral-700/80 disabled:cursor-not-allowed disabled:brightness-75">
									{isSaving ? (
										<LuLoaderCircle className="size-4 animate-spin" />
									) : (
										<LuSave className="size-4" />
									)}
									<span className="px-[2px] text-[10px] font-[500]">
										{isSaving ? "Saving" : dirty ? "Save" : "Saved"}
									</span>
								</CustomizableButton>
							)}
							{/* restore button */}
							{currentNote.id && currentNote.isDeleted && (
								<CustomizableButton
									onClick={() => noteRestoreHelper()}
									className="p-1.5 gap-0.5 size-12 flex-col items-center justify-center text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-200 
											hover:bg-neutral-200 dark:hover:bg-neutral-700/80">
									<MdRestore className="size-4" />
									<span className="px-[2px] text-[10px] font-[500]">
										Restore
									</span>
								</CustomizableButton>
							)}
							{/* delete/permanent delete button */}
							{currentNote.id && (
								<CustomizableButton
									onClick={() => {
										if (currentNote.isDeleted) {
											notePermanentlyDeleteHelper();
										} else {
											noteDeleteHelper();
										}
									}}
									className={`
											p-1.5 gap-0.5 size-12 flex-col items-center justify-center
											text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-200 
											hover:bg-neutral-200 dark:hover:bg-neutral-700/80
											${currentNote.isDeleted ? "text-red-500 dark:text-red-500 hover:text-red-500 dark:hover:text-red-500" : ""}
										`}>
									<LuTrash className="size-4" />
									<span className="px-[2px] text-[10px] font-[500]">
										Delete
									</span>
								</CustomizableButton>
							)}
						</div>
						{/* right section */}
						<div className="w-1/4 flex items-center justify-end"></div>
					</div>
				</div>
			</EditorContext.Provider>
		</div>
	);
};

export default NotePage;
