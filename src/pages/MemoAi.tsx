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
		conversationsLoading,
		conversations,
		user,
	} = useStore();
	const [currentQuery, setCurrentQuery] = useState("");

	const didRun = useRef(false);

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

	const sendQuery = async () => {
		if (currentQuery.trim() === "") return;
		setCurrentQuery("");
		const temp = currentQuery.trim();
		await llmQueryHandler(selectedConversation, temp);
	};

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
				<div className="w-full grow flex flex-col-reverse gap-2 overflow-y-auto max-h-[100vh]">
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
						<div className="h-full w-full flex flex-col items-center justify-center opacity-70">
							<LuBotMessageSquare className="size-40" />
							<div className="flex flex-col items-center mt-1 text-center text-sm">
								<span>Hi {user?.name || "there"}!</span>
								<span>Ask Memo AI anything.</span>
							</div>
						</div>
					)}
				</div>
				{/* input box */}
				<div className="flex gap-1 items-center w-full h-10 shrink-0">
					<Input
						value={currentQuery}
						onChange={(e) => setCurrentQuery(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								sendQuery();
							}
						}}
						placeholder="Ask Memo AI anything..."
						className={cn(
							"rounded-xl h-full outline-none border-2 border-neutral-200 dark:border-neutral-800",
							"focus-visible:ring-0 focus-visible:border-accent-light",
						)}
					/>
					<CustomizableButton
						onClick={sendQuery}
						className="bg-accent-light/60 hover:bg-accent-light/80 dark:bg-accent-dark/60 dark:hover:bg-accent-dark/80 px-4 py-2 rounded-xl h-full">
						<LuSendHorizontal />
					</CustomizableButton>
				</div>
			</div>
		</div>
	);
};

export default MemoAi;
