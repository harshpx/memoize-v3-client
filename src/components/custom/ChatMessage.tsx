import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/image-upload-node/image-upload-node.scss";
import "@/components/tiptap-ui-primitive/toolbar/toolbar.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

import type { Chat } from "@/lib/commonTypes";
import { cn } from "@/lib/utils";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { LuBotMessageSquare, LuUser } from "react-icons/lu";
import { Markdown } from "@tiptap/markdown";
import { useEffect } from "react";

export interface ChatMessageProps {
	chat: Chat;
	className?: string;
}

const sanitizeMarkdown = (text: string) => {
	return text
		.replace(/\*\*`([^`]+)`\*\*/g, "`$1`")
		.replace(/__`([^`]+)`__/g, "`$1`");
};

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
		content: sanitizeMarkdown(text),
		contentType: "markdown",
		editable: false,
	});

	useEffect(() => {
		if (!editor) return;

		try {
			const currentMarkdown = editor.getMarkdown();
			if (text !== currentMarkdown) {
				const content = editor.storage.markdown.manager.parse(
					sanitizeMarkdown(text),
				);
				editor.commands.setContent(content, {
					parseOptions: { preserveWhitespace: "full" },
				});
			}
		} catch (err) {
			console.error("Markdown parse failed: ", err);
			editor.commands.setContent(text);
		}
	}, [text, editor]);

	return <EditorContent editor={editor} />;
};

const ChatMessage = ({ chat, className = "" }: ChatMessageProps) => {
	return (
		<div
			className={cn(
				"flex gap-1",
				chat.type === "QUESTION" ? "self-end max-w-2/3" : "self-start",
				className,
			)}>
			{chat.type === "ANSWER" && (
				<LuBotMessageSquare className="size-6 shrink-0 text-black dark:text-white mt-1.5" />
			)}
			<div
				className={cn(
					"text-sm rounded-xl p-2 w-fit backdrop-blur-sm",
					chat.type === "QUESTION"
						? "bg-accent-light/50 dark:bg-accent-dark/50"
						: "bg-neutral-600/5 dark:bg-neutral-300/5",
					chat.type === "QUESTION"
						? ""
						: "border border-neutral-200 dark:border-neutral-800",
				)}>
				<ChatPrettyView text={chat.content} />
			</div>
			{chat.type === "QUESTION" && (
				<LuUser className="size-6 shrink-0 text-black dark:text-white mt-1.5" />
			)}
		</div>
	);
};

export default ChatMessage;
