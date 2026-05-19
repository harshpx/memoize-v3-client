import ChatMessage from "@/components/custom/ChatMessage";
import CustomizableButton from "@/components/custom/CustomizableButton";
import { ChatsLoadingSkeleton } from "@/components/custom/LoadingSkeletons";
import ThemeSwitch from "@/components/custom/ThemeSwitch";
import { Input } from "@/components/ui/input";
import { useStore, type PaginatedData } from "@/context/store";
import type { AiChat } from "@/lib/commonTypes";
import { cn } from "@/lib/utils";
import { aiChatQueryHandler, aiChatsFetchHandler } from "@/services/services";
import { useEffect, useRef, useState } from "react";

const MemoAi = () => {
	const aiChatsData: PaginatedData<AiChat> = useStore((state) => state.aiChats);
	const aiChatsLoading = useStore((state) => state.aiChatsLoading);

	const [currentQuery, setCurrentQuery] = useState("");

	const didRun = useRef(false);

	useEffect(() => {
		if (didRun.current) return;
		didRun.current = true;
		if (aiChatsData.pageNumber === -1) {
			aiChatsFetchHandler();
		}
	}, []);

	const sendQuery = async () => {
		if (currentQuery.trim() === "") return;
		await aiChatQueryHandler(currentQuery);
		setCurrentQuery("");
	};

	if (aiChatsLoading) {
		return (
			<div className="w-full h-full border flex items-center justify-center">
				<ChatsLoadingSkeleton />
			</div>
		);
	}

	return (
		<div className="h-full w-full flex justify-center relative">
			<div className="absolute right-2 top-2 z-50">
				<ThemeSwitch />
			</div>
			<div className="w-full py-2 sm:w-[640px] flex flex-col gap-2 justify-end items-center">
				{/* chat messages */}
				<div className="w-full grow flex flex-col-reverse gap-2 overflow-y-auto max-h-[100vh]">
					{aiChatsData.data.length > 0 &&
						aiChatsData.data.map((chat) => (
							<ChatMessage key={chat.id} chat={chat} />
						))}
				</div>
				{/* input box */}
				<div className="flex gap-1 items-center w-full">
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
							"rounded-xl h-full outline-none border-[1.5]",
							"focus-visible:ring-0 focus-visible:border-accent-light",
						)}
					/>
					<CustomizableButton
						onClick={sendQuery}
						className="bg-accent-dark dark:bg-accent-dark text-white px-4 py-2 rounded-xl">
						Send
					</CustomizableButton>
				</div>
			</div>
		</div>
	);
};

export default MemoAi;
