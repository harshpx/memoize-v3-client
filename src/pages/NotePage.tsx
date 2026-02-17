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

import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/image-upload-node/image-upload-node.scss";
import "@/components/tiptap-ui-primitive/toolbar/toolbar.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import {
	noteCreateHandler,
	notePermanentDeleteHandler,
	noteRestoreHandler,
	noteSoftDeleteHandler,
	noteUpdateHandler,
} from "@/services/services";
import { LuTrash } from "react-icons/lu";
import { MdRestore } from "react-icons/md";
import CustomizableButton from "@/components/custom/CustomizableButton";

export interface NoteNavData {
	note?: Note;
}

const NotePage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const initialNote = (location.state as NoteNavData).note ?? emptyNoteTemplate;
	const [currentNote, setCurrentNote] = useState<Note>(initialNote);
	const [dirty, setDirty] = useState<boolean>(
		initialNote.content !== currentNote.content,
	);

	const currentNoteRef = useRef(currentNote);
	const dirtyRef = useRef(dirty);

	useEffect(() => {
		currentNoteRef.current = currentNote;
		dirtyRef.current = dirty;
	}, [currentNote, dirty]);

	// trigger save on unmount
	useEffect(() => {
		return () => {
			if (dirtyRef.current && !currentNoteRef.current.isDeleted) {
				if (currentNote.id) {
					noteUpdateHandler(currentNoteRef.current.id, {
						content: currentNoteRef.current.content,
						preview: currentNoteRef.current.preview,
					});
				} else {
					noteCreateHandler({
						content: currentNoteRef.current.content,
						preview: currentNoteRef.current.preview,
					});
				}
			}
		};
	}, []);

	// trigger save on unload
	useEffect(() => {
		const handleUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			if (dirtyRef.current && !currentNoteRef.current.isDeleted) {
				if (currentNote.id) {
					noteUpdateHandler(currentNoteRef.current.id, {
						content: currentNoteRef.current.content,
						preview: currentNoteRef.current.preview,
					});
				} else {
					noteCreateHandler({
						content: currentNoteRef.current.content,
						preview: currentNoteRef.current.preview,
					});
				}
			}
		};
		window.addEventListener("beforeunload", handleUnload);
		return () => {
			window.removeEventListener("beforeunload", handleUnload);
		};
	}, []);

	const noteDeleteHelper = () => {
		noteSoftDeleteHandler(currentNoteRef.current.id);
		navigate("/dashboard/notes", { replace: true });
	};

	const noteRestoreHelper = () => {
		noteRestoreHandler(currentNoteRef.current.id);
		navigate("/dashboard/trash", { replace: true });
	};

	const notePermanentlyDeleteHelper = () => {
		notePermanentDeleteHandler(currentNoteRef.current.id);
		navigate("/dashboard/trash", { replace: true });
	};

	const editor = useEditor({
		onUpdate: (state) => {
			const contentJson = state.editor.getJSON();
			const contentPreview = state.editor.getHTML();
			setDirty(JSON.stringify(contentJson) !== initialNote.content);
			setCurrentNote((prev) => ({
				...prev,
				content: JSON.stringify(contentJson),
				preview: contentPreview,
			}));
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
		content: safeParseForEditor(currentNote.content),
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
									<UndoRedoButton action="undo" />
									<UndoRedoButton action="redo" />
								</ToolbarGroup>
								<ToolbarSeparator />
								<ToolbarGroup>
									<HeadingDropdownMenu levels={[1, 2, 3, 4]} />
									<ListDropdownMenu
										types={["bulletList", "orderedList", "taskList"]}
									/>
									<BlockquoteButton />
									<CodeBlockButton />
								</ToolbarGroup>
								<ToolbarSeparator />
								<ToolbarGroup>
									<MarkButton type="bold" />
									<MarkButton type="italic" />
									<MarkButton type="strike" />
									<MarkButton type="code" />
									<MarkButton type="underline" />
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
						<ToolbarSeparator />
						<ToolbarGroup>
							<CustomizableButton
								onClick={() => {
									if (currentNoteRef.current.isDeleted) {
										noteRestoreHelper();
									} else {
										noteDeleteHelper();
									}
								}}
								className="
								text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-200 
								hover:bg-neutral-200 dark:hover:bg-neutral-700/80 p-2">
								{currentNoteRef.current.isDeleted ? <MdRestore /> : <LuTrash />}
							</CustomizableButton>
							{currentNoteRef.current.isDeleted && (
								<CustomizableButton
									onClick={() => notePermanentlyDeleteHelper()}
									className="text-red-500 hover:bg-neutral-200 dark:hover:bg-neutral-700/80 p-2">
									<LuTrash />
								</CustomizableButton>
							)}
						</ToolbarGroup>
					</div>
					<EditorContent
						editor={editor}
						className="w-full overflow-scroll grow [&_.ProseMirror]:h-full [&_.ProseMirror]:min-h-full [&_.ProseMirror]:outline-none"
					/>
				</div>
			</EditorContext.Provider>
		</div>
	);
};

export default NotePage;
