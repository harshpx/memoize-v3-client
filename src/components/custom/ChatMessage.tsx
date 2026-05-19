import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/image-upload-node/image-upload-node.scss";
import "@/components/tiptap-ui-primitive/toolbar/toolbar.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

import type { AiChat } from "@/lib/commonTypes";
import { cn } from "@/lib/utils";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { LuBotMessageSquare, LuUser } from "react-icons/lu";
import { Markdown } from "@tiptap/markdown";
import { useEffect } from "react";

export interface ChatMessageProps {
	chat: AiChat;
	className?: string;
}

const ChatPrettyView = ({ text }: { text: string }) => {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				horizontalRule: false,
				link: {
					openOnClick: false,
					enableClickSelection: true,
				},
			}),
			Markdown,
		],
		content: text,
		contentType: "markdown",
		editable: false,
	});

	useEffect(() => {
		if (!editor) return;
		const currentMarkdown = editor.getMarkdown();
		if (text !== currentMarkdown) {
			const content = editor.storage.markdown.manager.parse(text);
			editor.commands.setContent(content, {
				parseOptions: { preserveWhitespace: "full" },
			});
		}
	}, [text, editor]);

	return <EditorContent editor={editor} />;
};
const ChatMessage = ({ chat, className = "" }: ChatMessageProps) => {
	return (
		<div
			className={cn(
				"flex gap-1",
				chat.type === "QUESTION" ? "self-end items-center" : "self-start",
				className,
			)}>
			{chat.type === "ANSWER" && (
				<LuBotMessageSquare className="size-6 text-black dark:text-white mt-1.5" />
			)}
			<div className="text-sm rounded-xl border p-2 w-fit">
				<ChatPrettyView text={chat.content} />
			</div>
			{chat.type === "QUESTION" && (
				<LuUser className="size-6 text-black dark:text-white" />
			)}
		</div>
	);
};

export default ChatMessage;
