// import Highlight from "@tiptap/extension-highlight";
// import Image from "@tiptap/extension-image";
// import { TaskItem, TaskList } from "@tiptap/extension-list";
// import Subscript from "@tiptap/extension-subscript";
// import Superscript from "@tiptap/extension-superscript";
// import TextAlign from "@tiptap/extension-text-align";
// import Typography from "@tiptap/extension-typography";
// import { Selection } from "@tiptap/extensions";
// import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";

const NotePage = () => {
	// const editor = useEditor({
	// 	immediatelyRender: false,
	// 	editorProps: {
	// 		attributes: {
	// 			autocomplete: "off",
	// 			autocorrect: "off",
	// 			autocapitalize: "off",
	// 			"aria-label": "Main content area, start typing to enter text.",
	// 			class: "simple-editor",
	// 		},
	// 	},
	// 	extensions: [
	// 		StarterKit.configure({
	// 			horizontalRule: false,
	// 			link: {
	// 				openOnClick: false,
	// 				enableClickSelection: true,
	// 			},
	// 		}),
	// 		HorizontalRule,
	// 		TextAlign.configure({ types: ["heading", "paragraph"] }),
	// 		TaskList,
	// 		TaskItem.configure({ nested: true }),
	// 		Highlight.configure({ multicolor: true }),
	// 		Image,
	// 		Typography,
	// 		Superscript,
	// 		Subscript,
	// 		Selection,
	// 		ImageUploadNode.configure({
	// 			accept: "image/*",
	// 			maxSize: MAX_FILE_SIZE,
	// 			limit: 3,
	// 			upload: handleImageUpload,
	// 			onError: (error: Error) => console.error("Upload failed:", error),
	// 		}),
	// 	],
	// 	content: "<p></p>",
	// });

	// if (!editor) return null;

	return (
		<div className="p-4 grow h-full w-full flex justify-center">
			Notepage
			{/* <EditorContext.Provider value={{ editor }}>
				<div className="md:w-[90%] flex flex-col gap-1">
					<MainToolbarContent />
					<EditorContent
						editor={editor}
						className="w-full grow [&_.ProseMirror]:h-full [&_.ProseMirror]:min-h-full [&_.ProseMirror]:outline-none"
					/>
				</div>
			</EditorContext.Provider> */}
		</div>
	);
};

// const MainToolbarContent = () => {
// 	return (
// 		<div className="flex gap-1 flex-wrap justify-center w-full">
// 			<ToolbarGroup>
// 				<UndoRedoButton action="undo" />
// 				<UndoRedoButton action="redo" />
// 			</ToolbarGroup>

// 			<ToolbarSeparator />

// 			<ToolbarGroup>
// 				<HeadingDropdownMenu levels={[1, 2, 3, 4]} />
// 				<ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} />
// 				<BlockquoteButton />
// 				<CodeBlockButton />
// 			</ToolbarGroup>

// 			<ToolbarSeparator />

// 			<ToolbarGroup>
// 				<MarkButton type="bold" />
// 				<MarkButton type="italic" />
// 				<MarkButton type="strike" />
// 				<MarkButton type="code" />
// 				<MarkButton type="underline" />
// 			</ToolbarGroup>

// 			<ToolbarSeparator />

// 			<ToolbarGroup>
// 				<MarkButton type="superscript" />
// 				<MarkButton type="subscript" />
// 			</ToolbarGroup>

// 			<ToolbarSeparator />

// 			<ToolbarGroup>
// 				<TextAlignButton align="left" />
// 				<TextAlignButton align="center" />
// 				<TextAlignButton align="right" />
// 				<TextAlignButton align="justify" />
// 			</ToolbarGroup>

// 			<ToolbarSeparator />

// 			<ToolbarGroup>
// 				<ImageUploadButton text="Add" />
// 			</ToolbarGroup>
// 		</div>
// 	);
// };

export default NotePage;
