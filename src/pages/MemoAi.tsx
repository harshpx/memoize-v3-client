import ChatMessage from "@/components/custom/ChatMessage";
import ConversationDrawer from "@/components/custom/ConversationDrawer";
import CustomizableButton from "@/components/custom/CustomizableButton";
import { ChatsLoadingSkeleton } from "@/components/custom/LoadingSkeletons";
import ThemeSwitch from "@/components/custom/ThemeSwitch";
import { Input } from "@/components/ui/input";
import { useStore } from "@/context/store";
import type { Chat } from "@/lib/commonTypes";
import { cn } from "@/lib/utils";
import {
	chatsFetchHandler,
	conversationsFetchHandler,
	llmQueryHandler,
} from "@/services/services";
import { useEffect, useRef, useState } from "react";
import { LuBotMessageSquare, LuSendHorizontal } from "react-icons/lu";

const MemoAi = () => {
	const {
		chats,
		selectedConversation,
		chatsLoading,
		chatStreaming,
		conversationsLoading,
		conversations,
		user,
	} = useStore();
	const [currentQuery, setCurrentQuery] = useState("");

	const didRun = useRef(false);
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const inputBoxRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (didRun.current) return;
		didRun.current = true;
		conversationsFetchHandler();
	}, []);

	useEffect(() => {
		if (!selectedConversation) return;
		if (!chats[selectedConversation]) {
			chatsFetchHandler(selectedConversation);
		}
	}, [selectedConversation]);

	const currentChats = chats[selectedConversation] ?? [];
	const lastChat = currentChats[currentChats.length - 1];

	useEffect(() => {
		const container = chatContainerRef.current;
		if (!container) return;
		container.scrollTo({
			top: container.scrollHeight,
			behavior: "smooth",
		});
	}, [selectedConversation, currentChats.length, lastChat?.content]);

	const sendQuery = async () => {
		if (currentQuery.trim() === "") return;
		setCurrentQuery("");
		const temp = currentQuery.trim();
		await llmQueryHandler(selectedConversation, temp);
	};

	useEffect(() => {
		if (!inputBoxRef.current) return;
		if (!chatStreaming) {
			inputBoxRef.current.focus();
		}
	}, [chatStreaming]);

	if (conversationsLoading) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<ChatsLoadingSkeleton />
			</div>
		);
	}

	return (
		<div className="h-full w-full flex justify-center">
			{/* Header */}
			<div className="absolute left-0 top-0 w-full flex items-center justify-between gap-4 px-4 h-[60px]">
				<ConversationDrawer />
				<span className="text-sm text-nowrap overflow-hidden text-ellipsis truncate">
					{selectedConversation &&
						conversations.find((c) => c.id === selectedConversation)?.name}
				</span>
				<ThemeSwitch />
			</div>
			<div className="w-full py-2 sm:w-[640px] flex flex-col gap-2 justify-end items-center mt-[60px]">
				{/* chat messages */}
				<div
					ref={chatContainerRef}
					className="w-full grow min-h-0 overflow-y-auto overflow-x-hidden">
					<div className="min-h-full flex flex-col justify-end gap-2">
						{chatsLoading ? (
							<div className="w-full h-full flex items-center justify-center">
								<ChatsLoadingSkeleton />
							</div>
						) : selectedConversation &&
						  chats[selectedConversation] &&
						  Array.isArray(chats[selectedConversation]) &&
						  chats[selectedConversation].length > 0 ? (
							chats[selectedConversation].map((chat: Chat) => (
								<ChatMessage key={chat.id} chat={chat} />
							))
						) : (
							<div className="h-full w-full flex flex-col items-center justify-center opacity-70 mb-10">
								<LuBotMessageSquare className="size-40" />
								<div className="flex flex-col items-center mt-1 text-center text-sm">
									<span>Hi {user?.name || "there"}!</span>
									<span>Ask Memo AI anything.</span>
								</div>
							</div>
						)}
					</div>
				</div>
				{/* input box */}
				<div className="flex gap-1 items-center w-full h-10 shrink-0">
					<Input
						autoFocus
						ref={inputBoxRef}
						value={currentQuery}
						disabled={chatStreaming}
						onChange={(e) => setCurrentQuery(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								sendQuery();
							}
						}}
						placeholder="Ask Memo AI anything..."
						className={cn(
							"backdrop-blur-md shadow-sm bg-neutral-100 dark:bg-neutral-900",
							"rounded-xl h-full outline-none border border-neutral-300 dark:border-neutral-700",
							"focus-visible:ring-0 focus-visible:border-neutral-300 focus-visible:dark:border-neutral-700",
						)}
					/>
					<CustomizableButton
						onClick={sendQuery}
						className={cn(
							"bg-accent-light/60 hover:bg-accent-light/80 dark:bg-accent-dark/60 dark:hover:bg-accent-dark/80",
							"px-4 py-2 rounded-xl h-full",
						)}>
						<LuSendHorizontal />
					</CustomizableButton>
				</div>
			</div>
		</div>
	);
};

export default MemoAi;
