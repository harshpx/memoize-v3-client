import { useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { LuMenu, LuPlus } from "react-icons/lu";
import { useStore } from "@/context/store";
import { conversationCreateHandler } from "@/services/services";

const ConversationDrawer = () => {
	const [open, setOpen] = useState(false);
	const { conversations, selectedConversation, conversationsLoading } =
		useStore();

	const selectConversation = (conversationId: string) => {
		useStore.setState({ selectedConversation: conversationId });
	};
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					className={cn(
						"rounded-full py-2 px-3 cursor-pointer box-border z-50 text-black dark:text-white",
						"bg-accent-light/60 hover:bg-accent-light/80 dark:bg-accent-dark/60 dark:hover:bg-accent-dark/80",
					)}>
					<LuMenu className="text-xl" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				className={cn(
					"w-64 rounded-2xl",
					"bg-neutral-500/10 dark:bg-neutral-400/10 backdrop-blur-xl",
					"border border-neutral-300 dark:border-neutral-700",
				)}>
				<div className="">
					<div className="text-xl">Conversations</div>
					<div className="flex flex-col gap-1 mt-2 overflow-y-auto max-h-64">
						{conversationsLoading ? (
							<div>Loading...</div>
						) : (
							<>
								{!conversations.find((c) => c.isNew) && (
									<div
										onClick={() => conversationCreateHandler()}
										className={cn(
											"flex gap-1 items-center py-2 px-3 cursor-pointer rounded-xl text-sm",
											"bg-black/5 dark:bg-white/10",
										)}>
										<LuPlus className="size-4" />
										<span>New Chat</span>
									</div>
								)}
								{conversations.map((conversation) => (
									<div
										key={conversation.id}
										onClick={() => selectConversation(conversation.id)}
										className={cn(
											"py-2 px-3 cursor-pointer rounded-xl text-sm",
											selectedConversation === conversation.id &&
												"bg-accent-light/40 dark:bg-accent-dark/20",
										)}>
										{conversation.name}
									</div>
								))}
							</>
						)}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default ConversationDrawer;
